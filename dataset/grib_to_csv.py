"""
Utility script to convert downloaded CAMS *.grib files into CSV files.
Each site's CSV files are stored under a dedicated folder inside the
configured output directory.
"""

import argparse
import os
import sys
from datetime import datetime, timedelta
from typing import Dict, List, Optional

import pandas as pd
import xarray as xr
import cfgrib
import eccodes


def parse_args():
    parser = argparse.ArgumentParser(description="Convert CAMS GRIB files to CSV per site.")
    parser.add_argument(
        "--input-dir",
        default="cams_downloads_monthly",
        help="Directory that contains the *.grib files.",
    )
    parser.add_argument(
        "--output-dir",
        default="site_csv",
        help="Directory where site-wise CSV folders will be created.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Regenerate CSV files even if they already exist.",
    )
    parser.add_argument(
        "--site",
        type=int,
        help="If provided, only convert files for this 1-based site id.",
    )
    return parser.parse_args()


def extract_site_id(filename: str) -> Optional[int]:
    """Pull the 1-based site id from filenames like cams_site_6_2019-01.grib."""
    name = os.path.basename(filename)
    parts = name.split("_")
    if len(parts) < 4:
        return None
    try:
        return int(parts[2])
    except ValueError:
        return None


def discover_filter_groups(grib_path: str) -> List[Dict[str, object]]:
    """Inspect the GRIB file and return distinct filter_by_keys combinations."""
    combos = {}
    with open(grib_path, "rb") as fh:
        while True:
            try:
                gid = eccodes.codes_grib_new_from_file(fh)
            except eccodes.CodesInternalError:
                break

            if gid is None:
                break

            combo: Dict[str, object] = {
                "edition": int(eccodes.codes_get_long(gid, "edition")),
                "shortName": eccodes.codes_get_string(gid, "shortName"),
            }
            if eccodes.codes_is_defined(gid, "typeOfLevel"):
                combo["typeOfLevel"] = eccodes.codes_get_string(gid, "typeOfLevel")
            if eccodes.codes_is_defined(gid, "level"):
                combo["level"] = float(eccodes.codes_get_double(gid, "level"))

            # Include spatial metadata to separate tiles with slightly different coords.
            for key in (
                "latitudeOfFirstGridPointInDegrees",
                "latitudeOfLastGridPointInDegrees",
                "longitudeOfFirstGridPointInDegrees",
                "longitudeOfLastGridPointInDegrees",
                "latitude",
                "longitude",
            ):
                if eccodes.codes_is_defined(gid, key):
                    combo[key] = float(eccodes.codes_get_double(gid, key))

            key = tuple(sorted(combo.items()))
            combos.setdefault(key, combo)
            eccodes.codes_release(gid)

    return list(combos.values())


def load_grib_datasets(grib_path: str):
    """Return a list of xarray datasets contained in the GRIB file."""
    base_kwargs = {"indexpath": ""}  # avoid writing .idx files next to grib

    try:
        ds = xr.open_dataset(grib_path, engine="cfgrib", backend_kwargs=base_kwargs)
        return [ds]
    except cfgrib.dataset.DatasetBuildError:
        pass

    datasets = []
    for filter_keys in discover_filter_groups(grib_path):
        backend_kwargs = {**base_kwargs, "filter_by_keys": filter_keys}
        try:
            ds = xr.open_dataset(grib_path, engine="cfgrib", backend_kwargs=backend_kwargs)
            datasets.append(ds)
        except Exception as exc:
            print(f"[warn] filter {filter_keys} failed: {exc}")

    if datasets:
        return datasets

    return cfgrib.open_datasets(grib_path, backend_kwargs=base_kwargs)


def handle_via_cfgrib(grib_path: str):
    datasets = load_grib_datasets(grib_path)
    if not datasets:
        raise RuntimeError("No datasets found in GRIB file.")

    merged = xr.merge(
        datasets,
        compat="override",  # tolerate tiny coord rounding differences
        combine_attrs="drop_conflicts",
    )

    df = merged.to_dataframe().reset_index()
    merged.close()
    for ds in datasets:
        ds.close()
    return df


def build_valid_time(data_date: int, data_time: int, step_hours: int) -> datetime:
    base = datetime.strptime(str(data_date), "%Y%m%d")
    hour = data_time // 100
    minute = data_time % 100
    base = base + timedelta(hours=hour, minutes=minute)
    return base + timedelta(hours=step_hours)


def handle_via_eccodes(grib_path: str) -> pd.DataFrame:
    rows: Dict[tuple, Dict[str, object]] = {}
    with open(grib_path, "rb") as fh:
        while True:
            try:
                gid = eccodes.codes_grib_new_from_file(fh)
            except eccodes.CodesInternalError:
                break

            if gid is None:
                break

            short_name = eccodes.codes_get_string(gid, "shortName")
            data_date = eccodes.codes_get_long(gid, "dataDate")
            data_time = eccodes.codes_get_long(gid, "dataTime")
            step = int(eccodes.codes_get_double(gid, "step"))
            valid_time = build_valid_time(data_date, data_time, step)

            level = eccodes.codes_get_double(gid, "level") if eccodes.codes_is_defined(gid, "level") else None
            latitudes = eccodes.codes_get_array(gid, "latitudes")
            longitudes = eccodes.codes_get_array(gid, "longitudes")
            values = eccodes.codes_get_array(gid, "values")

            for lat, lon, val in zip(latitudes, longitudes, values):
                key = (valid_time, round(float(lat), 6), round(float(lon), 6), level)
                row = rows.setdefault(
                    key,
                    {
                        "valid_time": valid_time.isoformat(),
                        "latitude": round(float(lat), 6),
                        "longitude": round(float(lon), 6),
                    },
                )
                if level is not None:
                    row["level"] = level
                row[short_name] = float(val)

            eccodes.codes_release(gid)

    if not rows:
        raise RuntimeError("ECCODES fallback could not decode any messages.")

    return pd.DataFrame(rows.values())


def grib_to_csv(grib_path: str, csv_path: str) -> None:
    """Convert a single GRIB file into a CSV file using xarray/cfgrib."""
    try:
        df = handle_via_cfgrib(grib_path)
    except Exception as cf_err:
        print(f"[info] cfgrib merge failed ({cf_err}); falling back to eccodes decode.")
        df = handle_via_eccodes(grib_path)

    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    df.to_csv(csv_path, index=False)


def main():
    args = parse_args()
    input_dir = args.input_dir
    output_root = args.output_dir

    if not os.path.isdir(input_dir):
        print(f"Input directory '{input_dir}' not found.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(output_root, exist_ok=True)

    grib_files = [
        os.path.join(input_dir, fname)
        for fname in os.listdir(input_dir)
        if fname.lower().endswith(".grib")
    ]

    if not grib_files:
        print("No .grib files found.")
        return

    converted = 0
    for grib_path in sorted(grib_files):
        site_id = extract_site_id(grib_path)
        if site_id is None:
            print(f"Skipping '{grib_path}' (unable to determine site id).")
            continue

        if args.site and site_id != args.site:
            continue

        site_dir = os.path.join(output_root, f"site_{site_id:02d}")
        csv_filename = os.path.splitext(os.path.basename(grib_path))[0] + ".csv"
        csv_path = os.path.join(site_dir, csv_filename)

        if not args.overwrite and os.path.exists(csv_path):
            print(f"[skip] {csv_path} already exists.")
            continue

        print(f"[convert] {grib_path} -> {csv_path}")
        try:
            grib_to_csv(grib_path, csv_path)
            converted += 1
        except Exception as exc:
            print(f"[error] Failed converting '{grib_path}': {exc}")

    if converted == 0:
        print("No files converted.")
    else:
        print(f"Converted {converted} file(s).")


if __name__ == "__main__":
    main()


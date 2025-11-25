"""
Script to fetch air quality data for all Delhi monitoring sites
"""

import argparse

from air_quality_pipeline import AirQualityPipeline, load_site_coordinates


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch AQI data for every Delhi site")
    parser.add_argument(
        "--sites-file",
        type=str,
        help="Optional path to lat/lon file (defaults to shared lat_lon_sites.txt)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="delhi_all_sites_air_quality.json",
        help="Where to store the aggregated JSON output",
    )
    return parser.parse_args()


def main():
    """Fetch air quality data for all Delhi sites"""
    args = parse_args()
    sites = load_site_coordinates(args.sites_file)

    print("=" * 70)
    print("DELHI AIR QUALITY DATA PIPELINE - ALL SITES")
    print("=" * 70)
    print(f"Fetching data for {len(sites)} monitoring sites in Delhi")
    if args.sites_file:
        print(f"Using coordinates from: {args.sites_file}")
    print()
    
    # Initialize pipeline
    pipeline = AirQualityPipeline(city="delhi")
    
    # Fetch data for all sites
    results = pipeline.fetch_multiple_locations(sites)
    
    # Display summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total Sites: {results['total_locations']}")
    print(f"Successful: {results['summary']['successful']}")
    print(f"Errors: {results['summary']['errors']}")
    print("=" * 70)
    
    # Display detailed results table
    print("\n" + "=" * 70)
    print("DETAILED RESULTS")
    print("=" * 70)
    print(f"{'Site':<6} {'Status':<8} {'Station Name':<30} {'AQI':<6} {'NO2 (µg/m³)':<12} {'O3 (µg/m³)':<12} {'Features snapshot':<40}")
    print("-" * 110)
    
    for loc in results["locations"]:
        site = loc.get("site")
        status = loc.get("status", "unknown")
        
        if status == "success":
            data = loc.get("data", {})
            station = data.get("station_name", "N/A")
            aqi = data.get("overall_aqi", "N/A")
            no2 = data.get("concentrations", {}).get("no2", {}).get("value")
            o3 = data.get("concentrations", {}).get("o3", {}).get("value")
            
            # Truncate station name if too long
            if len(station) > 28:
                station = station[:25] + "..."
            
            available_features = data.get("available_features", {})
            feature_keys = ["year", "month", "day", "hour", "O3_forecast", "NO2_forecast", "T_forecast", "q_forecast", "w_forecast"]
            feature_pairs = [f"{key}={round(available_features[key], 2) if isinstance(available_features[key], float) else available_features[key]}"
                             for key in feature_keys if key in available_features]
            feature_str = ", ".join(feature_pairs) if feature_pairs else "-"

            print(f"{site:<6} {'✓':<8} {station:<30} {aqi if aqi else 'N/A':<6} {no2 if no2 else 'N/A':<12} {o3 if o3 else 'N/A':<12} {feature_str:<40}")
        else:
            error = loc.get("error", "Unknown error")
            if len(error) > 50:
                error = error[:47] + "..."
            print(f"{site:<6} {'✗':<8} {error:<30} {'-':<6} {'-':<12} {'-':<12} {'-':<40}")
    
    print("=" * 70)
    
    # Save to file
    pipeline.save_to_file(results, args.output)
    
    print(f"\n✓ Data saved to {args.output}")
    print("\nYou can also run: python air_quality_pipeline.py --multiple")
    
if __name__ == "__main__":
    main()


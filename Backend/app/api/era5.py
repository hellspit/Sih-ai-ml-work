from fastapi import APIRouter
import cdsapi
import os

router = APIRouter(
    prefix="/api/v1/era5",
    tags=["ERA5 Downloader"]
)

@router.get("/download")
def download_era5():
    # --------- CREATE FOLDER IF NOT EXISTS ---------
    save_folder = "data_era5"
    os.makedirs(save_folder, exist_ok=True)

    # Output file path
    filepath = os.path.join(save_folder, "era5_2025_12_01.nc")

    # --------- ERA5 REQUEST ---------
    dataset = "reanalysis-era5-single-levels"
    request = {
        "product_type": ["reanalysis"],
        "variable": [
            "10m_u_component_of_wind",
            "10m_v_component_of_wind",
            "2m_dewpoint_temperature",
            "2m_temperature",
            "total_cloud_cover",
            "boundary_layer_height"
        ],
        "year": ["2025"],
        "month": ["12"],
        "day": ["01"],
        "time": [
            "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
            "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
            "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
            "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
        ],
        "data_format": "netcdf",
        "download_format": "unarchived",
        "area": [28.69536, 77.18, 28.69, 77.18168]
    }

    # --------- DOWNLOAD ---------
    client = cdsapi.Client()
    client.retrieve(dataset, request).download(target=filepath)

    return {"message": "Download completed!", "file_path": filepath}

"""
Real-time Air Quality Data Pipeline for Delhi
Fetches live NO2 and O3 (Ozone) concentrations from World Air Quality Index API
"""

import json
import os
import re
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


DEFAULT_DELHI_SITES = [
    {"site": 1, "latitude": 28.69536, "longitude": 77.18168},
    {"site": 2, "latitude": 28.5718, "longitude": 77.07125},
    {"site": 3, "latitude": 28.58278, "longitude": 77.23441},
    {"site": 4, "latitude": 28.82286, "longitude": 77.10197},
    {"site": 5, "latitude": 28.53077, "longitude": 77.27123},
    {"site": 6, "latitude": 28.72954, "longitude": 77.09601},
    {"site": 7, "latitude": 28.71052, "longitude": 77.24951}
]


def _default_sites_file_candidates() -> List[Path]:
    """Return possible locations for the lat/lon file."""
    repo_root = Path(__file__).resolve().parents[1]
    candidates = [
        repo_root / "models" / "Data_SIH_2025" / "lat_lon_sites.txt",
        repo_root / "Backend" / "Data_SIH_2025" / "lat_lon_sites.txt",
        repo_root / "Backend" / "app" / "Data_SIH_2025" / "lat_lon_sites.txt",
    ]
    # Keep order but drop duplicates
    seen = set()
    unique_candidates = []
    for cand in candidates:
        if cand not in seen:
            unique_candidates.append(cand)
            seen.add(cand)
    return unique_candidates


def _parse_sites_file(file_path: Path) -> List[Dict[str, float]]:
    """Parse lat/lon file into the format expected by the pipeline."""
    sites: List[Dict[str, float]] = []
    with open(file_path, encoding="utf-8") as f:
        for raw_line in f:
            line = raw_line.strip()
            if not line or line.lower().startswith("site"):
                continue
            parts = re.split(r"[,\s]+", line)
            if len(parts) < 3:
                continue
            try:
                site_id = int(parts[0])
            except ValueError:
                site_id = len(sites) + 1
            try:
                lat = float(parts[1])
                lng = float(parts[2])
            except ValueError as exc:
                raise ValueError(f"Invalid coordinates in {file_path}: {line}") from exc
            sites.append({"site": site_id, "latitude": lat, "longitude": lng})
    if not sites:
        raise ValueError(f"No site coordinates found in {file_path}")
    return sites


def load_site_coordinates(file_path: Optional[str] = None) -> List[Dict[str, float]]:
    """
    Load site coordinates either from a provided path or from known defaults.
    Falls back to the baked-in list if no file is available.
    """
    candidates: List[Path] = []
    if file_path:
        candidates.append(Path(file_path).expanduser())
    candidates.extend(_default_sites_file_candidates())

    for candidate in candidates:
        if not candidate.exists():
            continue
        try:
            sites = _parse_sites_file(candidate)
            print(f"Loaded {len(sites)} site coordinates from {candidate}")
            return sites
        except Exception as exc:
            print(f"Warning: failed to parse {candidate}: {exc}")

    print("Warning: falling back to built-in Delhi site coordinates")
    # Return a shallow copy so callers can mutate safely
    return [dict(site) for site in DEFAULT_DELHI_SITES]


def _get_iaqi_value(iaqi: Dict[str, Any], key: str) -> Optional[float]:
    """Safely extract individual AQI value."""
    value_obj = iaqi.get(key)
    if isinstance(value_obj, dict):
        return value_obj.get("v")
    if isinstance(value_obj, (int, float)):
        return float(value_obj)
    return None


def _parse_measurement_datetime(time_info: Dict[str, Any]) -> Optional[datetime]:
    """Try to parse the measurement timestamp returned by WAQI."""
    time_str = time_info.get("s") or time_info.get("iso")
    if not time_str:
        return None
    try:
        return datetime.fromisoformat(time_str)
    except ValueError:
        pass
    # WAQI sometimes omits separators, try common fallback formats
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y/%m/%d %H:%M:%S"):
        try:
            return datetime.strptime(time_str, fmt)
        except ValueError:
            continue
    return None


def _extract_available_feature_values(data_section: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract whatever model feature columns can be sourced from WAQI data.
    Only includes fields that the API actually exposes.
    """
    iaqi = data_section.get("iaqi", {})
    measurement_dt = _parse_measurement_datetime(data_section.get("time", {}))
    if not measurement_dt:
        measurement_dt = datetime.now()

    features: Dict[str, Any] = {
        "year": measurement_dt.year,
        "month": measurement_dt.month,
        "day": measurement_dt.day,
        "hour": measurement_dt.hour,
    }

    def set_feature(name: str, value: Optional[float]):
        if value is not None:
            features[name] = value

    set_feature("O3_forecast", _get_iaqi_value(iaqi, "o3"))
    set_feature("NO2_forecast", _get_iaqi_value(iaqi, "no2"))
    set_feature("T_forecast", _get_iaqi_value(iaqi, "t"))
    set_feature("q_forecast", _get_iaqi_value(iaqi, "h"))  # humidity proxy
    set_feature("w_forecast", _get_iaqi_value(iaqi, "w"))

    return features


class AirQualityPipeline:
    """Pipeline to fetch and process real-time air quality data for Delhi"""
    
    def __init__(self, api_token: Optional[str] = None, city: str = "delhi"):
        """
        Initialize the Air Quality Pipeline
        
        Args:
            api_token: WAQI API token (if None, will try to get from environment)
            city: City name or station ID (default: "delhi")
        """
        self.api_token = api_token or os.getenv("WAQI_API_TOKEN", "demo")
        self.city = city
        self.base_url = "https://api.waqi.info/feed"
        self.session = requests.Session()
        
    def fetch_air_quality_data(self, location: Optional[str] = None) -> Dict[str, Any]:
        """
        Fetch real-time air quality data for a location
        
        Args:
            location: City name, station ID, or coordinates (format: "geo:lat;lng")
                     If None, uses self.city
        
        Returns:
            Dictionary containing the API response
        """
        query_location = location or self.city
        url = f"{self.base_url}/{query_location}/"
        params = {"token": self.api_token}
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status") == "error":
                error_msg = data.get("message", "Unknown error")
                raise Exception(f"API Error: {error_msg}")
            
            return data
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error: {str(e)}")
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON response: {str(e)}")
    
    def fetch_by_coordinates(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch air quality data for a specific coordinate pair
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
        
        Returns:
            Dictionary containing the API response
        """
        # WAQI API format for coordinates: geo:lat;lng
        location = f"geo:{latitude};{longitude}"
        return self.fetch_air_quality_data(location)
    
    def extract_no2_o3_concentrations(self, api_data: Dict[str, Any], 
                                     requested_lat: Optional[float] = None,
                                     requested_lng: Optional[float] = None) -> Dict[str, Any]:
        """
        Extract NO2 and O3 (Ozone) concentrations from API response
        
        Args:
            api_data: Raw API response dictionary
            requested_lat: Original requested latitude (for tracking)
            requested_lng: Original requested longitude (for tracking)
            
        Returns:
            Dictionary with extracted NO2 and O3 data
        """
        if api_data.get("status") != "ok":
            return {"error": "Invalid API response status"}
        
        data = api_data.get("data", {})
        iaqi = data.get("iaqi", {})
        
        # Extract NO2 concentration
        no2_data = iaqi.get("no2", {})
        no2_value = no2_data.get("v") if no2_data else None
        
        # Extract O3 (Ozone) concentration
        o3_data = iaqi.get("o3", {})
        o3_value = o3_data.get("v") if o3_data else None
        
        # Get station coordinates
        station_geo = data.get("city", {}).get("geo", [None, None])
        station_lat = station_geo[0] if isinstance(station_geo, list) and len(station_geo) > 0 else None
        station_lng = station_geo[1] if isinstance(station_geo, list) and len(station_geo) > 1 else None
        
        available_features = _extract_available_feature_values(data)

        # Extract additional metadata
        result = {
            "timestamp": datetime.now().isoformat(),
            "station_id": data.get("idx"),
            "station_name": data.get("city", {}).get("name"),
            "requested_location": {
                "latitude": requested_lat,
                "longitude": requested_lng
            } if requested_lat is not None and requested_lng is not None else None,
            "station_location": {
                "latitude": station_lat,
                "longitude": station_lng
            },
            "overall_aqi": data.get("aqi"),
            "measurement_time": data.get("time", {}).get("s"),
            "timezone": data.get("time", {}).get("tz"),
            "concentrations": {
                "no2": {
                    "value": no2_value,
                    "unit": "µg/m³",
                    "available": no2_value is not None
                },
                "o3": {
                    "value": o3_value,
                    "unit": "µg/m³",
                    "available": o3_value is not None
                }
            },
            "all_iaqi": iaqi,  # Include all individual AQI values for reference
            "available_features": available_features
        }
        
        return result
    
    def get_delhi_air_quality(self) -> Dict[str, Any]:
        """
        Main method to fetch and extract NO2 and O3 concentrations for Delhi
        
        Returns:
            Dictionary with processed air quality data
        """
        try:
            # Fetch raw data from API
            raw_data = self.fetch_air_quality_data()
            
            # Extract NO2 and O3 concentrations
            processed_data = self.extract_no2_o3_concentrations(raw_data)
            
            return {
                "status": "success",
                "data": processed_data,
                "raw_response": raw_data  # Include raw response for debugging
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def get_air_quality_by_coordinates(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetch and extract NO2 and O3 concentrations for specific coordinates
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
        
        Returns:
            Dictionary with processed air quality data
        """
        try:
            # Fetch raw data from API using coordinates
            raw_data = self.fetch_by_coordinates(latitude, longitude)
            
            # Extract NO2 and O3 concentrations
            processed_data = self.extract_no2_o3_concentrations(raw_data, latitude, longitude)
            
            return {
                "status": "success",
                "data": processed_data,
                "raw_response": raw_data
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "requested_coordinates": {
                    "latitude": latitude,
                    "longitude": longitude
                }
            }
    
    def fetch_multiple_locations(self, coordinates_list: list) -> Dict[str, Any]:
        """
        Fetch air quality data for multiple coordinate pairs
        
        Args:
            coordinates_list: List of dictionaries with 'site', 'latitude', 'longitude'
                             Example: [{"site": 1, "latitude": 28.69536, "longitude": 77.18168}, ...]
        
        Returns:
            Dictionary with results for all locations
        """
        results = {
            "status": "success",
            "timestamp": datetime.now().isoformat(),
            "total_locations": len(coordinates_list),
            "locations": []
        }
        
        print(f"Fetching data for {len(coordinates_list)} locations...\n")
        
        for idx, coord in enumerate(coordinates_list, 1):
            site_num = coord.get("site", idx)
            lat = coord.get("latitude")
            lng = coord.get("longitude")
            
            if lat is None or lng is None:
                results["locations"].append({
                    "site": site_num,
                    "status": "error",
                    "error": "Missing latitude or longitude"
                })
                continue
            
            print(f"[{idx}/{len(coordinates_list)}] Fetching data for Site {site_num} ({lat}, {lng})...")
            
            result = self.get_air_quality_by_coordinates(lat, lng)
            
            location_result = {
                "site": site_num,
                "requested_coordinates": {
                    "latitude": lat,
                    "longitude": lng
                },
                **result
            }
            
            results["locations"].append(location_result)
            
            # Display results
            if result["status"] == "success":
                data = result["data"]
                no2 = data["concentrations"]["no2"]["value"]
                o3 = data["concentrations"]["o3"]["value"]
                print(f"  ✓ Success - Station: {data.get('station_name', 'N/A')}")
                print(f"    NO2: {no2 if no2 else 'N/A'} µg/m³ | O3: {o3 if o3 else 'N/A'} µg/m³")
                available_features = data.get("available_features", {})
                feature_keys = ["year", "month", "day", "hour", "O3_forecast", "NO2_forecast", "T_forecast", "q_forecast", "w_forecast"]
                feature_pairs = [f"{key}={round(available_features[key], 2) if isinstance(available_features[key], float) else available_features[key]}"
                                 for key in feature_keys if key in available_features]
                if feature_pairs:
                    print(f"    Available features -> {', '.join(feature_pairs)}")
            else:
                print(f"  ✗ Error: {result.get('error', 'Unknown error')}")
            
            print()
            
            # Add small delay to avoid rate limiting
            if idx < len(coordinates_list):
                time.sleep(0.5)
        
        # Count successes and errors
        success_count = sum(1 for loc in results["locations"] if loc.get("status") == "success")
        error_count = len(results["locations"]) - success_count
        
        results["summary"] = {
            "successful": success_count,
            "errors": error_count
        }
        
        return results
    
    def save_to_file(self, data: Dict[str, Any], filename: str = "delhi_air_quality.json"):
        """
        Save air quality data to a JSON file
        
        Args:
            data: Data dictionary to save
            filename: Output filename
        """
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filename}")
    
    def continuous_monitoring(self, interval_seconds: int = 3600, output_file: Optional[str] = None):
        """
        Continuously monitor air quality at specified intervals
        
        Args:
            interval_seconds: Time between fetches in seconds (default: 1 hour)
            output_file: Optional file to append data to
        """
        print(f"Starting continuous monitoring for {self.city}")
        print(f"Fetch interval: {interval_seconds} seconds ({interval_seconds/60:.1f} minutes)")
        print("Press Ctrl+C to stop\n")
        
        all_data = []
        
        try:
            while True:
                print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching data...")
                
                result = self.get_delhi_air_quality()
                
                if result["status"] == "success":
                    data = result["data"]
                    no2 = data["concentrations"]["no2"]["value"]
                    o3 = data["concentrations"]["o3"]["value"]
                    
                    print(f"  Station: {data.get('station_name', 'N/A')}")
                    print(f"  Overall AQI: {data.get('overall_aqi', 'N/A')}")
                    print(f"  NO2: {no2 if no2 else 'N/A'} µg/m³")
                    print(f"  O3: {o3 if o3 else 'N/A'} µg/m³")
                    print()
                    
                    all_data.append(result)
                    
                    # Save to file if specified
                    if output_file:
                        self.save_to_file(all_data, output_file)
                else:
                    print(f"  Error: {result.get('error', 'Unknown error')}\n")
                
                # Wait for next interval
                time.sleep(interval_seconds)
                
        except KeyboardInterrupt:
            print("\n\nMonitoring stopped by user")
            if all_data and output_file:
                print(f"Final data saved to {output_file}")
                self.save_to_file(all_data, output_file)


def main():
    """Main function to run the pipeline"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Air Quality Data Pipeline for Delhi")
    parser.add_argument("--token", type=str, help="WAQI API token (or set WAQI_API_TOKEN env var)")
    parser.add_argument("--city", type=str, default="delhi", help="City name (default: delhi)")
    parser.add_argument("--output", type=str, help="Output JSON file path")
    parser.add_argument("--continuous", action="store_true", help="Run continuous monitoring")
    parser.add_argument("--interval", type=int, default=3600, help="Interval in seconds for continuous mode (default: 3600)")
    parser.add_argument("--multiple", action="store_true", help="Fetch data for multiple Delhi sites")
    parser.add_argument("--sites-file", type=str, help="Optional path to lat/lon file for --multiple mode")
    
    args = parser.parse_args()
    
    # Initialize pipeline
    pipeline = AirQualityPipeline(api_token=args.token, city=args.city)
    
    if args.multiple:
        # Fetch data for all Delhi sites using provided file or defaults
        delhi_sites = load_site_coordinates(args.sites_file)
        if not delhi_sites:
            print("No site coordinates available. Aborting.")
            return

        print("=" * 70)
        print("FETCHING AIR QUALITY DATA FOR ALL DELHI SITES")
        print("=" * 70)
        print()
        
        results = pipeline.fetch_multiple_locations(delhi_sites)
        
        # Display summary
        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print(f"Total Sites: {results['total_locations']}")
        print(f"Successful: {results['summary']['successful']}")
        print(f"Errors: {results['summary']['errors']}")
        print("=" * 70)
        
        # Display detailed results
        print("\nDETAILED RESULTS:")
        print("-" * 70)
        for loc in results["locations"]:
            site = loc.get("site")
            if loc.get("status") == "success":
                data = loc.get("data", {})
                no2 = data.get("concentrations", {}).get("no2", {}).get("value")
                o3 = data.get("concentrations", {}).get("o3", {}).get("value")
                station = data.get("station_name", "N/A")
                aqi = data.get("overall_aqi", "N/A")
                print(f"Site {site}: ✓ | Station: {station} | AQI: {aqi} | NO2: {no2 if no2 else 'N/A'} | O3: {o3 if o3 else 'N/A'}")
            else:
                error = loc.get("error", "Unknown error")
                print(f"Site {site}: ✗ | Error: {error}")
        
        # Save to file
        output_file = args.output or "delhi_all_sites_air_quality.json"
        pipeline.save_to_file(results, output_file)
        
    elif args.continuous:
        # Run continuous monitoring
        pipeline.continuous_monitoring(
            interval_seconds=args.interval,
            output_file=args.output or "delhi_air_quality_continuous.json"
        )
    else:
        # Single fetch
        print(f"Fetching air quality data for {args.city}...\n")
        result = pipeline.get_delhi_air_quality()
        
        if result["status"] == "success":
            data = result["data"]
            
            print("=" * 60)
            print("AIR QUALITY DATA FOR DELHI")
            print("=" * 60)
            print(f"Station ID: {data.get('station_id', 'N/A')}")
            print(f"Station Name: {data.get('station_name', 'N/A')}")
            print(f"Location: {data.get('station_location', {}).get('latitude', 'N/A')}, {data.get('station_location', {}).get('longitude', 'N/A')}")
            print(f"Overall AQI: {data.get('overall_aqi', 'N/A')}")
            print(f"Measurement Time: {data.get('measurement_time', 'N/A')}")
            print(f"Timezone: {data.get('timezone', 'N/A')}")
            print("\n" + "-" * 60)
            print("CONCENTRATIONS:")
            print("-" * 60)
            
            no2 = data["concentrations"]["no2"]
            o3 = data["concentrations"]["o3"]
            
            print(f"NO2: {no2['value'] if no2['value'] else 'N/A'} {no2['unit']} {'✓' if no2['available'] else '✗ Not available'}")
            print(f"O3:  {o3['value'] if o3['value'] else 'N/A'} {o3['unit']} {'✓' if o3['available'] else '✗ Not available'}")
            print("=" * 60)
            
            # Print all available IAQI values
            if data.get("all_iaqi"):
                print("\nAll Available Individual AQI Values:")
                for pollutant, value_obj in data["all_iaqi"].items():
                    if isinstance(value_obj, dict) and "v" in value_obj:
                        print(f"  {pollutant.upper()}: {value_obj['v']}")
            
        else:
            print(f"Error: {result.get('error', 'Unknown error')}")
        
        # Save to file if specified
        if args.output:
            pipeline.save_to_file(result, args.output)
        else:
            # Save to default file
            pipeline.save_to_file(result, "delhi_air_quality.json")


if __name__ == "__main__":
    main()


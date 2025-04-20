// Basic location and routing service without Google Maps
export interface Location {
  lat: number;
  lng: number;
}

export interface Hospital {
  name: string;
  location: Location;
  distance: number;
  duration: number;
}

class MapService {
  private static instance: MapService;

  private constructor() {}

  public static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  public async getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Failed to get current location. ';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location services in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please ensure location services are enabled.';
          }
          reject(new Error(errorMessage));
        }
      );
    });
  }

  public async findNearestHospitals(): Promise<Hospital[]> {
    // Simulated hospital data
    return [
      {
        name: "Central Hospital",
        location: { lat: 40.7128, lng: -74.006 },
        distance: 2.5,
        duration: 8
      },
      {
        name: "City Medical Center",
        location: { lat: 40.7589, lng: -73.9851 },
        distance: 3.2,
        duration: 12
      }
    ];
  }

  public async calculateRoute(origin: Location, destination: Location): Promise<{
    distance: number;
    duration: number;
    steps: string[];
  }> {
    // Simulated route data
    return {
      distance: 2.5,
      duration: 8,
      steps: [
        "Head north on Main Street",
        "Turn right onto Hospital Avenue",
        "Destination will be on your right"
      ]
    };
  }
}

export const mapService = MapService.getInstance();
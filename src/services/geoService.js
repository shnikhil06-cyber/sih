export class GeoService {
  static async getCurrentLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        lat: 18.5089,
        lng: 73.9259,
        placeName: 'Pune Region',
        fullString: 'Pune Region (18.5089° N, 73.9259° E)',
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          let placeName = 'Live Device Location';

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
              { signal: AbortSignal.timeout(3000) }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const area = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || '';
              const city = addr.city || addr.town || addr.county || addr.state_district || 'Detected Region';
              placeName = area ? `${area}, ${city}` : city;
            }
          } catch {
            // Fallback if reverse geocoding API times out or is offline
            placeName = 'Current Location';
          }

          resolve({
            lat,
            lng,
            placeName,
            fullString: `${placeName} (${lat}° N, ${lng}° E)`,
          });
        },
        () => {
          // Geolocation permission denied or error fallback
          resolve({
            lat: 18.5089,
            lng: 73.9259,
            placeName: 'Hadapsar, Pune',
            fullString: 'Hadapsar, Pune (18.5089° N, 73.9259° E)',
          });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }
}

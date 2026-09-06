export class GeoService {
  static async getCurrentLocation() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return {
        lat: 18.5089,
        lng: 73.9259,
        placeName: 'Hadapsar, Pune',
        fullString: 'Hadapsar, Pune (18.5089° N, 73.9259° E)',
      };
    }

    return new Promise((resolve) => {
      let resolved = false;

      const finish = (lat, lng, placeName) => {
        if (resolved) return;
        resolved = true;
        resolve({
          lat,
          lng,
          placeName,
          fullString: `${placeName} (${lat}° N, ${lng}° E)`,
        });
      };

      // Safety timeout after 5 seconds to ensure app doesn't hang
      const safetyTimeout = setTimeout(() => {
        finish(18.5089, 73.9259, 'Hadapsar, Pune');
      }, 5000);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          clearTimeout(safetyTimeout);
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          let placeName = `${lat}° N, ${lng}° E`;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
              { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const area = addr.suburb || addr.neighbourhood || addr.residential || addr.city_district || addr.road || '';
              const city = addr.city || addr.town || addr.county || addr.state_district || 'Pune';
              placeName = area ? `${area}, ${city}` : city;
            }
          } catch {
            placeName = 'Detected Location';
          }

          finish(lat, lng, placeName);
        },
        (_err) => {
          clearTimeout(safetyTimeout);
          // Try low accuracy fallback if high accuracy was denied/timed out
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = Number(pos.coords.latitude.toFixed(4));
              const lng = Number(pos.coords.longitude.toFixed(4));
              finish(lat, lng, 'Current Device Location');
            },
            () => {
              finish(18.5089, 73.9259, 'Hadapsar, Pune');
            },
            { enableHighAccuracy: false, timeout: 3000 }
          );
        },
        { enableHighAccuracy: true, timeout: 4000, maximumAge: 30000 }
      );
    });
  }
}

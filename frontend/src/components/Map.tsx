'use client';

import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import Loader from './Loader';

const libraries: any = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px'
};

const center = {
  lat: 34.0522, // Placeholder venue lat (e.g., LA)
  lng: -118.2437 // Placeholder venue lng
};

export default function VenueMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  if (loadError) {
    return <div style={{ color: 'var(--accent-danger)' }}>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <Loader text="Loading Google Maps..." />;
  }

  return (
    <div role="application" aria-label="Interactive Venue Map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={16}
        center={center}
        options={{ disableDefaultUI: true, styles: [ { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] } ] }}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}

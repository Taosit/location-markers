import { onMounted, ref } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export const useMap = () => {
  const mapDiv = ref<HTMLDivElement | null>(null);
  const map = ref<google.maps.Map | null>(null);
  const markers = ref<google.maps.Marker[]>([]);

  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAP_API,
  });

  onMounted(async () => {
    if (!mapDiv.value) return;
    await loader.load();
    map.value = new google.maps.Map(mapDiv.value, {
      zoom: 10,
      center: { lat: 49.2, lng: -123 },
    });
  });

  const adjustBoundsAndZoom = () => {
    if (!map.value || markers.value.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    markers.value.forEach((marker) => {
      bounds.extend(marker.getPosition()!);
    });
    map.value.fitBounds(bounds);
    const zoomValue = map.value.getZoom();
    if (zoomValue && zoomValue > 10) {
      map.value.setZoom(10);
    }
  };

  const addMarker = (lat: number, lng: number) => {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: map.value,
    });
    markers.value.push(marker);
    adjustBoundsAndZoom();
  };

  const removeMarker = ({ lat, lng }: { lat: number; lng: number }) => {
    const markerIndex = markers.value.findIndex(
      (marker) => marker.getPosition()?.lat() === lat && marker.getPosition()?.lng() === lng
    );
    if (markerIndex === -1) return;
    markers.value[markerIndex].setMap(null);
    markers.value.splice(markerIndex, 1);
  };

  const removeMarkers = (coords: { lat: number; lng: number }[]) => {
    coords.forEach((coord) => {
      removeMarker(coord);
    });
    adjustBoundsAndZoom();
  };

  return {
    mapDiv,
    addMarker,
    removeMarkers,
  };
};

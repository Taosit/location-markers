import { onMounted, ref, toRaw } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import type { Coords, Location } from "@/App.vue";

export const useMap = (initialLocations?: Location[]) => {
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
    if (initialLocations && initialLocations.length > 0) {
      initialLocations.forEach((location) => {
        addMarker(location.coords);
      });
      adjustBoundsAndZoom();
    }
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

  const addMarker = (coords: Coords) => {
    const marker = new google.maps.Marker({
      position: coords,
      map: map.value,
    });
    markers.value.push(marker);
  };

  const removeMarker = ({ lat, lng }: Coords) => {
    const markerIndex = markers.value.findIndex(
      (marker) => marker.getPosition()?.lat() === lat && marker.getPosition()?.lng() === lng
    );
    if (markerIndex === -1) return;
    toRaw(markers.value[markerIndex]).setMap(null);
    markers.value.splice(markerIndex, 1);
  };

  return {
    mapDiv,
    addMarker,
    removeMarker,
    adjustBoundsAndZoom,
  };
};

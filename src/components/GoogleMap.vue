<script setup lang="ts">
import { computed, onMounted, ref, watch, toRaw } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import type { Location } from "@/App.vue";

const props = defineProps<{
  locations: Location[];
}>();

const latestCoords = computed(() => {
  const latestLocation = props.locations?.[0];
  return latestLocation ? latestLocation.coords : { lat: 49.2, lng: -123 };
});

const mapDiv = ref<HTMLDivElement | null>(null);
const map = ref<google.maps.Map | null>(null);

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAP_API,
});

onMounted(async () => {
  if (!mapDiv.value) return;
  if (!map.value) {
    await loader.load();
    map.value = new google.maps.Map(mapDiv.value, {
      zoom: 10,
      center: latestCoords.value,
    });
  }
});

const markers = ref<google.maps.Marker[]>([]);

const adjustBoundsAndZoom = () => {
  if (!map.value) return;
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

watch(
  () => props.locations.length,
  () => {
    if (!map.value || props.locations.length === 0) return;
    const newLocation = props.locations[0];
    const marker = new google.maps.Marker({
      position: newLocation.coords,
      map: map.value,
      title: newLocation.name,
    });
    markers.value.push(marker);
    adjustBoundsAndZoom();
  }
);

watch(
  () => props.locations,
  () => {
    if (!map.value) return;
    const deletedLocations = props.locations.filter((l) => l.deleted);
    if (deletedLocations.length === 0) return;
    markers.value = markers.value.filter((marker) => {
      const isMarkerDeleted = deletedLocations.some(
        (l) =>
          l.coords.lat === marker.getPosition()?.lat() &&
          l.coords.lng === marker.getPosition()?.lng()
      );
      if (isMarkerDeleted) {
        toRaw(marker).setMap(null);
        return false;
      }
      return true;
    });
    adjustBoundsAndZoom();
  }
);
</script>

<template>
  <div ref="mapDiv" class="map"></div>
</template>

<style scoped>
.map {
  width: 400px;
  height: 300px;
  background-color: brown;
}
</style>

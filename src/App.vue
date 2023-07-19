<script setup lang="ts">
import Search from "./components/Search.vue";
import SearchHistory from "./components/SearchHistory.vue";
import { ref } from "vue";
import { useMap } from "@/composables/useMap";

export type Coords = {
  lat: number;
  lng: number;
};

export type Location = {
  coords: Coords;
  timestamp: number;
  name: string;
};

const locationHistory = ref<Location[]>([]);

const { mapDiv, addMarker, removeMarkers } = useMap();

const addLocation = (location: Location) => {
  locationHistory.value = [location, ...locationHistory.value];
  addMarker(location.coords.lat, location.coords.lng);
};

const deleteLocations = (locationsToDelete: Location[]) => {
  locationHistory.value = locationHistory.value.filter(
    (l) => !locationsToDelete.some((l2) => l2.timestamp === l.timestamp)
  );
  const coords = locationsToDelete.map((l) => l.coords);
  removeMarkers(coords);
};
</script>

<template>
  <header>
    <h1>Locations</h1>
  </header>

  <main>
    <div class="col">
      <Search @search="addLocation" />
      <div ref="mapDiv" class="map"></div>
    </div>
    <SearchHistory :history="locationHistory" @deleteLocations="deleteLocations" />
  </main>
</template>

<style scoped>
.map {
  width: 400px;
  height: 300px;
  background-color: brown;
}
</style>
@/composables/useMap

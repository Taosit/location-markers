<script setup lang="ts">
import Search from "./components/Search.vue";
import SearchHistory from "./components/SearchHistory.vue";
import { ref } from "vue";
import { useMap } from "@/composables/useMap";
import TimeZoneInfo from "./components/TimeZoneInfo.vue";
import { seedLocations } from "@/seeds/locations";

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

const { mapDiv, addMarker, removeMarker, adjustBoundsAndZoom } = useMap();

const addLocation = (location: Location) => {
  locationHistory.value = [location, ...locationHistory.value];
  addMarker(location.coords);
  adjustBoundsAndZoom();
};

const deleteLocations = (locationsToDelete: Location[]) => {
  locationHistory.value = locationHistory.value.filter(
    (l) => !locationsToDelete.some((l2) => l2.timestamp === l.timestamp)
  );
  locationsToDelete.forEach((l) => removeMarker(l.coords));
  adjustBoundsAndZoom();
};

const addSeedLocations = () => {
  seedLocations.forEach((l) => addLocation(l));
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
      <TimeZoneInfo
        :key="locationHistory[0].timestamp"
        v-if="locationHistory.length > 0"
        :location="locationHistory[0]"
      />
    </div>
    <SearchHistory
      :history="locationHistory"
      @addSeedLocations="addSeedLocations"
      @deleteLocations="deleteLocations"
    />
  </main>
</template>

<style scoped>
.map {
  width: 400px;
  height: 300px;
  background-color: rgb(56, 175, 234);
}
</style>

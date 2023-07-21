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
  <main class="main-container">
    <div class="map-col">
      <Search @search="addLocation" />
      <div ref="mapDiv" class="map"></div>
      <TimeZoneInfo
        :key="locationHistory[0].timestamp"
        v-if="locationHistory.length > 0"
        :location="locationHistory[0]"
      />
    </div>
    <div class="history-col">
      <SearchHistory
        :history="locationHistory"
        @addSeedLocations="addSeedLocations"
        @deleteLocations="deleteLocations"
      />
    </div>
  </main>
</template>

<style scoped>
.main-container {
  width: var(--content-width);
  margin-inline: auto;
  margin-block: 2rem;
}
.map {
  margin-top: 2rem;
  background-color: rgb(56, 175, 234);
  position: relative;
  width: 100%;
  padding-top: 75%;
  height: 0;
  overflow: hidden;
  border-radius: 2px;
}

@media (min-width: 850px) {
  .main-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
  .map-col {
    flex-basis: 400px;
    flex-grow: 2;
  }
  .history-col {
    flex-grow: 1;
    display: flex;
  }
  .map {
    margin-top: 1rem;
  }
}
</style>

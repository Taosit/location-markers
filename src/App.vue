<script setup lang="ts">
import Search from "./components/SearchArea.vue";
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
const invalidSearchString = ref("");

const { mapDiv, addMarker, removeMarker, adjustBoundsAndZoom } = useMap();

const addLocation = (location: Location) => {
  invalidSearchString.value = "";
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

const showSearchError = (location: string) => {
  invalidSearchString.value = location;
};

const closeErrorMessage = () => {
  invalidSearchString.value = "";
};
</script>

<template>
  <main class="main-container">
    <div class="map-col">
      <Search @search="addLocation" @error="showSearchError" />
      <div class="map-container">
        <div ref="mapDiv" class="map"></div>
        <div v-if="invalidSearchString" class="overlay">
          <div class="error-message-container">
            <button class="close-button" @click="closeErrorMessage">&times;</button>
            <p class="error-message">Sorry, we couldn't find "{{ invalidSearchString }}".</p>
            <p class="error-message">Please try a different location.</p>
          </div>
        </div>
      </div>
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

.map-container {
  position: relative;
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

.overlay {
  position: absolute;
  inset: 0;
  background-color: #00000080;
}

.error-message-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1.5rem 1rem 1rem;
  background-color: var(--white);
  border-radius: 2px;
}

.close-button {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  font-size: 1.5rem;
  color: var(--text-light);
  line-height: 1;
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

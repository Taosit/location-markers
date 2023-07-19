<script setup lang="ts">
import { ref } from "vue";
import Search from "./components/Search.vue";
import GoogleMap from "./components/GoogleMap.vue";
import SearchHistory from "./components/SearchHistory.vue";

export type Coords = {
  lat: number;
  lng: number;
};

export type Location = {
  coords: Coords;
  timestamp: number;
  name: string;
  deleted: boolean;
};

const locationHistory = ref<Location[]>([]);

const updateSearch = (location: Location) => {
  locationHistory.value = [location, ...locationHistory.value];
};

const deleteLocations = (ids: number[]) => {
  locationHistory.value = locationHistory.value.map((l) => {
    if (ids.includes(l.timestamp)) {
      return {
        ...l,
        deleted: true,
      };
    }
    return l;
  });
};
</script>

<template>
  <header>
    <h1>Locations</h1>
  </header>

  <main>
    <div class="col">
      <Search @search="updateSearch" />
      <GoogleMap :locations="locationHistory" />
    </div>
    <SearchHistory :history="locationHistory" @deleteLocations="deleteLocations" />
  </main>
</template>

<style scoped></style>

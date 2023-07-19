<script setup lang="ts">
import type { Location } from "@/App.vue";
import { ref } from "vue";

const searchString = ref("");

const emit = defineEmits<{
  (e: "search", location: Location): void;
}>();

const search = () => {
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${searchString.value}&key=${
      import.meta.env.VITE_GOOGLE_MAP_API
    }`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "OK" || data.results.length === 0) {
        throw new Error("No results found");
      }
      const { lat, lng } = data.results[0].geometry.location;
      emit("search", {
        coords: { lat, lng },
        timestamp: Date.now(),
        name: searchString.value,
        deleted: false,
      });
      searchString.value = "";
    });
};

const isGeolocationSupported = "geolocation" in navigator;

type Address = {
  long_name: string;
  short_name: string;
  types: string[];
};

const getUserLocation = () => {
  if (!isGeolocationSupported) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude: lat, longitude: lng } = position.coords;
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
        import.meta.env.VITE_GOOGLE_MAP_API
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status !== "OK" || data.results.length === 0) {
          throw new Error("No results found");
        }
        const city = data.results[0].address_components.find((c: Address) =>
          c.types.includes("locality")
        );
        emit("search", {
          coords: { lat, lng },
          timestamp: Date.now(),
          name: city.long_name,
          deleted: false,
        });
      });
  });
};
</script>

<template>
  <div class="greetings">
    <button class="find-my-location" @click="getUserLocation">Find my location</button>
    <form @submit.prevent="search">
      <input type="text" v-model="searchString" />
      <button>Search location</button>
    </form>
  </div>
</template>

<style scoped></style>

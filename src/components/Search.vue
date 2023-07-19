<script setup lang="ts">
import type { Location } from "@/App.vue";
import { ref } from "vue";
import { fetcher } from "@/utils/fetcher";

const searchString = ref("");

const emit = defineEmits<{
  (e: "search", location: Location): void;
}>();

const search = () => {
  fetcher("https://maps.googleapis.com/maps/api/geocode/json", { address: searchString.value })
    .then((data) => {
      const { lat, lng } = data[0].geometry.location;
      emit("search", {
        coords: { lat, lng },
        timestamp: Date.now(),
        name: searchString.value,
      });
      searchString.value = "";
    })
    .catch((err) => {
      console.log(err);
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

    fetcher("https://maps.googleapis.com/maps/api/geocode/json", { latlng: `${lat},${lng}` })
      .then((data) => {
        const city = data[0].address_components.find((c: Address) => c.types.includes("locality"));
        emit("search", {
          coords: { lat, lng },
          timestamp: Date.now(),
          name: city.long_name,
        });
      })
      .catch((err) => {
        console.log(err);
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

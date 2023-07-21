<script setup lang="ts">
import type { Location } from "@/App.vue";
import { ref } from "vue";
import { fetcher } from "@/utils/fetcher";
import LocationIcon from "./icons/location.svg";
import SearchIcon from "./icons/search.svg";

const searchString = ref("");
const inputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: "search", location: Location): void;
  (e: "error", location: string): void;
}>();

const search = () => {
  if (!searchString.value) return;
  fetcher("https://maps.googleapis.com/maps/api/geocode/json", { address: searchString.value })
    .then((data) => {
      const { lat, lng } = data.results[0].geometry.location;
      emit("search", {
        coords: { lat, lng },
        timestamp: Date.now(),
        name: searchString.value,
      });
      searchString.value = "";
    })
    .catch(() => {
      emit("error", searchString.value);
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
        const city = data.results[0].address_components.find((c: Address) =>
          c.types.includes("locality")
        );
        emit("search", {
          coords: { lat, lng },
          timestamp: Date.now(),
          name: city.long_name,
        });
      })
      .catch(() => {
        emit("error", "your location");
      });
  });
};

const handleIconClick = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};
</script>

<template>
  <div class="search-area">
    <button class="find-my-location" @click="getUserLocation">
      Find my location
      <img :src="LocationIcon" alt="location" />
    </button>
    <form @submit.prevent="search">
      <img :src="SearchIcon" @click="handleIconClick" alt="search" />
      <input ref="inputRef" type="text" v-model="searchString" />
      <button>Search location</button>
    </form>
  </div>
</template>

<style scoped>
.search-area {
  container-type: inline-size;
}

.find-my-location {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--variant-dark);
  display: flex;
  margin-bottom: 0.5rem;
}

form {
  position: relative;
}

form img {
  position: absolute;
  top: 7px;
  left: 8px;
}

input {
  width: 100%;
  border: none;
  border-radius: 2px;
  padding: 0.75em 0.5em;
  padding-left: 42px;
  font-size: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

button {
  white-space: nowrap;
}

form button {
  width: 100%;
  font-size: 1.125rem;
  background-color: var(--primary-dark);
  color: white;
  padding: 0.25em 1em;
  border-radius: 2px;
  margin-top: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

@container (min-width: 450px) {
  form {
    display: flex;
    gap: 1rem;
  }
  form button {
    width: auto;
    margin-top: 0;
  }
}

@media (min-width: 884px) {
  form {
    display: flex;
    gap: 1rem;
  }
  form button {
    width: auto;
    margin-top: 0;
  }
}
</style>

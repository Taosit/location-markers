<script setup lang="ts">
import type { Location } from "@/App.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  history: Location[];
}>();

const emit = defineEmits<{
  (e: "deleteLocations", ids: number[]): void;
}>();

const pageNumber = ref(1);
const selectedLocations = ref<number[]>([]);

const locations = computed(() => {
  return props.history.filter((l) => !l.deleted);
});
const totalPageNumber = computed(() => {
  return Math.ceil(locations.value.length / 10);
});

const locationsOnPage = computed(() => {
  const start = (pageNumber.value - 1) * 10;
  const end = pageNumber.value * 10;
  return locations.value.slice(start, end);
});

const toggleLocation = (timestamp: number) => {
  const index = selectedLocations.value.indexOf(timestamp);
  if (index === -1) {
    selectedLocations.value = [...selectedLocations.value, timestamp];
  } else {
    selectedLocations.value = selectedLocations.value.filter((t) => t !== timestamp);
  }
};

const toggleAllLocations = () => {
  if (selectedLocations.value.length === locationsOnPage.value.length) {
    selectedLocations.value = [];
  } else {
    selectedLocations.value = locationsOnPage.value.map((l) => l.timestamp);
  }
};

const deleteSelectedLocations = () => {
  emit("deleteLocations", selectedLocations.value);
  selectedLocations.value = [];
};
</script>

<template>
  <div>
    <div class="table-header">
      <input
        v-if="locationsOnPage.length > 0"
        type="checkbox"
        :checked="selectedLocations.length === locationsOnPage.length"
        @change="toggleAllLocations"
      />
      <button @click="deleteSelectedLocations">Delete</button>
      <p>
        {{ pageNumber * 10 - 9 }} - {{ Math.min(pageNumber * 10, locations.length) }} of
        {{ locations.length }}
      </p>
    </div>
    <ol class="location-list">
      <li v-for="location in locationsOnPage" :key="location.timestamp" class="location">
        <input
          type="checkbox"
          :checked="selectedLocations.includes(location.timestamp)"
          @change="toggleLocation(location.timestamp)"
        />
        <p>{{ location.name }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.location-list {
  list-style: none;
  padding: 0;
}

.location {
  display: flex;
  align-items: center;
}
</style>

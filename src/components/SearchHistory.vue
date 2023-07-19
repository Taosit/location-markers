<script setup lang="ts">
import type { Location } from "@/App.vue";
import { computed, ref } from "vue";

const props = defineProps<{
  history: Location[];
}>();

const emit = defineEmits<{
  (e: "deleteLocations", locations: Location[]): void;
}>();

const pageNumber = ref(1);
const selectedLocations = ref<Location[]>([]);

const totalPageNumber = computed(() => {
  return Math.ceil(props.history.length / 10);
});

const locationsOnPage = computed(() => {
  const start = (pageNumber.value - 1) * 10;
  const end = pageNumber.value * 10;
  return props.history.slice(start, end);
});

const toggleLocation = (location: Location) => {
  const isSelected = selectedLocations.value.find((l) => l.timestamp === location.timestamp);
  if (!isSelected) {
    selectedLocations.value = [...selectedLocations.value, location];
  } else {
    selectedLocations.value = selectedLocations.value.filter(
      (l) => l.timestamp !== location.timestamp
    );
  }
};

const toggleAllLocations = () => {
  if (selectedLocations.value.length === locationsOnPage.value.length) {
    selectedLocations.value = [];
  } else {
    selectedLocations.value = locationsOnPage.value;
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
        {{ pageNumber * 10 - 9 }} - {{ Math.min(pageNumber * 10, props.history.length) }} of
        {{ props.history.length }}
      </p>
    </div>
    <ol class="location-list">
      <li v-for="location in locationsOnPage" :key="location.timestamp" class="location">
        <input
          type="checkbox"
          :checked="selectedLocations.some((l) => l.timestamp === location.timestamp)"
          @change="toggleLocation(location)"
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

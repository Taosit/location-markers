<script setup lang="ts">
import type { Location } from "@/App.vue";
import { computed, ref } from "vue";
import DeleteIcon from "./icons/delete.svg";
import ChevronLeftIcon from "./icons/chveron-left.svg";
import ChevronRightIcon from "./icons/chevron-right.svg";

const props = defineProps<{
  history: Location[];
}>();

const emit = defineEmits<{
  (e: "deleteLocations", locations: Location[]): void;
  (e: "addSeedLocations"): void;
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
  if (selectedLocations.value.length === props.history.length) {
    selectedLocations.value = [];
  } else {
    selectedLocations.value = props.history;
  }
};

const deleteSelectedLocations = () => {
  emit("deleteLocations", selectedLocations.value);
  selectedLocations.value = [];
};

const seedLocations = () => {
  emit("addSeedLocations");
};
</script>

<template>
  <div class="location-list non-empty" v-if="locationsOnPage.length > 0">
    <div class="list-header">
      <div>
        <input
          type="checkbox"
          :checked="selectedLocations.length === props.history.length"
          @change="toggleAllLocations"
        />
        <button v-if="selectedLocations.length > 0" @click="deleteSelectedLocations">
          <img :src="DeleteIcon" alt="Delete" />
        </button>
      </div>
      <p>
        {{ pageNumber * 10 - 9 }} - {{ Math.min(pageNumber * 10, props.history.length) }} of
        {{ props.history.length }}
      </p>
    </div>
    <div class="list-body">
      <ol class="list">
        <li v-for="location in locationsOnPage" :key="location.timestamp" class="location">
          <input
            type="checkbox"
            :checked="selectedLocations.some((l) => l.timestamp === location.timestamp)"
            @change="toggleLocation(location)"
          />
          <p>{{ location.name }}</p>
        </li>
      </ol>
      <div class="page-controls">
        <button :disabled="pageNumber === 1" @click="pageNumber--">
          <img :src="ChevronLeftIcon" alt="Previous page" />
        </button>
        <p>{{ pageNumber }}</p>
        <button :disabled="pageNumber === totalPageNumber" @click="pageNumber++">
          <img :src="ChevronRightIcon" alt="Next page" />
        </button>
      </div>
    </div>
  </div>
  <div class="location-list" v-else>
    <div class="list-header">
      <p class="zero-count">0 of 0</p>
    </div>
    <div class="list-body list-body-empty">
      <p class="prompt">Search history will appear here.</p>
      <button @click="seedLocations">Add seed locations</button>
    </div>
  </div>
</template>

<style scoped>
.location-list {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-top: 2rem;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-dark);
  padding: 0.25em 1em;
  color: white;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}

.list-header > div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.list-body {
  background-color: white;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  padding: 1em 0.5rem;
  flex-grow: 1;
}

.non-empty .list-header {
  height: 2.5rem;
}

.list-header button {
  display: flex;
  align-items: center;
}

.list-header img {
  width: 1.5rem;
  height: 1.5rem;
}

.prompt {
  color: var(--text-light);
  text-align: center;
}

.list-body {
  display: flex;
  flex-direction: column;
}

.list-body-empty {
  align-items: center;
}

.list-body-empty button {
  background-color: var(--primary-dark);
  color: white;
  padding: 0.25em 1em;
  border-radius: 2px;
  margin-top: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.list {
  list-style: none;
  padding: 0;
  flex-grow: 1;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 0.5rem;
  border-radius: 2px;
}

.location:hover {
  background-color: var(--primary-light);
}

input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
}

.location p {
  font-size: 1.125rem;
}

.zero-count {
  margin-left: auto;
}

.page-controls {
  display: flex;
  align-items: center;
  align-self: center;
  margin-top: 1rem;
}

.page-controls button {
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.page-controls button:disabled {
  opacity: 0.5;
  cursor: auto;
}

.page-controls p {
  font-size: 1.25rem;
  padding-inline: 0.25rem;
}

@media (min-width: 850px) {
  .location-list {
    margin-top: 0;
  }
}
</style>

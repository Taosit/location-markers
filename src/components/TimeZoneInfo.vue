<script setup lang="ts">
import { useClock } from "@/composables/useClock";
import { fetcher } from "@/utils/fetcher";
import { onMounted, ref } from "vue";
import type { Location } from "@/App.vue";

const props = defineProps<{
  location: Location;
}>();

const lastSearchedTimeZoneName = ref("");
const { startClock, formattedTime } = useClock();

const getTimestamp = (date: Date) => {
  return date.getTime() / 1000 + date.getTimezoneOffset() * 60;
};

const getLocalDate = (dstOffset: number, rawOffset: number, requestDate: Date) => {
  const offsets = (dstOffset + rawOffset) * 1000;
  const localdate = new Date(getTimestamp(requestDate) * 1000 + offsets);
  const newDate = new Date();
  const requestDelayInMilliseconds = newDate.getMilliseconds() - requestDate.getMilliseconds();
  localdate.setMilliseconds(localdate.getMilliseconds() + requestDelayInMilliseconds);
  return localdate;
};

onMounted(() => {
  const { lat, lng } = props.location.coords;
  const requestDate = new Date();
  const timestamp = getTimestamp(requestDate);
  fetcher("https://maps.googleapis.com/maps/api/timezone/json", {
    location: `${lat},${lng}`,
    timestamp: timestamp.toString(),
  })
    .then(({ dstOffset, rawOffset, timeZoneName }) => {
      const localDate = getLocalDate(dstOffset, rawOffset, requestDate);
      lastSearchedTimeZoneName.value = timeZoneName;
      startClock(localDate);
    })
    .catch((err) => {
      console.log("Error", err);
    });
});
</script>

<template>
  <div class="time-zone-info">
    <div class="time-zone">
      <h2>{{ location.name }}</h2>
      <p>{{ lastSearchedTimeZoneName }}</p>
    </div>
    <p class="time">
      <span class="time-value">{{ formattedTime.split(" ")[0] }}</span>
      <span class="period">{{ formattedTime.split(" ")[1] }}</span>
    </p>
  </div>
</template>

<style scoped>
.time-zone-info {
  margin-top: 1rem;
  background-color: var(--white);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  color: var(--variant-dark);
  font-weight: 600;
  line-height: 1.1;
}

.time-zone p {
  color: var(--text-light);
  margin-top: 0.25rem;
}

.time {
  margin-top: 0.5rem;
}

.time-value {
  font-size: 1.5rem;
}

.period {
  margin-left: 0.5rem;
}

@media (min-width: 900px) {
  .time-zone-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .time {
    margin-top: 0;
  }
}
</style>

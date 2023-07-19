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
  <div>
    <p>{{ location.name }} {{ lastSearchedTimeZoneName }} {{ formattedTime }}</p>
  </div>
</template>

<style scoped></style>

import { computed, onUnmounted, ref } from "vue";

export const useClock = () => {
  const timer = ref(0);
  const currentLocalDate = ref<Date | null>(null);

  const startClock = (date: Date) => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = 0;
    }
    currentLocalDate.value = date;
    const startDate = new Date();
    timer.value = setInterval(() => {
      const newDate = new Date();
      const diff = newDate.getTime() - startDate.getTime();
      currentLocalDate.value = new Date(date.getTime() + diff);
    }, 1000);
  };

  const formattedTime = computed(() => {
    if (!currentLocalDate.value) {
      return "";
    }
    return currentLocalDate.value.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  });

  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = 0;
    }
  });

  return { startClock, currentLocalDate, formattedTime };
};

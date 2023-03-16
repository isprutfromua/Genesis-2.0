<template>
  <div class="gen-lesson">
    <LockClosedIcon v-if="locked" class="h-6 w-6 mr-2" />
    <PlayCircleIcon
      v-else
      class="h-6 w-6 mr-2"
      :class="{ 'fill-green-500': watched }"
    />
    <button
      class="gen-lesson__wrapper"
      :disabled="locked"
      @click.prevent="() => $emit('clicked')"
    >
      <span>{{ title }}</span>
      <p class="gen-lesson__name">
        <ClockIcon class="h-4 w-4 inline-block mr-1" />
        {{ formatTime(duration) }}
      </p>
    </button>
    <CheckIcon v-if="watched" class="fill-green-500 h-6 w-6 ml-auto" />
  </div>
</template>

<script setup>
import {
  LockClosedIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckIcon,
} from "@heroicons/vue/24/solid";
import { formatTime } from "@/helpers";

defineProps({
  duration: Number,
  title: String,
  locked: Boolean,
  watched: Boolean,
});
</script>

<style>
.gen-lesson {
  @apply flex items-center rounded-md p-3;
}

.gen-lesson__wrapper {
  @apply font-semibold inline-flex flex-col;
}

.gen-lesson__name {
  @apply inline-flex items-center mt-2;
}
</style>

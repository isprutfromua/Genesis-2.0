<template>
  <ul class="mt-2 max-h-128 scroll-container">
    <li
      v-for="(lesson, index) in lessons"
      :key="index"
      :class="{
        'text-gray-400': lesson.status === 'locked',
        'bg-gray-200': index === currentVideoIndex,
      }"
    >
      <GenLessonListItem
        v-bind="lesson"
        :watched="watchedVideos.has(index)"
        :locked="lesson.status === 'locked'"
        @clicked="() => $emit('clicked:lesson', index)"
      />
    </li>
  </ul>
</template>

<script setup>
import GenLessonListItem from "@/components/GenLessonListItem.vue";

defineProps({
  lessons: Array,
  currentVideoIndex: Number,
  watchedVideos: Set,
});

defineEmits(["clicked:lesson"]);
</script>

<style></style>

<template>
  <ul class="mt-4 max-h-video-list scroll-container">
    <li v-for="(lesson, index) in lessons" :key="index">
      <GenLessonListItem
        v-bind="lesson"
        :active="index === currentVideoIndex"
        :watched="watchedVideos.has(index)"
        :locked="lesson.status === 'locked'"
        @clicked="() => $emit('clicked:lesson', index)"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import GenLessonListItem from "@/components/GenLessonListItem.vue";
import { Lesson } from "@/types";
import { PropType } from "vue";

export default {
  name: "MyComponent",
  components: { GenLessonListItem },
  props: {
    lessons: {
      type: Array as PropType<Lesson[]>,
      default: () => [],
    },
    currentVideoIndex: {
      type: Number,
      default: 0,
    },
    watchedVideos: {
      type: Set,
      default: () => new Set(),
    },
  },
  methods: {
    clickedLesson(index: number) {
      this.$emit("clicked:lesson", index);
    },
  },
};
</script>

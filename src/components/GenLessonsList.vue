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
import { PropType, defineComponent } from "vue";

type GenLessonsListProps = {
  lessons: Lesson[];
  currentVideoIndex: number;
  watchedVideos: Set<number>;
};

export default defineComponent({
  components: { GenLessonListItem },
  props: {
    lessons: {
      type: Array as PropType<GenLessonsListProps["lessons"]>,
      default: () => [],
    },
    currentVideoIndex: {
      type: Number as PropType<GenLessonsListProps["currentVideoIndex"]>,
      default: 0,
    },
    watchedVideos: {
      type: Set as PropType<GenLessonsListProps["watchedVideos"]>,
      default: () => new Set(),
    },
  },
  methods: {
    clickedLesson(index: number) {
      this.$emit("clicked:lesson", index);
    },
  },
});
</script>

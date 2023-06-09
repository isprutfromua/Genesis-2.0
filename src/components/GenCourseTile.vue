<template>
  <router-link
    :to="'course/' + course.id"
    class="gen-course-tile group fade-in-animation"
    v-if="course"
  >
    <div
      ref="coursePosterRef"
      class="gen-course-tile__wideo-wrapper skeleton-animation"
    >
      <GenVideoPlayer
        :posterUrl="coursePreview"
        :videoUrl="courseVideoSrc"
        :isHoverPlay="true"
        muted
        loop
      />
    </div>

    <div class="p-4 flex flex-col grow">
      <h3 class="text-lg font-semibold">{{ course.title }}</h3>
      <p class="text-gray-600" v-if="courseDescription">
        {{ courseDescription }}
      </p>
      <ul
        class="text-gray-500 text-sm mt-2 list-disc list-inside mb-4"
        v-if="courseSkills"
      >
        <li v-for="skill in courseSkills" :key="skill">{{ skill }}</li>
      </ul>
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center" v-if="course.rating">
          <span class="text-sm text-yellow-500 mr-1">{{ course.rating }}</span>
          <StarIcon class="h-4 w-4 text-yellow-500" />
        </div>
        <p class="text-gray-500 ml-auto" v-if="courseDuration">
          {{ courseDuration }} - {{ course.lessonsCount }} Lessons
        </p>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { ref, toRefs, onMounted, defineComponent, PropType } from "vue";
import { formatTime, truncateText, useIntersectionObserver } from "@/helpers";
import GenVideoPlayer from "@/components/GenVideoPlayer.vue";
import { StarIcon } from "@heroicons/vue/24/solid";
import { Course } from "@/types";

const descriptionSize = 70;
const animationClass = "skeleton-animation";

export type GenCourseTileProps = {
  course: Course;
};

export default defineComponent({
  components: { StarIcon, GenVideoPlayer },
  props: {
    course: {
      type: Object as PropType<GenCourseTileProps["course"]>,
      default: () => {},
    },
  },
  setup(props) {
    const { course } = toRefs(props);
    const { previewImageLink, duration, description, meta } = course.value;

    const courseSkills = ref(meta.skills);
    const coursePreview = ref([previewImageLink, "cover.webp"].join("/"));
    const courseDuration = ref(formatTime(duration));
    const courseDescription = ref(truncateText(description, descriptionSize));
    const courseVideoSrc = ref(meta.courseVideoPreview?.link);
    const coursePosterRef = ref(null);

    onMounted(async () => {
      if (!coursePosterRef.value) return;

      const observerCb = (el: Element) => {
        el.classList.remove(animationClass);
      };
      useIntersectionObserver(coursePosterRef.value, observerCb);
    });

    return {
      courseSkills,
      coursePreview,
      courseDuration,
      courseDescription,
      courseVideoSrc,
      coursePosterRef,
      GenVideoPlayer,
    };
  },
});
</script>

<style>
.gen-course-tile {
  @apply flex flex-col;
  @apply shadow-lg hover:shadow-2xl;
  @apply bg-white rounded-lg overflow-hidden transition-shadow duration-300;
}

.gen-course-tile__image {
  @apply absolute inset-0 h-72 aspect-video;
  @apply object-cover transition-opacity;
}

.gen-course-tile__wideo-wrapper {
  @apply w-full h-44 overflow-hidden;
}
</style>

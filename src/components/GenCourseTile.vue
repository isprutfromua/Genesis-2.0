<template>
  <router-link
    :to="'course/' + course.id"
    class="gen-course-tile bg-white rounded-lg overflow-hidden shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300 group fade-in-animation"
  >
    <div
      ref="posterWrapperRef"
      class="w-full h-52 overflow-hidden skeleton-animation"
    >
      <GenVideoPlayer
        looped
        muted
        preload="metadata"
        :videoPosterSrc="coursePreview"
        :videoLink="course.meta.courseVideoPreview?.link"
      />
    </div>

    <div class="p-4 flex flex-col grow">
      <h3 class="text-lg font-semibold">{{ course.title }}</h3>

      <p class="text-gray-600">{{ courseDescription }}</p>
      <ul class="text-gray-500 text-sm mt-2 list-disc list-inside mb-4">
        <li v-for="skill in courseSkills" :key="skill">{{ skill }}</li>
      </ul>
      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center">
          <span class="text-sm text-yellow-500 mr-1">{{ course.rating }}</span>
          <StarIcon class="h-4 w-4 fill-yellow-500" />
        </div>
        <p class="text-gray-500">
          {{ courseDuration }} - {{ course.lessonsCount }} Lessons
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { StarIcon } from "@heroicons/vue/24/solid";
import { formatTime, truncateText } from "@/helpers/formatters";
import { ref, toRefs, onMounted } from "vue";
import GenVideoPlayer from "@/components/GenVideoPlayer.vue";

const descriptionSize = 70;
const props = defineProps({
  course: Object,
});
const { course } = toRefs(props);
const { previewImageLink, duration, description } = course.value;

const courseSkills = ref(course.value.meta.skills);
const coursePreview = ref(`${previewImageLink}/cover.webp`);
const courseDuration = ref(formatTime(duration));
const courseDescription = ref(truncateText(description, descriptionSize));
const posterWrapperRef = ref(null);

onMounted(() => {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("skeleton-animation");

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  observer.observe(posterWrapperRef.value);
});
</script>

<style>
.skeleton-animation {
  animation: skeleton-loading 1s linear infinite alternate;
  will-change: transform;
}

.skeleton-animation > * {
  opacity: 0;
}

.fade-in-animation {
  position: relative;
  animation: fadeInAnimation ease 1s;
  animation-iteration-count: 1;
  animation-fill-mode: backwards;
}

@keyframes fadeInAnimation {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
</style>

<template>
  <div
    v-if="!course.data"
    class="inline-flex bg-white p-16 shadow-2xl rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <img :src="require('@/assets/loader.gif')" alt="Loader" />
  </div>
  <div class="gen-course" v-if="course.data">
    <aside class="gen-course__sidebar">
      <h2 class="gen-course__heading">Lessons navigation:</h2>
      <GenLessonsList
        :currentVideoIndex="currentVideoIndex"
        :lessons="course.data.lessons"
        :watchedVideos="watchedVideos"
        @clicked:lesson="selectLesson"
      />
    </aside>
    <main class="gen-course__main">
      <div class="gen-course__info">
        <RouterLink to="/" class="gen-back-to-home">
          <HomeIcon class="h-6 w-6 mr-2" />
          <span>Back to courses</span>
        </RouterLink>
        <h1 class="gen-course__heading">
          {{ course.data.title }}
        </h1>
        <p class="my-2">{{ course.data.description }}</p>
      </div>
      <div class="relative aspect-video group">
        <video
          class="w-full h-full"
          ref="videoPlayerRef"
          :muted="isVideoMuted"
          autoplay
          @ended="() => playNextVideo()"
          :poster="posterSrc"
        >
          <source :src="videoUrl" />
        </video>
        <button
          ref="videoButtonRef"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          @click="playVideoButtonClickHandler"
        >
          <Component
            :is="isVideoPlaying ? PauseIcon : PlayIcon"
            class="w-20 h-20 fill-white"
          />
        </button>
        <button
          ref="videoButtonRef"
          class="absolute bottom-5 right-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          @click="muteVideoButtonClickHandler"
        >
          <Component
            :is="isVideoMuted ? SpeakerXMarkIcon : SpeakerWaveIcon"
            class="w-10 h-10 fill-white"
          />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  HomeIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/vue/24/solid";
import { setLocalData } from "@/helpers";
import { ref, reactive, computed } from "vue";
import GenLessonsList from "@/components/GenLessonsList.vue";
import { useRoute } from "vue-router";

const course = reactive({ data: null });
const currentVideoIndex = ref(0);
const courseProgress = ref(new Map());
const watchedVideos = ref(new Set());
const videoPlayerRef = ref(null);

// const previewImageLink = ref(
//   course.data.lessons[currentVideoIndex].previewImageLink
// );
const previewImageLink = ref("");
const posterSrc = computed(() => {
  if (previewImageLink.value.length) {
    return [
      previewImageLink,
      "/lesson-",
      course.data.lessons[currentVideoIndex].order,
      ".webp",
    ].join("");
  }

  return "";
});
const isVideoPlaying = ref(false);
const isVideoMuted = ref(true);
const videoUrl = computed(
  () => course.data.lessons[currentVideoIndex.value].link
);

const selectLesson = (index) => {
  currentVideoIndex.value = index;
  videoPlayerRef.value.load();
  saveProgress();
};

const playVideoButtonClickHandler = () => {
  if (isVideoPlaying.value) {
    pauseVideo();
    return;
  }

  playVideo();
};

const muteVideoButtonClickHandler = () => {
  if (isVideoMuted.value) {
    isVideoMuted.value = false;
    return;
  }

  isVideoMuted.value = true;
};

const playVideo = () => {
  isVideoPlaying.value = true;

  if (videoPlayerRef.value) {
    videoPlayerRef.value.play();
  }
};

const pauseVideo = () => {
  isVideoPlaying.value = false;

  if (videoPlayerRef.value) {
    videoPlayerRef.value.pause();
  }
};

const playNextVideo = () => {
  watchedVideos.value.add(currentVideoIndex.value);
  if (course.data.lessons[currentVideoIndex.value + 1]?.status !== "locked") {
    currentVideoIndex.value++;
  }

  saveProgress();
  playVideo();
};

const saveProgress = () => {
  const progress = {
    currentVideo: currentVideoIndex.value,
    watchedVideos: watchedVideos.value,
  };

  courseProgress.value.set(course.data.id, progress);
  setLocalData("courseProgress", courseProgress.value);
};

// onMounted(async () => {
//   const lessonIdValue = lessonId.value;
//   const res = await fetchData(lessonIdValue);
//   const coursData = res;

//   course.data = coursData;

//   playVideo();
//   const progress = getLocalData("courseProgress");

//   if (!progress) return;

//   const courseLocalData = progress.get(course.data.id);
//   if (courseLocalData) {
//     currentVideoIndex.value = coursData.currentVideo;
//     watchedVideos.value = coursData.watchedVideos;
//   }
// });
import { onBeforeMount } from "vue";
import { fetchData } from "@/helpers";

onBeforeMount(async () => {
  const route = useRoute();
  const coursed = await fetchData(route.params.id);

  course.data = coursed;
});
</script>

<style>
.gen-course {
  @apply flex flex-col-reverse xl:flex-row;
}

.gen-course__sidebar {
  @apply w-full mt-8 xl:mt-0 xl:w-2/5 xl:mr-8 p-10 bg-white rounded-xl shadow-xl;
}

.gen-course__heading {
  @apply text-lg font-semibold;
}

.gen-course__main {
  @apply w-full xl:w-3/5;
}

.gen-back-to-home {
  @apply flex items-center mb-4;
}

.gen-course__heading {
  @apply text-2xl font-semibold;
}
</style>

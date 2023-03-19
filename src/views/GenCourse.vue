<template>
  <GenLoader v-if="loading" />
  <div v-else-if="state.isNoVideoAvailable">
    <h2 class="text-4xl tracking-wide font-bold text-center">
      Sorry! There are no videos in this course. <br />
      Please go to the
      <router-link to="/" class="underline">courses page</router-link> and learn
      another one.
    </h2>
  </div>
  <div class="gen-course" v-else>
    <aside class="gen-course__sidebar">
      <h2 class="gen-course__heading">Lessons navigation:</h2>
      <GenLessonsList
        :currentVideoIndex="state.currentVideoIDx"
        :lessons="state.course.lessons"
        :watchedVideos="state.watchedLessons"
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
          {{ state.course.title }}
        </h1>
        <p class="my-2">{{ state.course.description }}</p>
      </div>
      <div class="relative aspect-video group">
        <GenVideoPlayer
          :key="state.currentVideoIDx"
          :posterUrl="state.posterSrc"
          :videoUrl="state.videoUrl"
          :controls="true"
          :autoplay="true"
          @video:ended="playNextVideo"
          muted
          loop
        />
      </div>
      <section
        class="mt-8 hidden xl:block"
        aria-describedby="controls-section-heading"
      >
        <h2 class="text-2xl" id="controls-section-heading">
          How to control player with keyboard:
        </h2>
        <ul
          class="list-disc list-inside mt-4 text-xl"
          aria-label="Keyboard controls"
        >
          <li class="mb-2">
            <span class="font-bold">Spacebar:</span> Play/Pause
          </li>
          <li class="mb-2"><span class="font-bold">M:</span> Mute/unmute</li>
          <li class="mb-2">
            <span class="font-bold">F:</span> Enter Picture-in-picture mode
          </li>
          <li class="mb-2">
            <span class="font-bold">←:</span> Seek backward 5 seconds
          </li>
          <li class="mb-2">
            <span class="font-bold">→:</span> Seek forward 5 seconds
          </li>
          <li class="mb-2"><span class="font-bold">↑:</span> Increase speed</li>
          <li><span class="font-bold">↓:</span> Decrease speed</li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { setLocalData, getLocalData, fetchData } from "@/helpers";
import { ref, defineComponent, onMounted, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import { Course, CourseProgress, Lesson } from "@/types";
import GenLessonsList from "@/components/GenLessonsList.vue";
import GenLoader from "@/components/GenLoader.vue";
import GenVideoPlayer from "@/components/GenVideoPlayer.vue";
import { HomeIcon } from "@heroicons/vue/24/solid";

export default defineComponent({
  components: {
    GenLessonsList,
    GenLoader,
    GenVideoPlayer,
    HomeIcon,
  },
  setup() {
    const state = reactive({
      course: {} as Course,
      isNoVideoAvailable: false,
      currentVideoIDx: 0,
      watchedLessons: new Set() as Set<number>,
      videoUrl: "",
      posterSrc: require("@/assets/poster.webp"),
    });
    const loading = ref<Boolean>(true);
    const coursesProgress = ref<Map<string, CourseProgress>>();

    // handlers
    const playNextVideo = () => {
      if (state.currentVideoIDx < state.course.lessons.length - 1) {
        state.watchedLessons.add(state.currentVideoIDx);

        if (
          state.course.lessons[state.currentVideoIDx + 1].status !== "locked"
        ) {
          state.currentVideoIDx = state.currentVideoIDx + 1;
        }

        saveProgress();
      }
    };

    const saveProgress = () => {
      const progress = {
        currentVideo: state.currentVideoIDx,
        watchedVideos: state.watchedLessons,
      };

      coursesProgress.value?.set(state.course.id, progress);
      coursesProgress.value &&
        setLocalData("courseProgress", coursesProgress.value);
    };

    const selectLesson = (idx: number) => {
      state.currentVideoIDx = idx;
      saveProgress();
    };

    onMounted(async () => {
      const route = useRoute();
      const courseID = route.params.id as string;

      state.course = await fetchData(courseID);
      state.course.lessons.sort((prev, next) => prev.order - next.order);
      route.meta.title = state.course.title;
      loading.value = false;

      state.isNoVideoAvailable = !state.course.lessons.some((el) => el.link);

      // get local course progress
      const progress = getLocalData("courseProgress") as Map<
        string,
        CourseProgress
      >;

      if (progress) coursesProgress.value = progress;
      else coursesProgress.value = new Map();

      if (progress?.get(courseID)) {
        const courseLocalData = progress.get(courseID);

        if (courseLocalData) {
          state.currentVideoIDx = courseLocalData.currentVideo;
          state.watchedLessons = courseLocalData.watchedVideos;
        }
      } else {
        state.currentVideoIDx = 0;
        state.videoUrl = state.course?.lessons[0]?.link || "";
      }
    });

    watch(
      () => state.currentVideoIDx,
      (newIdx) => {
        const { previewImageLink, order, link } = state.course?.lessons[
          newIdx
        ] as Lesson;

        if (link?.length) state.videoUrl = link;

        if (previewImageLink && order) {
          state.posterSrc = `${previewImageLink}/lesson-${order}.webp`;
        }
      }
    );

    return {
      state,
      selectLesson,
      loading,
      playNextVideo,
    };
  },
});
</script>

<style>
.gen-course {
  @apply flex flex-col-reverse items-start xl:flex-row;
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

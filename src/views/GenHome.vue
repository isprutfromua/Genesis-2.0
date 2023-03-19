<template>
  <GenLoader v-if="isDataLoading" />
  <div v-else>
    <h1 class="text-4xl font-bold mb-10">Courses laboratory</h1>
    <div class="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-8">
      <GenCourseTile
        v-for="(course, index) in paginatedCourses"
        :key="course.id"
        :course="course"
        :style="{ animationDelay: `${index * 100}ms` }"
      />
    </div>

    <div class="flex justify-center mt-12 gap-4">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        :class="{ 'bg-gray-500 pointer-events-none': currentPageIDx === 1 }"
        :disabled="currentPageIDx === 1 || isDataLoading"
        @click="() => changePage(currentPageIDx - 1)"
      >
        Prev
      </button>
      <span class="font-bold py-2 px-4 rounded text-center">{{
        currentPageIDx
      }}</span>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        :disabled="currentPageIDx === pagesCount || isDataLoading"
        :class="{
          'bg-gray-500 pointer-events-none': currentPageIDx === pagesCount,
        }"
        @click="() => changePage(currentPageIDx + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import GenCourseTile from "@/components/GenCourseTile.vue";
import GenLoader from "@/components/GenLoader.vue";
import { ref, computed, onMounted, defineComponent } from "vue";
import { fetchData, sortArrayByDateDesc } from "@/helpers";
import { getLocalData, setLocalData } from "@/helpers";
import { Course } from "@/types";

export default defineComponent({
  components: { GenCourseTile, GenLoader },
  setup() {
    const courses = ref<Course[]>([]);
    const currentPageIDx = ref<number>(1);
    const isDataLoading = ref<boolean>(true);
    const PAGE_SIZE = 10;

    const pagesCount = computed(() =>
      Math.ceil(courses.value.length / PAGE_SIZE)
    );

    const paginatedCourses = computed(() => {
      if (!courses.value) {
        return [];
      }

      if (courses.value.length < PAGE_SIZE) {
        return courses.value;
      }

      const startIndex = (currentPageIDx.value - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;

      return courses.value.slice(startIndex, endIndex);
    });

    const changePage = (page: number) => {
      if (page < 0) currentPageIDx.value = 1;
      else if (page > pagesCount.value) currentPageIDx.value = pagesCount.value;
      else currentPageIDx.value = page;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    onMounted(async () => {
      const localCoursesData = getLocalData("courses");
      if (localCoursesData) {
        courses.value = localCoursesData as Course[];
      } else {
        const res = await fetchData();
        const { courses: coursesData } = res;
        const sortedCoursesByDate = sortArrayByDateDesc<Course>(
          coursesData,
          "launchDate"
        );

        courses.value = sortedCoursesByDate;
        setLocalData("courses", coursesData);
      }

      isDataLoading.value = false;
    });

    return {
      courses,
      currentPageIDx,
      isDataLoading,
      pagesCount,
      paginatedCourses,
      changePage,
    };
  },
});
</script>

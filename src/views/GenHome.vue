<template>
  <div
    v-if="isLoading"
    class="inline-flex bg-white p-16 shadow-2xl rounded-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
  >
    <img :src="require('@/assets/loader.gif')" alt="Loader" />
  </div>
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
        :class="{ 'bg-gray-500 pointer-events-none': currentPage === 1 }"
        :disabled="currentPage === 1 || isLoading"
        @click="() => changePage(currentPage - 1)"
      >
        Prev
      </button>
      <span class="font-bold py-2 px-4 rounded text-center">{{
        currentPage
      }}</span>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        :disabled="currentPage === pageCount || isLoading"
        :class="{
          'bg-gray-500 pointer-events-none': currentPage === pageCount,
        }"
        @click="() => changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import GenCourseTile from "@/components/GenCourseTile.vue";
import { ref, computed, onMounted, defineComponent } from "vue";
import { fetchData, sortArrayByDateDesc } from "@/helpers";
import { getLocalData, setLocalData } from "@/helpers";
import { Course } from "@/types";

export default defineComponent({
  components: { GenCourseTile },
  setup() {
    const courses = ref<Course[]>([]);
    const currentPage = ref<number>(1);
    const isLoading = ref<boolean>(true);
    const PAGE_SIZE = 10;

    const pageCount = computed(() => {
      return Math.ceil(courses.value.length / PAGE_SIZE);
    });

    const paginatedCourses = computed(() => {
      if (!courses.value) {
        return [];
      }

      if (courses.value.length < PAGE_SIZE) {
        return courses.value;
      }

      const startIndex = (currentPage.value - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;

      return courses.value.slice(startIndex, endIndex);
    });

    const changePage = (page: number) => {
      if (page < 0) currentPage.value = 1;
      else if (page > pageCount.value) currentPage.value = pageCount.value;
      else currentPage.value = page;

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    onMounted(async () => {
      const localData = getLocalData("courses");
      if (localData) {
        courses.value = localData as Course[];
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

      isLoading.value = false;
    });

    return {
      courses,
      currentPage,
      isLoading,
      pageCount,
      paginatedCourses,
      changePage,
    };
  },
});
</script>

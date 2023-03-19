<template>
  <div
    class="gen-lesson"
    :class="{
      'text-gray-400 pointer-events-none': locked,
      'bg-gray-200': active,
    }"
  >
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
      <span v-if="!link" class="text-red-300">no video</span>
      <p class="gen-lesson__name">
        <ClockIcon class="h-4 w-4 inline-block mr-1" />
        {{ courseDuration }}
      </p>
    </button>
    <CheckIcon v-if="watched" class="fill-green-500 h-6 w-6 ml-auto" />
  </div>
</template>

<script lang="ts">
import {
  LockClosedIcon,
  ClockIcon,
  PlayCircleIcon,
  CheckIcon,
} from "@heroicons/vue/24/solid";
import { formatTime } from "@/helpers";
import { defineComponent, PropType, toRefs, computed } from "vue";

type GenLessonListItemProps = {
  duration: number;
  title: string;
  link: string;
  locked: boolean;
  watched: boolean;
  active: boolean;
};

export default defineComponent({
  components: { LockClosedIcon, ClockIcon, PlayCircleIcon, CheckIcon },
  props: {
    duration: {
      type: Number as PropType<GenLessonListItemProps["duration"]>,
      default: 0,
    },
    title: {
      type: String as PropType<GenLessonListItemProps["title"]>,
      default: "",
    },
    link: {
      type: String as PropType<GenLessonListItemProps["link"]>,
      default: "",
    },
    locked: {
      type: Boolean as PropType<GenLessonListItemProps["locked"]>,
      default: false,
    },
    watched: {
      type: Boolean as PropType<GenLessonListItemProps["watched"]>,
      default: false,
    },
    active: {
      type: Boolean as PropType<GenLessonListItemProps["active"]>,
      default: false,
    },
  },
  setup(props) {
    const { duration } = toRefs(props);
    const courseDuration = computed(() => formatTime(duration.value));

    return { courseDuration };
  },
});
</script>

<style>
.gen-lesson {
  @apply flex items-center my-1 p-3;
  @apply rounded-md transition hover:bg-gray-200;
}

.gen-lesson__wrapper {
  @apply flex-col flex flex-1;
  @apply font-semibold;
}

.gen-lesson__name {
  @apply inline-flex items-center mt-2;
}
</style>

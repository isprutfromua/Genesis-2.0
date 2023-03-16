<template>
  <div
    class="relative w-full h-full overflow-hidden"
    @mouseover="playVideo"
    @mouseleave="pauseVideo"
  >
    <video
      v-if="videoLink"
      class="w-full h-full object-cover"
      ref="videoRef"
      :src="videoLink"
      v-bind="$attrs"
      @error="videoErrorHandler"
    ></video>
    <img
      v-if="videoPosterSrc"
      ref="videoPosterRef"
      class="object-cover absolute inset-0 h-56 aspect-video transition-opacity"
      aria-hidden="true"
      :src="videoPosterSrc"
    />
  </div>
</template>

<script setup>
import Hls from "hls.js";
import { defineProps, ref, toRefs, onMounted } from "vue";
const isVideoLoaded = ref(true);
const isVideoPlaying = ref(false);
const videoRef = ref(null);
const videoPosterRef = ref(null);

const props = defineProps({
  videoLink: String,
  videoPosterSrc: String,
});
const { videoLink } = toRefs(props);

const playVideo = async () => {
  if (videoRef.value || !isVideoLoaded.value) return;

  if (videoRef.value.paused && !isVideoPlaying.value) {
    videoPosterRef.value.classList.add("opacity-0");
    return videoRef.value.play();
  }
};

const pauseVideo = () => {
  if (videoRef.value || !isVideoLoaded.value) return;

  if (!videoRef.value.paused && isVideoPlaying.value) {
    videoPosterRef.value.classList.remove("opacity-0");
    videoRef.value.pause();
  }
};

const videoErrorHandler = () => {
  isVideoLoaded.value = false;
};

onMounted(() => {
  if (videoRef.value || !isVideoLoaded.value) return;

  videoRef.value.onplaying = () => {
    isVideoPlaying.value = true;
  };

  videoRef.value.onpause = () => {
    isVideoPlaying.value = false;
  };
});

if (videoLink.value && Hls.isSupported()) {
  var hls = new Hls();
  hls.loadSource(videoLink.value);
  hls.attachMedia(videoRef.value);
}
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

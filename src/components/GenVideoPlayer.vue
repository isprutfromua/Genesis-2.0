<template>
  <div
    class="relative w-full h-full"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <video
      ref="videoPlayerRef"
      class="w-full h-full object-cover"
      :class="{ 'opacity-0': isHoverPlay && !state.isPlaying }"
      :poster="posterUrl"
      :src="videoUrl"
      :loop="isHoverPlay"
      :muted="isHoverPlay || state.isMuted"
      :preload="isHoverPlay ? 'metadata' : 'auto'"
      @loadedmetadata="onVideoLoaded"
    ></video>

    <div
      v-if="isHoverPlay && !state.isPlaying && !state.isLoading"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url(${posterUrl})` }"
    ></div>

    <div
      v-if="state.isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <div
        class="w-20 h-20 border-8 border-white border-t-transparent border-b-transparent rounded-full animate-spin"
      ></div>
    </div>

    <div
      v-if="state.error"
      :class="{ 'opacity-0': isHoverPlay && !state.isPlaying }"
      class="absolute inset-0 flex items-center justify-center text-red-500 bg-white bg-opacity-75 font-medium"
    >
      {{ state.error }}
    </div>

    <div
      v-if="!isHoverPlay"
      class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 transition-opacity duration-300 opacity-0"
      :class="{ 'opacity-100': state.isControlsVisible }"
    >
      <GenPlayerButton @clicked="onPlayPauseClick">
        <component
          :is="state.isPlaying ? PauseIcon : PlayIcon"
          class="h-20 w-20 text-black"
        />
      </GenPlayerButton>

      <GenPlayerButton
        class="ml-2 absolute bottom-5 right-5"
        @click="onMuteClick"
      >
        <component
          :is="state.isMuted ? SpeakerXMarkIcon : SpeakerWaveIcon"
          class="h-8 w-8 text-black"
        />
      </GenPlayerButton>

      <GenPlayerButton
        class="ml-2 absolute top-5 right-5"
        @click="onTogglePictureInPicture"
      >
        <ArrowTopRightOnSquareIcon class="h-8 w-8 text-black" />
      </GenPlayerButton>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref } from "vue";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/vue/24/solid";
import Hls from "hls.js";
import GenPlayerButton from "./GenPlayerButton.vue";

function isHlsUrl(url: string): boolean {
  return url.endsWith(".m3u8") || url.includes(".m3u8?");
}

interface VideoProps {
  posterUrl: string;
  videoUrl?: string | (null | undefined);
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  isHoverPlay: boolean;
}

export default defineComponent({
  name: "VideoPlayer",
  components: {
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    ArrowTopRightOnSquareIcon,
    GenPlayerButton,
  },
  props: {
    posterUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    controls: {
      type: Boolean,
      default: false,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    isHoverPlay: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: VideoProps) {
    const videoPlayerRef = ref<HTMLVideoElement | null>(null);
    const state = reactive({
      isPlaying: false,
      isMuted: props.muted,
      isHoverPlay: props.isHoverPlay,
      isControlsVisible: false,
      isLoading: true,
      error: "",
      video: null as HTMLVideoElement | null,
      keyboardControlEnabled: true,
    });

    const onVideoLoaded = () => {
      state.video = videoPlayerRef.value;
      state.isLoading = false;
    };

    const onVideoError = () => {
      state.error = "Failed to load video";
      state.isLoading = false;
    };

    const onPlayPauseClick = () => {
      if (state.isPlaying) {
        state.video?.pause();
      } else {
        state.video?.play();
      }
    };

    const onMuteClick = () => {
      state.isMuted = !state.isMuted;
      state.video!.muted = state.isMuted;
    };

    const onTogglePictureInPicture = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        state.video?.requestPictureInPicture();
      }
    };

    const onMouseEnter = () => {
      if (props.isHoverPlay && !props.controls) {
        state.isPlaying = true;
        state.video?.play();
      } else if (!state.isControlsVisible) {
        state.isControlsVisible = true;
      }
    };

    const onMouseLeave = () => {
      if (props.isHoverPlay && !props.controls) {
        state.isPlaying = false;
        state.video?.pause();
      } else if (state.isControlsVisible) {
        state.isControlsVisible = false;
      }
    };

    const onKeyboardEvent = (event: KeyboardEvent) => {
      if (!state.keyboardControlEnabled) return;
      (document.activeElement as HTMLElement)?.blur();

      switch (event.code) {
        case "Space":
          onPlayPauseClick();
          break;
        case "KeyM":
          onMuteClick();
          break;
        case "KeyF":
          onTogglePictureInPicture();
          break;
        case "ArrowRight":
          state.video!.currentTime += 5;
          break;
        case "ArrowLeft":
          state.video!.currentTime -= 5;
          break;
        case "ArrowUp":
          state.video!.playbackRate += 0.25;
          break;
        case "ArrowDown":
          state.video!.playbackRate -= 0.25;
          break;
      }
    };

    function setError(message: string): void {
      state.error = message;
      state.isLoading = false;
      state.isPlaying = false;
      state.isControlsVisible = false;
    }

    const setupHls = (url: string, video: HTMLVideoElement) => {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, () => {
        setError(
          state.isHoverPlay
            ? "No video.Error happened. Sorry 😭"
            : "Error happenned while trying to play video. Please try to reload the page. Sorry for this 😭"
        );
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        props.autoplay && state.video?.play();
      });
    };

    onMounted(() => {
      state.video = videoPlayerRef.value;
      const { videoUrl } = props;

      if (!videoUrl?.length || !state.video) {
        setError("No video.Error happened. Sorry 😭");

        return;
      }

      if (isHlsUrl(videoUrl) && !Hls.isSupported()) {
        setError("HLS is not supported in this browser");

        return;
      } else if (state.video && isHlsUrl(videoUrl) && Hls.isSupported()) {
        setupHls(videoUrl, state.video);
      } else {
        state.video.src = videoUrl;
        state.video.addEventListener("loadedmetadata", () => {
          props.autoplay && state.video?.play();
        });
      }

      state.video.addEventListener("play", () => {
        state.isPlaying = true;
      });

      state.video.addEventListener("pause", () => {
        state.isPlaying = false;
      });

      state.video.addEventListener("volumechange", () => {
        state.isMuted = state.video?.muted;
      });

      document.addEventListener("keydown", onKeyboardEvent);
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", onKeyboardEvent);
    });

    return {
      state,
      PlayIcon,
      PauseIcon,
      SpeakerWaveIcon,
      SpeakerXMarkIcon,
      onMouseEnter,
      onMouseLeave,
      onVideoLoaded,
      onVideoError,
      onPlayPauseClick,
      onMuteClick,
      onTogglePictureInPicture,
      ArrowTopRightOnSquareIcon,
      videoPlayerRef,
    };
  },
});
</script>

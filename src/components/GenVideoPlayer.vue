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
      :controls="!isHoverPlay && controls"
      :preload="isHoverPlay ? 'metadata' : 'auto'"
      @loadedmetadata="onVideoLoaded"
      @error="onVideoError"
      @ended="() => $emit('video:ended')"
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
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  PropType,
} from "vue";
import Hls from "hls.js";

function isHlsUrl(url: string): boolean {
  return url.endsWith(".m3u8") || url.includes(".m3u8?");
}

type GenVideoPlayerProps = {
  posterUrl: string;
  videoUrl?: string | undefined;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  isHoverPlay: boolean;
};

export default defineComponent({
  name: "VideoPlayer",
  props: {
    posterUrl: {
      type: String as PropType<GenVideoPlayerProps["posterUrl"]>,
      required: true,
    },
    videoUrl: {
      type: String as PropType<GenVideoPlayerProps["videoUrl"]>,
    },
    controls: {
      type: Boolean as PropType<GenVideoPlayerProps["controls"]>,
      default: false,
    },
    autoplay: {
      type: Boolean as PropType<GenVideoPlayerProps["autoplay"]>,
      default: false,
    },
    muted: {
      type: Boolean as PropType<GenVideoPlayerProps["muted"]>,
      default: false,
    },
    loop: {
      type: Boolean as PropType<GenVideoPlayerProps["loop"]>,
      default: false,
    },
    isHoverPlay: {
      type: Boolean as PropType<GenVideoPlayerProps["isHoverPlay"]>,
      default: false,
    },
  },
  setup(props: GenVideoPlayerProps) {
    const videoPlayerRef = ref<HTMLVideoElement | null>(null);
    const state = reactive({
      isPlaying: false,
      isMuted: props.muted,
      isHoverPlay: props.isHoverPlay,
      isControlsVisible: false,
      isLoading: true,
      error: "",
      videoEl: null as HTMLVideoElement | null,
      keyboardControlEnabled: true,
    });

    const onVideoLoaded = () => {
      state.videoEl = videoPlayerRef.value;
      state.isLoading = false;
    };

    const onVideoError = () => {
      state.error = "Failed to load video";
      state.isLoading = false;
    };

    const setEventListeners = () => {
      state.videoEl?.addEventListener("play", () => {
        state.isPlaying = true;
      });

      state.videoEl?.addEventListener("pause", () => {
        state.isPlaying = false;
      });

      state.videoEl?.addEventListener("volumechange", () => {
        state.isMuted = state.videoEl?.muted;
      });

      document.addEventListener("keydown", onKeyboardEvent);
    };

    const togglePlayPause = () => {
      if (state.isPlaying) {
        state.videoEl?.pause();
      } else {
        state.videoEl?.play();
      }
    };

    const toggleMuteUnmute = () => {
      state.isMuted = !state.isMuted;
      state.videoEl!.muted = state.isMuted;
    };

    const togglePictureInPicture = () => {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        state.videoEl?.requestPictureInPicture();
      }
    };

    const onMouseEnter = () => {
      if (props.isHoverPlay && !props.controls) {
        state.isPlaying = true;
        state.videoEl?.play();
      } else if (!state.isControlsVisible) {
        state.isControlsVisible = true;
      }
    };

    const onMouseLeave = () => {
      if (props.isHoverPlay && !props.controls) {
        state.isPlaying = false;
        state.videoEl?.pause();
      } else if (state.isControlsVisible) {
        state.isControlsVisible = false;
      }
    };

    const onKeyboardEvent = (event: KeyboardEvent) => {
      if (!state.keyboardControlEnabled) return;
      (document.activeElement as HTMLElement)?.blur();

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlayPause();
          break;
        case "KeyM":
          toggleMuteUnmute();
          break;
        case "KeyF":
          togglePictureInPicture();
          break;
        case "ArrowRight":
          state.videoEl!.currentTime += 5;
          break;
        case "ArrowLeft":
          state.videoEl!.currentTime -= 5;
          break;
        case "ArrowUp":
          state.videoEl!.playbackRate += 0.25;
          break;
        case "ArrowDown":
          state.videoEl!.playbackRate -= 0.25;
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
        props.autoplay && state.videoEl?.play();
      });
    };

    onMounted(async () => {
      state.videoEl = videoPlayerRef.value;
      const { videoUrl } = props;

      if (!videoUrl?.length || !state.videoEl) {
        setError(
          "No video.Error happened.Try to refresh current page, or pick another video."
        );

        return;
      }

      if (isHlsUrl(videoUrl) && !Hls.isSupported()) {
        setError("HLS is not supported in this browser");

        return;
      } else if (state.videoEl && isHlsUrl(videoUrl) && Hls.isSupported()) {
        setupHls(videoUrl, state.videoEl);
      } else {
        state.videoEl.src = videoUrl;
        state.videoEl.addEventListener("loadedmetadata", () => {
          props.autoplay && state.videoEl?.play();
        });
      }

      setEventListeners();
    });

    onUnmounted(() => {
      document.removeEventListener("keydown", onKeyboardEvent);
    });

    return {
      state,
      onMouseEnter,
      onMouseLeave,
      onVideoLoaded,
      onVideoError,
      videoPlayerRef,
    };
  },
});
</script>

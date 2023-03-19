<template>
  <button
    class="p-2 rounded-full bg-white bg-opacity-50"
    v-bind="$attrs"
    @click="() => $emit('clicked')"
  >
    <slot />
  </button>
</template>

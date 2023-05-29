<template>
  <div v-if="snackbar.show"
    class="fixed flex justify-between items-center w-[300px] left-4 bottom-4 py-2 px-4 font-semibold text-white animate-fade-in-down rounded-md"
    :class="[
      snackbar.type === 'success' ? 'bg-emerald-500' : 'bg-red-500',
    ]">
    {{ snackbar.message }}

    <div @click="closeSnackbar">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="w-4 h-4 rounded-full hover:cursor-pointer ">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const snackbar = computed(() => store.state.snackbar);

function closeSnackbar() {
  store.commit('closeSnackbar', false);
}

</script>

<style></style>
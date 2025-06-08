<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import MultiStepForm from '@/components/multi-step-form.vue';

const store = useStore();

const isLoaded = computed(() => Object.keys(store.state.formSchema).length > 0);

onMounted(() => {store.dispatch('initializeFormSchema')});
</script>

<template>
  <div class="wrapper">
    <p v-if="!isLoaded">Loading...</p>
    <MultiStepForm v-else />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  height: 100vh;
}
p{
  margin: 0;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.wrapper {
  height: 100%;
}
</style>

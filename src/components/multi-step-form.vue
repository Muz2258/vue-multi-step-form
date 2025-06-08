<script setup>
import Accordion from '@/components/accordion.vue';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

const store = useStore();

const steps = Object.keys(store.state.formSchema);
const currentStepIndex = ref(0);

const finished = ref(false);

const currentStepKey = computed(() => steps[currentStepIndex.value]);
const currentStepTitle = computed(() => store.state.formSchema[currentStepKey.value].stepTitle);

const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === steps.length - 1);

const currentSections = computed(() => {
  const step = store.state.formSchema[currentStepKey.value];
  return Object.entries(step)
    .filter(([key]) => key.startsWith('section'))
    .map(([key, value]) => ({
      key,
      ...value,
      open: store.state.accordionState[currentStepKey.value] === key,
      values: store.state.formData[currentStepKey.value][key] || {},
    }));
});

const collectedData = computed(() => store.state.formData);

const goToNextStep = () => {
  if (!isLastStep.value) {
    currentStepIndex.value++;
  } else {
    finished.value = true;
  }
};

const goToPreviousStep = () => {
  if (!isFirstStep.value) {
    currentStepIndex.value--;
  }
};

const resetForm = () => {
  currentStepIndex.value = 0;
  finished.value = false;
  store.commit('resetFormData');
};
</script>

<template>
<div class="page-container">
    <div v-if="!finished" class="step-wrapper">
        <div class="step__header">
            <p class="step__header__count">
                Step <span>{{ currentStepIndex + 1 }}</span>/<span>{{ steps.length }}</span>
            </p>
            <h2>{{ currentStepTitle }}</h2>
        </div>

        <div class="step__body">
            <Accordion
                :stepKey="currentStepKey"
                :sections="currentSections"
            />
        </div>

        <div class="step__footer">
            <button
                class="btn__sec"
                :disabled="isFirstStep"
                @click="goToPreviousStep"
            >
                Previous
            </button>

            <button
                class="btn__pri"
                @click="goToNextStep"
            >
                {{ isLastStep ? 'Finish' : 'Next' }}
            </button>
        </div>
    </div>
    <div v-if="finished" class="step-wrapper finished">
        <p>You data has been successfully submitted</p>
        <button class="btn__pri" @click="resetForm">Reset Form</button>
    </div>
</div>
</template>

<style scoped>
.page-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.step-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 850px;
    height: 100%;
    margin: 0 auto;
}
.step-wrapper.finished {
    justify-content: center;
    align-items: center;
}
.step__header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem
}
.step__header h2, .step__header p {
    margin: 0;
}
.step__body {
    height: 100%;
}
.step__footer {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}
</style>
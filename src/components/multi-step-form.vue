<script setup>
import Accordion from '@/components/accordion.vue';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

const store = useStore();

const currentStepIndex = ref(0);
const finished = ref(false);

const steps = computed(() => store.state.formSchema || [])
const currentStep = computed(() => steps.value[currentStepIndex.value]);
const currentStepId = computed(() => currentStep.value?.id || '');
const currentStepTitle = computed(() => currentStep.value?.title || '');
const isFirstStep = computed(() => currentStepIndex.value === 0);
const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1);

const currentSections = computed(() => {
  return (currentStep.value?.sections || []).map(section => ({
    ...section,
    open: store.state.accordionState[currentStepId.value] === section.id,
    values: store.state.formData[currentStepId.value]?.[section.id] || {}
  }));
});

const goToNextStep = async () => {
  if (!isLastStep.value) {
    currentStepIndex.value++;
  } else {
    try {
        await store.dispatch('submitForm');
        finished.value = true;
    } catch (error) {
        alert('Failed to submit form:', error);
        finished.value = false;
    }
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
                :stepKey="currentStepId"
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
    padding-block: 5rem;
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
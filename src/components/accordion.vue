<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const props = defineProps({
  stepKey: {
    type: String,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
  }
});

const store = useStore();

const toggleSection = (sectionKey) => {
  const currentlyOpen = store.state.accordionState[props.stepKey];

  if (currentlyOpen === sectionKey) {
    store.commit('setAccordionState', { step: props.stepKey, sectionKey: null });
  } else {
    store.commit('setAccordionState', { step: props.stepKey, sectionKey });
  }
};

const updateField = (sectionKey, fieldKey, value) => {
  store.commit('updateField', {
    step: props.stepKey,
    section: sectionKey,
    field: fieldKey,
    value,
  });
};
</script>

<template>
  <div class="accordion">
    <div
      v-for="section in sections"
      :key="section.id"
      class="accordion__section"
    >
      <div
        class="accordion__section__head"
        @click="toggleSection(section.id)"
      >
        <div class="accordion__section__head__title-wrapper">
          <div class="title-container">
            <h3 class="accordion__section__title">{{ section.title }}</h3>
            <span v-if="section.status" class="status--state">{{ section.status }}</span>
          </div>
          <p>{{ section.description }}</p>
        </div>
        <div class="accordion__section__head__icon">
          <img
            :src="section.open
              ? require('@/assets/Icons/Icon-arrw-head-up.svg')
              : require('@/assets/Icons/Icon-arrw-head-down.svg')"
            alt="Toggle Icon"
          />
        </div>
      </div>

      <div v-if="section.open" class="accordion__section__body">
        <form>
          <div
            v-for="(field, fieldKey) in section.fields"
            :key="fieldKey"
            class="input-group"
          >
            <label :for="field.id">{{ field.label }}</label>
            <input
              :id="field.id"
              :type="field.type"
              :value="section.values[field.id] || ''"
              @blur="e => updateField(section.id, field.id, e.target.value)"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.accordion {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 auto;
}
.accordion__section {
    border: 1px solid #ccc;
    border-radius: 12px;
}
.accordion__section__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
}
.accordion__section__head__title-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.accordion__section__head__title-wrapper .title-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
.accordion__section__head__title-wrapper .title-container h3 {
    font-size: 1.25rem;
    margin: 0;
}
.accordion__section__head__title-wrapper p {
    font-size: 1rem;
    color: #666;
    margin: 0;
}
.accordion__section__head__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
}
.accordion__section__body {
    padding: 1rem;
    border-top: 1px solid #ccc;
}
.accordion__section__body form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
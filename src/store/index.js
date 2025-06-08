import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { getFormSchema, submitForm } from '../api/formApi';

const getInitialFormData = (schema) => {
  const formData = {};
  schema.forEach((step) => {
    formData[step.id] = {};
    step.sections.forEach((section) => {
      const values = {};
      section.fields.forEach((field) => {
        values[field.id] = '';
      });
      formData[step.id][section.id] = values;
    });
  });
  return formData;
};

export default createStore({
  state: {
    formSchema: {},
    formData: {},
    accordionState: {},
  },
  mutations: {
    setFormSchema(state, schema) {
      state.formSchema = schema;
      state.formData = getInitialFormData(schema);

      const accordion = {};
      schema.forEach((step) => {
        accordion[step.id] = null;
      });

      state.accordionState = accordion;
    },
    updateField(state, { step, section, field, value }) {
      state.formData[step][section][field] = value;
    },
    setAccordionState(state, { step, sectionKey }) {
      state.accordionState[step] = sectionKey;
    },
    resetFormData(state) {
      state.formData = getInitialFormData(state.formSchema);
      state.accordionState = {};
    }
  },
  actions: {
    async initializeFormSchema({ commit }) {
      try {
        const res = await getFormSchema();
        commit('setFormSchema', res.data.steps);
      } catch (error) {
        console.error('Failed to load form schema:', error);
      }
    },

    async submitForm({ state }) {
      try {
        const response = await submitForm(state.formData);
        console.log('Form submitted successfully:', response.data);
      } catch (error) {
        console.error('Failed to submit form:', error);
      }
    },
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: ['formData', 'openAccordion'],
    }),
  ],
});
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

const getInitialFormSchema = () => ({
  step1: {
    stepTitle: "Step 1's Title",
    section1: {
      title: "Section 1's Title",
      description: "A simple description of section 1",
      fields: {
        input1: { label: 'Input 1', type: 'text' },
        input2: { label: 'Input 2', type: 'text' },
      },
    },
    section2: {
      title: "Section 2's Title",
      description: "A simple description of section 2",
      fields: {
        input3: { label: 'Input 3', type: 'text' },
        input4: { label: 'Input 4', type: 'text' },
      },
    },
    section3: {
      title: "Section 3's Title",
      description: "A simple description of section 3",
      fields: {
        input5: { label: 'Input 5', type: 'text' },
        input6: { label: 'Input 6', type: 'text' },
      },
    },
  },
  step2: {
    stepTitle: "Step 2's Title",
    section1: {
      title: "Section 1's Title",
      description: "A simple description of section 1",
      fields: {
        input7: { label: 'Input 7', type: 'text' },
        input8: { label: 'Input 8', type: 'text' },
      },
    },
    section2: {
      title: "Section 2's Title",
      description: "A simple description of section 2",
      fields: {
        input9: { label: 'Input 9', type: 'text' },
        input10: { label: 'Input 10', type: 'text' },
      },
    },
  },
  step3: {
    stepTitle: "Step 3's Title",
    section1: {
      title: "Section 1's Title",
      description: "A simple description of section 1",
      fields: {
        input11: { label: 'Input 11', type: 'text' },
        input12: { label: 'Input 12', type: 'text' },
      },
    },
    section2: {
      title: "Section 2's Title",
      description: "A simple description of section 2",
      fields: {
        input13: { label: 'Input 13', type: 'text' },
        input14: { label: 'Input 14', type: 'text' },
      },
    },
  },
});

const getInitialFormData = (schema) => {
  const formData = {};
  Object.entries(schema).forEach(([step, sections]) => {
    formData[step] = {};
    Object.entries(sections).forEach(([sectionKey, section]) => {
      if (sectionKey !== 'stepTitle') {
        const values = {};
        Object.keys(section.fields).forEach(fieldKey => {
          values[fieldKey] = '';
        });
        formData[step][sectionKey] = values;
      }
    });
  });
  return formData;
};

const formSchema = getInitialFormSchema();
const formData = getInitialFormData(formSchema);

export default createStore({
  state: {
    formSchema,
    formData,
    accordionState: {}, // track which section is open per step
  },
  mutations: {
    updateField(state, { step, section, field, value }) {
      state.formData[step][section][field] = value;
    },
    setAccordionState(state, { step, sectionKey }) {
      state.accordionState[step] = sectionKey;
    },
    resetFormData(state) {
      state.formData = getInitialFormData(formSchema);
      state.accordionState = {};
    }
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: ['formData', 'openAccordion'],
    }),
  ],
});
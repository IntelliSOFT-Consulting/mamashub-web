import * as yup from 'yup';

const tetanusAndDiptheria = {
  'Tetanus Diptheria (TD) Injection': [
    {
      name: 'ttTetanusDiptheriaInjectionTTProvided',
      label: 'Was TT immunization provided?',
      type: 'radio',
      validate: yup.string().required('TT immunization is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
    },
    {
      name: 'tetanusDiptheriaInjectionTTResults',
      label: 'If yes, when was it provided?',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.ttImmunization === 'Yes',
    },
    {
      name: 'tetanusDiptheriaInjectionNextVisit',
      label: 'Next visit',
      type: 'date',
      validate: yup.date().required('Next visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
};

export default tetanusAndDiptheria;

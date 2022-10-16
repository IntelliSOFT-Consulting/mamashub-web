import * as yup from 'yup';

const maternalSerology = {
  'Maternal Serology Results': [
    {
      name: 'maternalSerologyRepeatSerology',
      label: 'Was repeat serology done?',
      type: 'radio',
      validate: yup.string().required('Repeat serology done is required'),
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
      name: 'maternalSerologyRepeatSerologyDetailsNo',
      label: 'If no, date of next appointment',
      type: 'date',
      validate: yup.date().min(new Date(), 'Date must be in the future'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.repeatSerologyDone === 'No',
    },
    {
      name: 'maternalSerologyRepeatSerologyDetailsYes',
      label: 'If yes, date test was done',
      type: 'date',
      validate: yup.date().max(new Date(), 'Date must be in the past'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.repeatSerologyDone === 'Yes',
    },
    {
      name: 'maternalSerologyRepeatSerologyResults',
      label: 'If yes, test result',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'R', value: 'R' },
        { label: 'NR', value: 'NR' },
      ],
    },
  ],
  Reactive: [
    {
      name: 'maternalSerologyReactiveMaternalSerologyPMTCT',
      label: 'If reactive, refer to the PMTCT clinic',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.testResult === 'R',
    },
    {
      name: 'maternalSerologyReactiveMaternalSerologyPartnerTest',
      label: 'If reactive, test partner',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.testResult === 'R',
    },
  ],
  'Non-Reactive': [
    {
      name: 'maternalserologyNonReactiveSerologyBook',
      label: 'If non-reactive, book for repeat serology test',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 8,
      },
      relevant: formValues => formValues.testResult === 'NR',
    },
    {
      name: 'maternalserologyNonReactiveSerologyContinueTest',
      label:
        'If non-reactive, continue testing until complete cessation of breastfeeding',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 8,
      },
      relevant: formValues => formValues.testResult === 'NR',
    },
    {
      name: 'maternalserologyNonReactiveSerologyAppointment',
      label: 'If non-reactive, date of next appointment',
      type: 'date',
      validate: yup.date().min(new Date(), 'Date must be in the future'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.testResult === 'NR',
    },
  ],
};

export default maternalSerology;

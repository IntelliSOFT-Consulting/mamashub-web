import * as yup from 'yup';

const presentPregnancy = {
  'Current Pregnancy Details': [
    {
      name: 'numberOfContacts',
      label: 'Number of contacts',
      type: 'text',
      validate: yup.number().required('Number of contacts is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'dateOfLastContact',
      label: 'Date',
      type: 'date',
      validate: yup.date().required('Date is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'muac',
      label: 'MUAC (cm)',
      type: 'text',
      validate: yup.number().required('MUAC is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'urineTestDone',
      label: 'Urine test done',
      type: 'radio',
      validate: yup.string().required('Urine test done is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
    },
    {
      name: 'urineTestResult',
      label: 'If yes, give result',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.urineTestDone === 'Yes',
    },
  ],
  'Blood Pressure': [
    {
      name: 'systolicBp',
      label: 'Systolic blood pressure',
      type: 'text',
      validate: yup.number().required('Systolic blood pressure is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'diastolicBp',
      label: 'Diastolic blood pressure',
      type: 'text',
      validate: yup.number().required('Diastolic blood pressure is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'HB Test': [
    {
      name: 'hbTestDone',
      label: 'HB test done',
      type: 'radio',
      validate: yup.string().required('HB test done is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
    },
    {
      name: 'hbTestResult',
      label: 'If yes, give result',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hbTestDone === 'Yes',
    },
    {
      name: 'pallor',
      label: 'Pallor',
      type: 'radio',
      validate: yup.string().required('Pallor is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
    },
    {
      name: 'gestationalAge',
      label: 'Gestation in weeks',
      type: 'text',
      validate: yup.number().required('Gestational age is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'fundalHeight',
      label: 'Fundal height (cm)',
      type: 'text',
      validate: yup.number().required('Fundal height is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  Presentation: [
    {
      name: 'numberOfPresentationContacts',
      label: 'Number of contacts',
      type: 'text',
      validate: yup.number().required('Number of contacts is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'lie',
      label: 'Lie',
      type: 'radio',
      validate: yup.string().required('Lie is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { label: 'Longitudinal', value: 'Longitudinal' },
        { label: 'Oblique', value: 'Oblique' },
        { value: 'Transverse', label: 'Transverse' },
      ],
    },
    {
      name: 'heartRate',
      label: 'Foetal heart rate',
      type: 'radio',
      validate: yup.string().required('Foetal heart rate is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Normal', value: 'Normal' },
        { label: 'Abnormal', value: 'Abnormal' },
      ],
    },
    {
      name: 'foetalMovement',
      label: 'Foetal movement',
      type: 'radio',
      validate: yup.string().required('Foetal movement is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        { label: 'Normal', value: 'Normal' },
        { label: 'Abnormal', value: 'Abnormal' },
      ],
    },
    {
      name: 'nextVisitDate',
      label: 'Next visit',
      type: 'date',
      validate: yup.date().required('Next visit date is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
};

export default presentPregnancy;

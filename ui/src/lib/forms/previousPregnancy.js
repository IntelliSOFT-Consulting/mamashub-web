import * as yup from 'yup';

const previousPregnancy = {
  'Pregnancy Details': [
    {
      name: 'previousPregnancyOrder',
      label: 'Pregnancy Order',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancyYear',
      label: 'Year',
      type: 'text',
      validate: yup
        .number()
        .max(new Date().getFullYear(), 'Year cannot be in the future'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancynoOfTimesANCAttended',
      label: 'Number of times ANC attended for every pregnancy',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancychildBirthPlace',
      label: 'Place of child birth',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancyGestation',
      label: 'Gestation (weeks)',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancyDurationOfLabour',
      label: 'Duration of labour',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'previousPregnancyDeliveryMode',
      label: 'Mode of delivery',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        {
          value: 'vaginal delivery',
          label: 'Vaginal delivery',
        },
        {
          value: 'Assisted vaginal delivery',
          label: 'Assisted vaginal delivery',
        },
        {
          value: 'Caesarean section',
          label: 'Caesarean section',
        },
      ],
    },
  ],
  'Baby Details': [
    {
      name: 'previousPregnancyBabyWeight',
      label: 'Birth weight (g)',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
    },
    {
      name: 'previousPregnancyBabySex',
      label: 'Baby sex',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
      ],
    },
    {
      name: 'previousPregnancyOutcome',
      label: 'Outcome',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { label: 'Dead', value: 'Dead' },
        { label: 'Alive', value: 'Alive' },
      ],
    },
    {
      name: 'previousPregnancyPurperium',
      label: 'Purperium',
      type: 'radio',
      validate: yup.string(),
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
      name: 'previousPregnancyAbnornmalPurperium',
      label: 'If abnormal, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.purperium === 'Abnormal',
    },
  ],
};

export default previousPregnancy;

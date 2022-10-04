import * as yup from 'yup';

const counsellingForm = {
  'counselling Done': [
    {
      name: 'dangerSigns',
      label: 'Danger signs counselling:',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'dentalHealthMother',
      label: 'Dental health tor mother:',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'birthCounselling',
      label: 'Birth plan counselling:',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'rhNegative',
      label: 'Rh negative counselling:',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
  ],
  'Pregnancy Care Counselling Done:': [
    {
      name: 'extraMeal',
      label: 'Was mother advised to eat one extra meal a day?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'fiveFoodGroups',
      label:
        'Was mother advised to eat at least 5 of the 10 food groups everyday?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'drinkWater',
      label:
        'Was mother advised to drink plenty of water at leas 8 glasses (2lts) a day?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'ironAndFolicAcid',
      label: 'Was mother advised to take iron and folic acids (IFAS) everyday?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'avoidHeavyWork',
      label: 'Was mother advised to avoid heavy work, rest more?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'lln',
      label:
        'Was mother advised to to seen under a lona lastina insecticidal net (LLIN)?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'visitAnc',
      label:
        'Was mother advised to go for ANC visit as soon as possible and attend 8 times during pregnancy?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'regularExercise',
      label: 'Was mother advised to do regular non-strenuous exercise?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
  ],
  'Infant Feeding Counselling': [
    {
      name: 'infantFeeding',
      label: 'Was infant feeding counselling done?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'breastFeeding',
      label:
        'Was counselling on exclusive breastfeeding and benefits of colostrum done?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
  ],
  'Danger Signs During Pregnancy': [
    {
      name: 'paleness',
      label: 'Was the mother pale?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'headache',
      label: 'Does the mother have severe headache?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'vaginalBleeding',
      label: 'Did the mother have vaginal bleeding?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'abdominalPain',
      label: 'Did the mother have severe abdominal pain?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'babyMovement',
      label: 'Did the mother have reduced or no movement of the unborn baby?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'convolutions',
      label: 'Did the mother have convulsions/fits?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'waterBreaking',
      label: 'Was the mothers water breaking?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'swollenFaceAndHands',
      label: 'Did the mother have swollen face and hands?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
      name: 'fever',
      label: 'Did the mother have a fever?',
      type: 'radio',
      validate: yup.string().required('Please select an option'),
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
  ],
};

export default counsellingForm;

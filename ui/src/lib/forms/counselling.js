import * as yup from 'yup';

const counsellingForm = {
  'Counselling Done': [
    {
      name: 'counsellingDangerSigns',
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
      name: 'counsellingDentalHealth',
      label: 'Dental health for mother:',
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
      name: 'counsellingBirthPlan',
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
      name: 'counsellingRhNegative',
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
      name: 'pregnancyCareMotherAdvicedToEatOneMeal',
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
      name: 'pregnancyCareMotherAdvicedToEatAtleast5/10Foods',
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
      name: 'pregnancyCareMotherAdvicedToDrinkWater',
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
      name: 'pregnancyCareMotherAdvicedToTakeIFAS',
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
      name: 'pregnancyCareMotherAdvicedToAvoidHeavyWork',
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
      name: 'pregnancyCareMotherAdvicedToSleepUnderLLIN',
      label:
        'Was mother advised to to seen under a long lasting insecticidal net (LLIN)?',
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
      name: 'pregnancyCareMotherAdvicedToGoForANC',
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
      name: 'pregnancyCareMotherAdvicedToGoForRegularNonStrenous',
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
      name: 'infantFeedingCousellingInfantFeedingCounselling',
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
      name: 'infantFeedingCousellingCounsellingOnExclusiveBreastfeedingAndBenefits',
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
      name: 'dangerSignsDuringPregnancyWasTheMotherPale',
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
      name: 'dangerSignsDuringPregnancyDoesTheMotherHaveSevereHeadache',
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
      name: 'dangerSignsDuringPregnancyMotherHaveVaginalBleeding',
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
      name: 'dangerSignsDuringPregnancyMotherHaveSevereAbdominalPain',
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
      name: 'dangerSignsDuringPregnancyReducedOrNoMovementofTheUnborn',
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
      name: 'dangerSignsDuringPregnancyMotherHaveFits',
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
      name: 'dangerSignsDuringPregnancyMotherWaterBreaking',
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
      name: 'dangerSignsDuringPregnancyMotherHaveSwollenFaceAndHands',
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
      name: 'dangerSignsDuringPregnancyMotherHaveFever',
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

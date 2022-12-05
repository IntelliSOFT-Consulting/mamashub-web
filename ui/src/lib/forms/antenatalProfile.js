import * as yup from 'yup';

const antenatalForm = {
  'Blood Tests': [
    {
      name: 'hbTestHbTestDone',
      label: 'Hb Test',
      type: 'radio',
      validate: yup.string().required('Hb Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'hbTestHbTestReading',
      label: 'If yes, specify reading',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hbTestHbTestDone === 'Yes',
    },
    {
      name: 'bloodGroupTest',
      label: 'Blood Group Test',
      type: 'radio',
      validate: yup.string().required('Blood Group Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'A',
          value: 'A',
        },
        {
          label: 'B',
          value: 'B',
        },
        {
          label: 'AB',
          value: 'AB',
        },
        {
          label: 'O',
          value: 'O',
        },
      ],
      relevant: formValues => formValues.bloodGroupTest === 'Yes',
    },
    {
      name: 'rhTest',
      label: 'Rhesus Test',
      type: 'radio',
      validate: yup.string().required('Rhesus Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'rhesusFactor',
      label: 'If yes, specify rhesus factor',
      type: 'radio',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Rh Positive',
          value: 'Rh Positive',
        },
        {
          label: 'Rh Negative',
          value: 'Rh Negative',
        },
      ],
      relevant: formValues => formValues.rhTest === 'Yes',
    },
    {
      name: 'bloodRBSTest',
      label: 'Blood RBS Test',
      type: 'radio',
      validate: yup.string().required('Blood RBS Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'bloodRBSTestResults',
      label: 'If yes, RBS reading',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.bloodRBSTest === 'Yes',
    },
  ],
  'Urine Test': [
    {
      name: 'urinalysis',
      label: 'Urinalysis Test',
      type: 'radio',
      validate: yup.string().required('Urinalysis Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'urinalysisTestResults',
      label: 'If yes, test results',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Normal',
          value: 'Normal',
        },
        {
          label: 'Abnormal',
          value: 'Abnormal',
        },
      ],
      relevant: formValues => formValues.urinalysis === 'Yes',
    },
  ],
  'TB Screening': [
    {
      name: 'tbScreening',
      label: 'TB Screening',
      type: 'radio',
      validate: yup.string().required('TB Screening is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'tbScreeningResults',
      label: 'If yes, TB results',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Positive',
          value: 'Positive',
        },
        {
          label: 'Negative',
          value: 'Negative',
        },
      ],
      relevant: formValues => formValues.tbScreening === 'Yes',
    },
    {
      name: 'tbDiagnosis',
      label: 'If positive, send for TB diagnosis',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => (formValues.tbScreeningResults === 'Positive' && formValues.tbScreening === 'Yes' ),
    },
    {
      name: 'ipt',
      label: 'If negative, was IPT given as per eligibility?',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      relevant: formValues => formValues.tbScreeningResults === 'Negative',
    },
    {
      name: 'iptDate',
      label: 'IPT date given',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.ipt === 'Yes',
    },
    {
      name: 'iptNextVisit',
      label: 'Next IPT visit',
      type: 'date',
      validate: yup.date().required('Next IPT visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Multiple Pregnancy': [
    {
      name: 'multipleBabies',
      label: 'Multiple Babies',
      type: 'radio',
      validate: yup.string().required('Multiple Babies is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'multipleBabiesNumber',
      label: 'If yes, input number',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.multipleBabies === 'Yes',
    },
  ],
  'Obstetric Ultrasound': [
    {
      name: 'firstObstreticUltrasound',
      label: '1st Obstretic Ultrasound',
      type: 'radio',
      validate: yup.string().required('1st Obstetric Ultrasound is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'firstObstreticUltrasoundDate',
      label: 'Date performed',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.firstObstreticUltrasound === 'Yes',
    },
    {
      name: 'gestationByFirstObstreticUltrasound',
      label: 'Gestation by 1st Obstetric Ultrasound',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.firstObstreticUltrasound === 'Yes',
    },
    {
      name: 'secondObstreticUltrasound',
      label: '2nd Obstretic Ultrasound',
      type: 'radio',
      validate: yup.string().required('2nd Obstetric Ultrasound is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'secondObstreticUltrasoundDate',
      label: 'Date performed',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.secondObstreticUltrasound === 'Yes',
    },
    {
      name: 'gestationBySecondObstreticUltrasound',
      label: 'Gestation by 2nd Obstetric Ultrasound',
      type: 'text',
      validate: yup.number(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.secondObstreticUltrasound === 'Yes',
    },
  ],
  'HIV Status': [
    {
      name: 'hivStatusBeforeFirstAnc',
      label: 'HIV Status before 1st ANC visit',
      type: 'radio',
      validate: yup
        .string()
        .required('HIV Status before 1st ANC visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'N',
          value: 'N',
        },
        {
          label: 'U',
          value: 'U',
        },
        {
          label: 'KP',
          value: 'KP',
        },
      ],
    },
    {
      name: 'artEligibility',
      label: 'ART Eligibility (WHO Stage)',
      type: 'select',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'I',
          value: 'I',
        },
        {
          label: 'II',
          value: 'II',
        },
        {
          label: 'III',
          value: 'III',
        },
        {
          label: 'IV',
          value: 'IV',
        },
      ],
    },
  ],
  'Maternal HAART': [
    {
      name: 'onArvBeforeFirstAnc',
      label: 'On ARV before 1st ANC visit',
      type: 'radio',
      validate: yup
        .string()
        .required('On ARV before 1st ANC visit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      relevant: formValues => formValues.hivStatusBeforeFirstAnc === 'KP',
    },
    {
      name: 'startedHaartInAnc',
      label: 'Started HAART in ANC',
      type: 'radio',
      validate: yup.string().required('Started HAART in ANC is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      relevant: formValues => formValues.hivStatusBeforeFirstAnc === 'KP',
    },
    {
      name: 'clotrimoxazoleGiven',
      label: 'Clotrimoxazole given',
      type: 'radio',
      validate: yup.string().required('Clotrimoxazole given is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      relevant: formValues => formValues.hivStatusBeforeFirstAnc === 'KP',
    },
  ],
  'HIV Testing': [
    {
      name: 'hivTested',
      label: 'HIV Test',
      type: 'radio',
      validate: yup.string().required('HIV Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'hivTestDate',
      label: 'If yes, Date of Test',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hivTested === 'Yes',
    },
    {
      name: 'nextDateOfHivTestNR',
      label: 'If NR, Select the Next Date of Test',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hivTested === 'Yes',
    },
    {
      name: 'hivStatusOfMother',
      label: 'HIV Status of Mother',
      type: 'radio',
      validate: yup.string().required('HIV Status of Mother is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'R',
          value: 'R',
        },
        {
          label: 'Inconclusive',
          value: 'Inconclusive',
        },
        {
          label: 'NR',
          value: 'NR',
        },
      ],
    },
    {
      name: 'hivTestDateOfPartner',
      label: 'If yes, Date of Test',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hivStatusOfMother === 'R',
    },
  ],
  'Syphillis Testing': [
    {
      name: 'syphilisTested',
      label: 'Syphilis Test',
      type: 'radio',
      validate: yup.string().required('Syphilis Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'syphilisTestDate',
      label: 'If yes, Date of Test',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.syphilisTested === 'Yes',
    },
    {
      name: 'syphillisStatusOfMother',
      label: 'Syphilis Status of Mother',
      type: 'radio',
      validate: yup.string().required('Syphilis Status of Mother is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.syphilisTested === 'Yes',
      options: [
        {
          label: 'R',
          value: 'R',
        },
        {
          label: 'Inconclusive',
          value: 'Inconclusive',
        },
        {
          label: 'NR',
          value: 'NR',
        },
      ],
    },
  ],
  'Hepatitis B Testing': [
    {
      name: 'hepatitisBTested',
      label: 'Hepatitis B Test',
      type: 'radio',
      validate: yup.string().required('Hepatitis B Test is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'hepatitisBTestDate',
      label: 'If yes, Date of Test',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: formValues => formValues.hepatitisBTested === 'Yes',
    },
    {
      name: 'hepatitisBStatusOfMother',
      label: 'Hepatitis B Status of Mother',
      type: 'radio',
      validate: yup
        .string()
        .required('Hepatitis B Status of Mother is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
        relevant: formValues => formValues.hepatitisBTested === 'Yes',
      options: [
        {
          label: 'R',
          value: 'R',
        },
        {
          label: 'Inconclusive',
          value: 'Inconclusive',
        },
        {
          label: 'NR',
          value: 'NR',
        },
      ],
    },
  ],
  'Couple Counselling and Testing': [
    {
      name: 'coupleCounsellingAndTesting',
      label: 'Couple HIV Counselling and Testing done?',
      type: 'radio',
      validate: yup
        .string()
        .required('Couple HIV Counselling and Testing is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
    },
    {
      name: 'partnerHivStatus2',
      label: 'Partner HIV Status',
      type: 'radio',
      validate: yup.string().required('Partner HIV Status is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Reactive',
          value: 'Reactive',
        },
        {
          label: 'Non Reactive',
          value: 'Non Reactive',
        },
      ],
    },
    {
      name: 'partnerReferredForHivCare',
      label: 'If Reactive, Was the Partner Referred for HIV Care?',
      type: 'radio',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      options: [
        {
          label: 'Yes',
          value: 'Yes',
        },
        {
          label: 'No',
          value: 'No',
        },
      ],
      relevant: formValues => formValues.partnerHivStatus === 'Reactive',
    },
    {
      name: 'referralDate',
      label: 'Referral Date',
      type: 'date',
      validate: yup.date().required('Referral Date is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
};

export default antenatalForm;

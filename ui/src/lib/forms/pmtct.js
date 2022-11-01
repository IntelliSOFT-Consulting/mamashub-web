import * as yup from 'yup';

const pmtct = {
  'Intervention Given': [
    {
      name: 'interventionInterventionGiven',
      label: 'Intervention Given',
      type: 'checkbox',
      validate: yup.array().min(1, 'Please select at least one option'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      options: [
        { value: 'ART for life', label: 'ART for life' },
        { value: 'Viral Load (VL) sample', label: 'Viral Load (VL) sample' },
      ],
    },
  ],
  'ART for life': [
    {
      name: 'interventionDateStarted',
      label: 'If yes, date started',
      type: 'date',
      validate: yup.date(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.interventionInterventionGiven?.includes('ART for life'),
    },
    {
      name: 'interventionRegimen',
      label: 'ART Regimen (Select all that apply)',
      type: 'radio',
      options: [],
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.interventionInterventionGiven?.includes('ART for life'),
    },
    {
      name: 'dolutegravir',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Dolutegravir', label: 'Dolutegravir' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'dolutegravirAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.dolutegravir.includes('Dolutegravir'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.dolutegravir.includes('Dolutegravir'),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.dolutegravir.includes('Dolutegravir'),
    },
    {
      name: 'emitricitabine',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Emitricitabine', label: 'Emitricitabine' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'emitricitabineAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.emitricitabine.includes('Emitricitabine'),
    },
    {
      name: 'emitricitabineDosage',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.emitricitabine.includes('Emitricitabine'),
    },
    {
      name: 'emitricitabineFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.emitricitabine.includes('Emitricitabine'),
    },
    {
      name: 'tenofovoirAlafenamideFumarate',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [
        {
          value: 'Tenofovoir alafenamide fumarate',
          label: 'Tenofovoir alafenamide fumarate',
        },
      ],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'tenofovoirAlafenamideFumarateAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.tenofovoirAlafenamideFumarate.includes(
          'Tenofovoir alafenamide fumarate'
        ),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.tenofovoirAlafenamideFumarate.includes(
          'Tenofovoir alafenamide fumarate'
        ),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.tenofovoirAlafenamideFumarate.includes(
          'Tenofovoir alafenamide fumarate'
        ),
    },
    {
      name: 'interventionOtherRegimen',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Zidovudine', label: 'Zidovudine' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'zidovudineAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.interventionOtherRegimen.includes('Zidovudine'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.interventionOtherRegimen.includes('Zidovudine'),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values =>
        values.interventionOtherRegimen.includes('Zidovudine'),
    },
    {
      name: 'lamivudine',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Lamivudine', label: 'Lamivudine' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.lamivudine.includes('Lamivudine'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.lamivudine.includes('Lamivudine'),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.lamivudine.includes('Lamivudine'),
    },
    {
      name: 'nevirapine',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Nevirapine', label: 'Nevirapine' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.nevirapine.includes('Nevirapine'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.nevirapine.includes('Nevirapine'),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.nevirapine.includes('Nevirapine'),
    },
    {
      name: 'efavirenz',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Efavirenz', label: 'Efavirenz' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Amount',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.efavirenz.includes('Efavirenz'),
    },
    {
      name: 'interventionARTDosageAmount',
      label: 'Dosage',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.efavirenz.includes('Efavirenz'),
    },
    {
      name: 'interventionARTFrequency',
      label: 'Frequency',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.efavirenz.includes('Efavirenz'),
    },
    {
      name: 'other',
      label: '',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [{ value: 'Other', label: 'Other' }],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'otherAmount',
      label: 'If other, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.other.includes('Other'),
    },
    {
      name: 'interventionRegimenChange',
      label: 'Was the regimen changed?',
      type: 'radio',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
      relevant: values =>
        values.interventionInterventionGiven.includes('ART for life'),
    },
    {
      name: 'interventionReasonForRegimenChange',
      label: 'If yes, give reason (select all that apply)',
      type: 'checkbox',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },

      options: [
        { value: 'Change in viral load', label: 'Change in viral load' },
        { value: 'Adverse reactions', label: 'Adverse reactions' },
        {
          value: 'Interation with another drug concomitantly used',
          label: 'Interation with another drug concomitantly used',
        },
        { value: 'Pregnancy trimester', label: 'Pregnancy trimester' },
        { value: 'Other', label: 'Other' },
      ],
      relevant: values => values.interventionRegimenChange.includes('Yes'),
    },
    {
      name: 'interventionOtherReasonForRegimenChange',
      label: 'If other, please specify',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 7,
      },
      relevant: values => values.interventionReasonForRegimenChange.includes('Other'),
    },
  ],
  'Viral Load (VL) Sample': [
    {
      name: 'interventionViralLoadDate',
      label: 'If yes, date viral load was taken',
      type: 'date',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: values =>
        values.interventionInterventionGiven.includes('Viral Load (VL) sample'),
    },
    {
      name: 'interventionViralLoadResults',
      label: 'Results',
      type: 'text',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
      relevant: values =>
        values.interventionInterventionGiven.includes('Viral Load (VL) sample'),
    },
  ],
};

export default pmtct;

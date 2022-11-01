import * as yup from 'yup';

const birthPlan = {
  'Birth Plan': [
    {
      name: 'edd',
      label: 'EDD',
      type: 'date',
      validate: yup.date().required('EDD is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'facilityName',
      label: 'Health Facility Name',
      type: 'text',
      validate: yup.string().required('Health Facility Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'facilityNumber',
      label: 'Health Facility Number',
      type: 'text',
      validate: yup.string().required('Health Facility Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
  ],
  'Birth Attendant': [
    {
      name: 'birthAttendantName',
      label: 'Birth Attendant Name',
      type: 'text',
      validate: yup.string().required('Birth Attendant Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'birthAttendantNumber',
      label: 'Birth Attendant Telephone Number',
      type: 'text',
      validate: yup
        .string()
        .required('Birth Attendant Telephone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'birthAttendantDesignation',
      label: 'Birth Attendant Designation',
      type: 'select',
      validate: yup
        .string()
        .required('Birth Attendant Designation is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
      options: [
        { value: 'Midwife', label: 'Midwife' },
        { value: 'Obstetrician', label: 'Obstetrician' },
      ],
    },
  ],
  'Alternative Birth Attendant': [
    {
      name: 'alternativeBirthAttendantName',
      label: 'Alternative Birth Attendant Name',
      type: 'text',
      validate: yup
        .string()
        .required('Alternative Birth Attendant Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'alternativeBirthAttendantNumber',
      label: 'Alternative Birth Attendant Telephone Number',
      type: 'text',
      validate: yup
        .string()
        .required('Alternative Birth Attendant Telephone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'alternativeBirthAttendantDesignation',
      label: 'Alternative Birth Attendant Designation',
      type: 'select',
      validate: yup
        .string()
        .required('Alternative Birth Attendant Designation is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
      options: [
        { value: 'Midwife', label: 'Midwife' },
        { value: 'Obstetrician', label: 'Obstetrician' },
      ],
    },
  ],
  'Birth Companion': [
    {
      name: 'birthCompanionName',
      label: 'Birth Companion Name',
      type: 'text',
      validate: yup.string().required('Birth Companion Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'birthCompanionNumber',
      label: 'Birth Companion Telephone Number',
      type: 'text',
      validate: yup
        .string()
        .required('Birth Companion Telephone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'birthCompanionRelationship',
      label: 'Birth Companion Relationship',
      type: 'select',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
      options: [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Child(B)', label: 'Child(B)' },
        { value: 'Child(R)', label: 'Child(R)' },
        { value: 'Parent', label: 'Parent' },
        { value: 'Relatives', label: 'Relatives' },
      ],
    },
    {
      name: 'birthCompanionTransportMeans',
      label: 'Birth Companion Transport Means',
      type: 'select',
      validate: yup
        .string()
        .required('Birth Companion Transport Means is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
      options: [
        { value: 'Taxi', label: 'Taxi' },
        { value: 'Personal vehicle', label: 'Personal vehicle' },
        { value: 'Donkey Cart', label: 'Donkey Cart' },
        { value: 'Ambulance', label: 'Ambulance' },
        { value: 'Motorcycle', label: 'Motorcycle' },
      ],
    },
  ],
  'Alternative Birth Companion': [
    {
      name: 'alternativeBirthCompanionName',
      label: 'Alternative Birth Companion Name',
      type: 'text',
      validate: yup
        .string()
        .required('Alternative Birth Companion Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'alternativeBirthCompanionNumber',
      label: 'Alternative Birth Companion Telephone Number',
      type: 'text',
      validate: yup
        .string()
        .required('Alternative Birth Companion Telephone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
    },
    {
      name: 'alternativeBirthCompanionRelationship',
      label: 'Alternative Birth Companion Relationship',
      type: 'select',
      validate: yup.string(),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
      options: [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Child(B)', label: 'Child(B)' },
        { value: 'Child(R)', label: 'Child(R)' },
        { value: 'Parent', label: 'Parent' },
        { value: 'Relatives', label: 'Relatives' },
      ],
    },
    {
      name: 'alternativeBirthCompanionTransportMeans',
      label: 'Alternative Birth Companion Transport Means',
      type: 'select',
      validate: yup
        .string()
        .required('Alternative Birth Companion Transport Means is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 3,
      },
      options: [
        { value: 'Taxi', label: 'Taxi' },
        { value: 'Personal vehicle', label: 'Personal vehicle' },
        { value: 'Donkey Cart', label: 'Donkey Cart' },
        { value: 'Ambulance', label: 'Ambulance' },
        { value: 'Motorcycle', label: 'Motorcycle' },
      ],
    },
  ],
  'Blood Donor': [
    {
      name: 'bloodDonorName',
      label: 'Blood Donor Name',
      type: 'text',
      validate: yup.string().required('Blood Donor Name is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'bloodDonorNumber',
      label: 'Blood Donor Telephone Number',
      type: 'text',
      validate: yup
        .string()
        .required('Blood Donor Telephone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
    {
      name: 'bloodDonorBloodGroup',
      label: 'Blood Donor Blood Group',
      type: 'radio',
      validate: yup.string().required('Blood Donor Blood Group is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
      options: [
        { value: 'A', label: 'A' },
        { value: 'B', label: 'B' },
        { value: 'AB', label: 'AB' },
        { value: 'O', label: 'O' },
      ],
    },
  ],
  'Financial Plan': [
    {
      name: 'financialPlan',
      label: 'Financial plan for child birth',
      type: 'text',
      validate: yup
        .string()
        .required('Financial plan for child birth is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 4,
      },
    },
  ],
};

export default birthPlan;

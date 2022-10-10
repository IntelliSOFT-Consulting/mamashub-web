import counties from '../../data/counties.json';
import * as yup from 'yup';

const formData = {
  'Facility Details': [
    {
      name: 'facilityName',
      label: 'Name of Facility',
      type: 'text',
      required: true,
      disabled: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      name: 'kmhflCode',
      label: 'KMHFL Code',
      disabled: true,
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Client Details': [
    {
      name: 'ancCode',
      label: 'ANC Code',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('ANC Code is required'),
    },
    {
      name: 'pncNumber',
      label: 'PNC No',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('PNC Number is required'),
    },
    {
      name: 'clientName',
      label: 'Name of Client',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Name of client is required'),
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.date().required('Date of birth is required'),
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Phone number is required'),
    },
    {
      name: 'educationLevel',
      label: 'Education Level',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: 'None', label: 'None' },
        { value: 'Primary School', label: 'Primary School' },
        { value: 'High School', label: 'High School' },
        { value: 'Undergraduate', label: 'Undergraduate' },
        { value: 'Postgraduate', label: 'Postgraduate' },
        { value: 'Tertiary', label: 'Tertiary' },
      ],
      validate: yup.string().required('Education level is required'),
    },
    {
      name: 'maritalStatus',
      label: 'Marital Status',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Divorced', label: 'Divorced' },
        { value: 'Widowed', label: 'Widowed' },
      ],
      validate: yup.string().required('Marital status is required'),
    },
  ],
  Residence: [
    {
      name: 'county',
      label: 'County',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: counties.map(county => ({
        label: county.name,
        value: county.name,
      })),
      validate: yup.string().required('County is required'),
    },
    {
      name: 'subCounty',
      label: 'Sub-County',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [],
      validate: yup.string().required('Sub-County is required'),
    },
    {
      name: 'ward',
      label: 'Ward',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [],
      validate: yup.string().required('Ward is required'),
    },
    {
      name: 'estate',
      label: 'Estate',
      type: 'text',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string(),
    },
  ],
  'Next of Kin': [
    {
      name: 'nextOfKinName',
      label: 'Next of Kin Names',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Next of kin name is required'),
    },
    {
      name: 'nextOfKinRelationship',
      label: 'Relationship',
      type: 'select',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      options: [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Parent', label: 'Parent' },
        { value: 'Sibling', label: 'Sibling' },
        { value: 'Child', label: 'Child' },
        { value: 'Friend', label: 'Friend' },
        { value: 'Other', label: 'Other' },
      ],
      validate: yup.string().required('Relationship is required'),
    },
    {
      name: 'nextOfKinPhone',
      label: 'Phone Number',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.string().required('Phone number is required'),
    },
  ],
  'Clinical Information': [
    {
      name: 'gravida',
      label: 'Gravida',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Gravida is required'),
    },
    {
      name: 'parity',
      label: 'Parity',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      // parity cannot be greater than gravida
      validate: yup.number().max(yup.ref('gravida'), 'Parity cannot be greater than gravida').required('Parity is required'),
    },
    {
      name: 'height',
      label: 'Height (cm)',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Height is required'),
    },
    {
      name: 'weight',
      label: 'Weight (kg)',
      type: 'text',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.number().required('Weight is required'),
    },
    {
      name: 'lmp',
      label: 'LMP',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      validate: yup.date().required('LMP is required'),
    },
    {
      name: 'edd',
      label: 'EDD',
      type: 'date',
      required: true,
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 4,
      },
      // validate: yup.date().required('EDD is required'),
    },
  ],
};

export default formData;

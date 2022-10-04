import * as yup from 'yup';

const referralForm = {
  'Referral Officer Details': [
    {
      label: 'Name of Referral Officer',
      name: 'referralOfficerName',
      type: 'text',
      validate: yup.string().required('Name of Referral Officer is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      label: 'Referral Officer Phone Number',
      name: 'referralOfficerPhoneNumber',
      type: 'text',
      validate: yup
        .string()
        .required('Referral Officer Phone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      label: 'Name receiving CHV',
      name: 'nameReceivingCHV',
      type: 'text',
      validate: yup.string().required('Name receiving CHV is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      label: 'Receiving CHV Phone Number',
      name: 'receivingCHVPhoneNumber',
      type: 'text',
      validate: yup.string().required('Receiving CHV Phone Number is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
    {
      label: 'Name of Community Health Unit',
      name: 'nameOfCommunityHealthUnit',
      type: 'text',
      validate: yup
        .string()
        .required('Name of Community Health Unit is required'),
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 6,
      },
    },
  ],
  'Referral Details': [
    {
      label: 'Call made by referring officer',
      name: 'callMadeByReferringOfficer',
      type: 'radio',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      validate: yup
        .string()
        .required('Call made by referring officer is required'),
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
    },
    {
      label: 'Describe the services that CHV should provide for the client',
      name: 'servicesProvided',
      type: 'textarea',
      width: {
        xs: 12,
        sm: 12,
        md: 12,
        lg: 12,
      },
      validate: yup.string().required('Services provided is required'),
    },
  ],
};

export default referralForm;

const referralForm = {
  'Referral Officer Details': [
    {
      label: 'Name of Referral Officer',
      name: 'referralOfficerName',
      type: 'text',
    },
    {
      label: 'Referral Officer Phone Number',
      name: 'referralOfficerPhoneNumber',
      type: 'text',
    },
    {
      label: 'Name receiving CHV',
      name: 'nameReceivingCHV',
      type: 'text',
    },
    {
      label: 'Receiving CHV Phone Number',
      name: 'receivingCHVPhoneNumber',
      type: 'text',
    },
    {
      label: 'Name of Community Health Unit',
      name: 'nameOfCommunityHealthUnit',
      type: 'text',
    },
  ],
  'Referral Details': [
    {
      label: 'Call made by referring officer',
      name: 'callMadeByReferringOfficer',
      type: 'radio',
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' },
      ],
    },
    {
      label: 'Describe the services that CHV should provide for the client',
      name: 'servicesProvided',
      type: 'textarea',
    },
  ],
};

export default referralForm;

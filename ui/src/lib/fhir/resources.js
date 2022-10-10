export let Patient = patient => {
  return {
    resourceType: 'Patient',
    ...(patient.id && { id: patient.id }),
    meta: {
      profile: [
        'http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-patient',
        'http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-patient',
        'http://fhir.org/guides/who/core/StructureDefinition/who-patient',
      ],
    },
    identifier: [
      {
        value: patient.id,
      },
    ],
    name: [
      {
        family: patient.names,
        given: [patient.names],
      },
    ],
    telecom: [
      {
        value: patient.phone,
      },
    ],
    birthDate: new Date(patient.dob).toISOString().slice(0, 10),
    address: [
      {
        line: [
          `${patient.county}, ${patient.subCounty}, ${patient.ward}, ${patient.estate}`,
        ],
      },
    ],
    contact: [
      {
        telecom: [
          {
            value: patient.nextOfKinPhone,
          },
        ],
        name: {
          family: patient.nextOfKinName,
        },
        relationship: [{
          text: patient.nextOfKinRelationship
        }]
      },
    ],
  };
};

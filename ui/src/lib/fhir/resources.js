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
        "value": patient.idNumber,
        "id":"NATIONAL_ID"
      },
      {
        "value":patient.ancCode,
        "id": "ANC_NUMBER"
      },
      {
        "value":patient.kmhflCode,
        "id": "KMHFL_CODE"
      }
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
        state: patient.county,
        district: patient.subCounty,
        city: patient.ward,
        village: patient.village
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

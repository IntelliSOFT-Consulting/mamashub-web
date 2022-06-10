

export let Patient = (patient) => {


return  {
  "resourceType" : "Patient",
  ...(patient.id) && {"id" : patient.id},
  "meta" : {
    "profile" : [
      "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-patient",
      "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-patient",
      "http://fhir.org/guides/who/core/StructureDefinition/who-patient"
    ]
  },
  "identifier" : [
    {
      "value" : patient.id
    }
  ],
  "name" : [
    {
      "family" : patient.lastName,
      "given" : [
        patient.firstName
      ]
    }
  ],
  "telecom" : [
    {
      "value" : patient.patientPhoneNumber,
    }
  ],
  "birthDate" : String(new Date(patient.dob).toISOString()).slice(0, 10),
  "address" : [
    {
      "line" : [
        patient.address
      ]
    }
  ],
  "contact" : [
    {
      "telecom" : [
        {
          "value" : patient.contactPhoneNumber
        }
      ]
    }
  ]
}
}





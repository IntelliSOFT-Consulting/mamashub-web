import {v4 as uuidv4} from 'uuid'

export let CreateObservation = (code=null, patientId=null, observationValue=null, id=null) => {


return  {
  "resourceType" : "Observation",
  ...(id) && {"id" : id},
  ...(!id) && {"id":uuidv4()},
//   "meta" : {
//     "profile" : [
//       "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-patient",
//       "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-patient",
//       "http://fhir.org/guides/who/core/StructureDefinition/who-patient"
//     ]
//   },
  "identifier" : [
    {
      "value" : patientId
    }
  ],
//   "name" : [
//     {
//       "family" : patient.lastName,
//       "given" : [
//         patient.firstName
//       ]
//     }
//   ],
//   "telecom" : [
//     {
//       "value" : "pgmitchv75x2e0ng"
//     }
//   ],
//   "birthDate" : new Date(patient.dob).toISOString().slice(0, 10),
//   "address" : [
//     {
//       "line" : [
//         "3vanfiig97ar0klcac"
//       ]
//     }
//   ],
//   "contact" : [
//     {
//       "telecom" : [
//         {
//           "value" : patient.phoneNumber
//         }
//       ]
//     }
//   ]
}
}





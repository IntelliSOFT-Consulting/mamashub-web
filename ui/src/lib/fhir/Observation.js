import { v4 as uuidv4 } from 'uuid'

export let CreateObservationValue = (value, type, unit, code, system = "http://unitsofmeasure.org") => {
  // if (!value || !unit || !code) {
  //   throw Error("value, unit and code are required to create an observation")
  // }
  return {
    value, unit, code, system, type
  }
}

export let CreateObservation = (code = null, patientId = null, observationValue = null, id = null, encounterId = null) => {

  let value = observationValue


  return {
    "resourceType": "Observation",
    ...(id) && { "id": id },
    ...(!id) && { "id": uuidv4() },
    status: "final",
    code: {
      coding: [
        {
          "system": (code.system === "snomed") ? "http://snomed.info/sct" : (code.system === "loinc") ? "http://loinc.org" : "http://example.com",
          "code": code.code,
          "display": code.display
        }
      ]
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    encounter: {
      reference: `Encounter/${encounterId}`
    },
    effectiveDateTime: new Date().toLocaleString(),
    issued: new Date().toLocaleString(),
    ...(value.type === "Boolean") && { valueBoolean: value.value },
    ...(value.type !== "Boolean") && { valueQuantity: value.value },
    meta: {
      "profile": [
        "http://fhir.org/guides/who/core/StructureDefinition/who-observation",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-observation",
        "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-b4-de1"
      ]
    },
  }
}





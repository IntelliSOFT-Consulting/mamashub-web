import fetch from 'cross-fetch'
import { v4 as uuidv4 } from 'uuid'

export let createObservationValue = (value: any, type: any, unit: any, code: any, system = "http://unitsofmeasure.org") => {
    // if (!value || !unit || !code) {
    //   throw Error("value, unit and code are required to create an observation")
    // }
    return {
        value, unit, code, system, type
    }
}

export let createObservation = (code: any, patientId: string, observationValue: any, id: string, encounterId: string) => {

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



export let createEncounter = (patientId: string, encounterId: string, encounterType: number) => {


    return {
        resourceType: "Encounter",
        id: encounterId,
        reference: {
            "patient": `Patient/${patientId}`
        },
        "meta": {
            "profile": [
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-encounter",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-base-encounter",
                "http://fhir.org/guides/who/core/StructureDefinition/who-encounter"
            ]
        },
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"anc-encounter-example\" </p><p style=\"margin-bottom: 0px\">Profiles: <a href=\"StructureDefinition-anc-encounter.html\">ANC Encounter</a>, <a href=\"StructureDefinition-anc-base-encounter.html\">ANC Base Encounter</a>, <a href=\"StructureDefinition-who-encounter.html\">WHO Encounter</a></p></div><p><b>identifier</b>: id: anc-encounter-example (OFFICIAL)</p><p><b>subject</b>: <a href=\"Patient-anc-patient-example.html\">Patient/anc-patient-example</a> \" UJM2JA8IGHP1A\"</p><p><b>period</b>: 2020-12-07 06:24:03-0700 --&gt; 2021-09-07 02:24:12-0600</p><p><b>reasonCode</b>: Specific complaint related to antenatal care <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"CodeSystem-anc-custom-codes.html\">Extended Codes CodeSystem</a>#ANC.B5.DE4; <a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#118189007 \"Prenatal finding (finding)\"; <a href=\"https://loinc.org/\">LOINC</a>#52454-6 \"Reason for assessment??Note: There are multiple codes in LOINC with same name ?57200-8 Reason for assessment [CMS Assessment] ?46502-1 Reason for assessment [OASIS]\")</span></p><h3>Locations</h3><table class=\"grid\"><tr><td>-</td><td><b>Location</b></td></tr><tr><td>*</td><td><a href=\"Location-anc-location-example.html\">Location/anc-location-example</a> \"123\"</td></tr></table></div>"
        },
        "identifier": [
            {
                "use": "official",
                "system": "http://example.org/fhir/NamingSystem/identifiers",
                "value": encounterId
            }
        ],
        "subject": {
            "reference": `Patient/${patientId}`
        },
        "period": {
            "start": new Date().toLocaleString(),
            "end": new Date().toLocaleString()
        },
        "reasonCode": [
            {
                "coding": [
                    (encounterType === 1) ? {
                        "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                        "code": "ANC.B5.DE2",
                        "display": "First antenatal care contact"
                    } : (encounterType === 2) ?
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": "ANC.B5.DE3",
                            "display": "Scheduled antenatal care contact"
                        } :
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": "ANC.B5.DE4",
                            "display": "Specific complaint related to antenatal care"
                        }
                ]
            }
        ],
        // "location": [
        //     {
        //         "location": {
        //             "reference": "Location/anc-location-example"
        //         }
        //     }
        // ]
    }
}



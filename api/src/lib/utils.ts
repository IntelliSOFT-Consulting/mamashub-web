import fetch from 'cross-fetch'
import { v4 as uuidv4 } from 'uuid'
import { reports } from './allReports.json'
import { getPatients } from './reports'

export const createObservationValue = (value: number, unit: any) => {
    return { value, unit, system: "http://unitsofmeasure.org" }
}

export const createObservation = (patientId: string, observationValue: any, coding: any, id: string, encounterId: string) => {
    return {
        "resourceType": "Observation",
        ...(id) && { "id": id },
        ...(!id) && { "id": uuidv4() },
        status: "final",
        code: {
            coding: [
                {
                    "system": (coding.system === "snomed") ? "http://snomed.info/sct" : (coding.system === "loinc") ? "http://loinc.org" : "http://intellisoftkenya.com",
                    "code": coding.code,
                    "display": coding.display
                }
            ]
        },
        subject: { reference: `Patient/${patientId}` },
        encounter: { reference: `Encounter/${encounterId}` },
        ...observationValue,
        effectiveDateTime: new Date().toISOString(),
        issued: new Date().toISOString(),
        meta: {
            "profile": [
                "http://fhir.org/guides/who/core/StructureDefinition/who-observation",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-observation",
                "http://fhir.org/guides/who/anc-cds/StructureDefinition/anc-b4-de1"
            ]
        },
    }
}


export const createEncounter = (patientId: string, encounterId: string, encounterType: number = 2, encounterCode: string | null = null) => {
    if (encounterType > 3 || encounterType < 1) {
        console.error("Encounter type is either 1, 2 or 3")
        return
    }
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
            "start": new Date().toISOString(),
            "end": new Date().toISOString()
        },
        "reasonCode": [
            {
                "coding": [
                    (encounterType === 1) ? {
                        "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                        "code": encounterCode,
                        "display": "First antenatal care contact"
                    } : (encounterType === 2) ?
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": encounterCode,
                            "display": "Scheduled antenatal care contact"
                        } :
                        {
                            "system": "http://fhir.org/guides/who/anc-cds/CodeSystem/anc-custom-codes",
                            "code": encounterCode,
                            "display": "Specific complaint related to antenatal care"
                        }
                ]
            }
        ]
    }
}



// create location resources
export let registerFacility = async () => {
    return 8
}


export let apiHost = process.env.FHIR_BASE_URL

export const FhirApi = async (params: any) => {
    let _defaultHeaders = { "Content-Type": 'application/json' }
    if (!params.method) {
        params.method = 'GET';
    }
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET' && params.method !== 'DELETE') && { body: String(params.data) }
        });
        let responseJSON = await response.json();
        let res = {
            status: "success",
            statusText: response.statusText,
            data: responseJSON
        };
        return res;
    } catch (error) {
        console.error(error);
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            data: error
        };
        console.error(error);
        return res;
    }
}

export const generateReport = async (name: any) => {
    const reportName = name as keyof typeof reports
    let report = reports[reportName]
    // console.log(report)
    let data = await FhirApi({ url: report.q });
    if (data.status === 'success') {
        // console.log(data.data[report.query])
        if (report.query !== "entry") {
            return parseFloat(((data.data[report.query]) || 0).toString());
        }
        else {
            return (data.data[report.query] || []);
        }
    }
    return parseFloat("0.0")
}



export let clearEncounters = async (patient: string | null, code: string | null = null) => {

    let _encounters = (await FhirApi({ url: `/Encounter?${(patient && code) ? `patient=${patient}&reason-code=${code}` : code ? `reason-code=${code}` : patient ? `patient=${patient}` : ''}` })).data
    let encounters: any = _encounters.entry ?? []
    console.log(_encounters)
    for (let encounter of encounters) {
        console.log(encounter.resource.id)
        let res = await (await FhirApi({ url: `/Encounter/${encounter.resource.id} `, method: "DELETE" })).data
        console.log(res)

    }
}


export let clearObservations = async (patient: string | null, code: string | null = null) => {

    let _observations = (await FhirApi({ url: `/Observation?${(patient && code) ? `patient=${patient}&code=${code}` : code ? `code=${code}` : patient ? `patient=${patient}` : ''} ` })).data
    let observations: any = _observations.entry ?? [];
    console.log(_observations);
    for (let observation of observations) {
        console.log(observation)
        let res = await FhirApi({ url: `/Observation/${observation.resource.id}`, method: "DELETE" });
    }
}


export const getPatientByIdentifier = async (ancNumber: string | null = null, idNumber: string | null = null) => {
    try {
        let res = await (await FhirApi({ url: `/Patient?identifier=${idNumber ?? ancNumber}` })).data;
        console.log(res)
        return res.entry[0].resource || null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getObservationsWhere = async (observationCode: string, value: any | null, facility: string | null = null) => {
    try {
        let observations = [];
        let patients = await getPatients(undefined, undefined, facility);
        for (let patient of patients) {
            let res = await (await FhirApi({ url: `/Observation?patient=${patient.id}&code=${observationCode}${value && `&value-string=${value}`}` })).data
            if (res.entry) {
                observations.push(res);
            }
        }
        return observations;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const countObservationsWhere = async (observationCode: string, value: any | null = null, facility: string | null = null) => {
    try {
        let res = await getObservationsWhere(observationCode, value, facility);
        if (res) {
            return res.length;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


export const getEncountersWhere = async (encounterCode: string, value: any, patient: string | null, facility: string | null = null) => {
    try {
        let encounters = [];
        let res = await (await FhirApi({ url: `/Encounter?reason-code=${encounterCode}` })).data
        return res.entry ? res.entry : [];
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const countEncountersWhere = async (observationCode: string, value: any, patient: string | null, facility: string | null = null) => {
    try {
        let res = await getEncountersWhere(observationCode, value, patient, facility);
        if (res) {
            return res.length;
        }
        return 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
}


export const getObservationFromEncounter = async (patient: String, encounterCode: String, observationCode: String) => {
    try {
        let res = await (await FhirApi({ url: `/Observation?code=${observationCode}${encounterCode && `&encounter=${encounterCode}`}` })).data
        return res.entry ? res.entry : [];
    } catch (error) {
        console.error(error);
        return null;
    }
}


export const countUniquePatients = async (resources: Array<any>, list: Boolean = false) => {
    let patients = [];
    for (let resource of resources) {
        patients.push(resource.resource.subject.reference);
    }
    let unique = [...new Set(patients)];
    return list ? unique : unique.length;
}



export let Patient = (patient: any) => {
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
                "id": "NATIONAL_ID"
            },
            {
                "value": patient.ancCode,
                "id": "ANC_NUMBER"
            },
            {
                "value": patient.kmhflCode,
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

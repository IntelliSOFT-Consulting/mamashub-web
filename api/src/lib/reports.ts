import db from './prisma'
import { FhirApi, generateReport } from './fhir/utils'
import * as observationCodes from './fhir/observationCode.json'

const codes: any = observationCodes.codes

let getNoOfAncVisits = async (patientId: string) => {
    let visits = []
    let encounters = await (await FhirApi({ url: `/Encounter?patient=${patientId}&_limit=99999` })).data
    encounters = encounters?.entry ?? []

    for (let encounter of encounters) {
        visits.push(new Date(encounter.resource.meta.lastUpdated).toDateString())
    }
    let unique = [...new Set(visits)]
    return unique.length
}


export let generateGeneralReport = async (patientId: string) => {

    let results: { [index: string]: any } = {}

    let observations = await (await FhirApi({ url: `/Observation?patient=${patientId}&_count=99999` })).data
    observations = observations?.entry ?? []
    let patient = await (await FhirApi({ url: `/Patient/${patientId}` })).data
    for (let observation of observations) {
        for (let code of Object.keys(codes)) {
            console.log(observation.resource.code.coding[0].code, String(codes[code]).split(":")[1])
            if (observation.resource.code.coding[0].code === String(codes[code]).split(":")[1]) {
                results[code] = observation.resource.valueQuantity ? observation.resource.valueQuantity.value : (observation.resource.valueString ?? observation.resource.valueDateTime ?? "-")
            }
        }
    }
    console.log(results)

    let report = {
        ancNumber: patient.identifier ? patient.identifier[0].value : " - ",
        id: patient.id,
        noOfAncVisits: await getNoOfAncVisits(patientId),
        fullNames: (patient.name[0].family),
        dob: new Date(patient.birthDate).toDateString(),
        subCounty: (patient.address ? patient.address[0].district : " - ") || " - ",
        county: (patient.address ? patient.address[0].state : " - ") || " - ",
        village: (patient.address ? patient.address[0].city : " - ") || " - ",
        estate: (patient.address ? patient.address[0].text : " - ") || " - ",
        tel: patient.telecom ? patient.telecom[0].value : "-" ?? "-",
        maritalStatus: patient.maritalStatus.text ?? "-",
        parity: "",
        gravidae: "",
        lmp: "",
        edd: "",
        gestation: "",
        muacCodes: "",
        height: " - ",
        fgm: " - ",
        haemoglobin: "",
        bloodSugar: "",
        'bloodGroupAndRhesus': "",
        'urynalysis': "",
        'dualTesting': "",
        'testResults': "",
        'treated': "",
        'hivStatusBeforeANC': "",
        'hivTesting': "",
        'hivTesting1': "",
        'hivTesting2': "",
        'hivResults': "",
        'artEligibility': "",
        'maternalHaartBeforeANC': "",
        'maternalHaartCTX': "",
        'infantProphylaxis': "",
        'partnerHIVTesting': "",
        'partnerHIVResults': "",
        'ppfpCounselling': "",
        'otherConditions': "",
        'deworming': "",
        'ipt': "",
        'ttDose': "",
        'supplimentation': "",
        'receivedLLITN': "",
        'referralsFrom': "",
        'referralsTo': "",
        'reasonsForReferral': "",
        'remarks': ""
    }

    return { ...report, ...results }

}

// let d = generateGeneralReport("fee27216-cdef-4a80-93c4-80a04d2adaef").then(res=>{
//     console.log(res)
// })
// console.log(d)
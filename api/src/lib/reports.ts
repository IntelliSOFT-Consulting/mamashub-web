import { FhirApi, generateReport } from "./fhir/utils"
import * as observationCodes from "./fhir/observationCode.json"

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

    let reportFields = [
        'parity', 'gravidae',
        'lmp', 'edd',
        'gestation', 'muacCodes',
        'height', 'fgm',
        'haemoglobin', 'bloodSugar',
        'bloodGroupAndRhesus', 'urynalysis',
        'dualTesting', 'testResults',
        'treated', 'hivStatusBeforeANC',
        'hivTesting', 'hivResults',
        'artEligibility', 'maternalHaartBeforeANC',
        'maternalHaartCTX', 'infantProphylaxis',
        'partnerHIVTesting', 'partnerHIVResults',
        'ppfpCounselling', 'otherConditions',
        'deworming', 'ipt',
        'ttDose', 'supplimentation',
        'receivedLLITN', 'referralsFrom',
        'referralsTo', 'reasonsForReferral',
        'remarks'
    ]
    let results: { [index: string]: any } = {}
    let _codes = Object.keys(codes).map((code) => {
        if (reportFields.indexOf(code) > -1) {
            return String(codes[code]).split(":")[1];
        }
    })
    let observations = await (await FhirApi({ url: `/Observation?patient=${patientId}&code=${_codes.join()}&_count=99999` })).data
    observations = observations?.entry ?? []
    // console.log(observations)
    let patient = await (await FhirApi({ url: `/Patient/${patientId}` })).data

    for (let observation of observations) {
        for (let code of Object.keys(codes)) {
            if (reportFields.indexOf(code) > -1) {
                // console.log(code, observation.resource.code.coding[0].code, String(codes[code]).split(":")[1])
                if (observation.resource.code.coding[0].code === String(codes[code]).split(":")[1]) {
                    results[code] = observation.resource.valueQuantity ? observation.resource.valueQuantity.value : (observation.resource.valueString ?? observation.resource.valueDateTime ?? "-")
                }
            }
        }
    }
    console.log((patient.name[0].family), results)

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
        maritalStatus: patient.maritalStatus ? patient.maritalStatus.text : "-",
    }
    return { ...report, ...results }
}

// let d = generateGeneralReport("fee27216-cdef-4a80-93c4-80a04d2adaef").then(res=>{
//     console.log(res)
// })
// console.log(d)


let getPatientCountByCode = async (code: string) => {
    let data = await (await FhirApi({ url: `/Observation?code=${code}` })).data;
    return data.total || data.entry.length || 0;
}

export let generateMOH711Report = async () => {

    return {
        "newAncClients": await getPatientCountByCode("74935093"),
        "revisitAncClients": await getPatientCountByCode("74935093"),
        "iptDose1": await getPatientCountByCode("74935093"),
        "iptDose2": await getPatientCountByCode("784030374-Y"),
        "iptDose3": await getPatientCountByCode("784030374-Y"),
        "hb": await getPatientCountByCode("128241005-R"),
        "completed4ANCVisits": await getPatientCountByCode("74935093"),
        "LLINSUnder1Year": await getPatientCountByCode("784030374-Y"),
        "LLINSToAncClients": await getPatientCountByCode("784030374-Y"),
        "testedForSyphylis": await getPatientCountByCode("74935093"),
        "hivPositive": await getPatientCountByCode("74935093"),
        "doneBreastExamination": await getPatientCountByCode("74935093"),
        "10-14": await getPatientCountByCode("74935093"),
        "15-19": await getPatientCountByCode("74935093"),
        "20-24": await getPatientCountByCode("74935093"),
        "pregnancyAtFirstAnc": await getPatientCountByCode("74935093"),
        "issuedWithIron": await getPatientCountByCode("74935093"),
        "issuedWithFolic": await getPatientCountByCode("74935093"),
        "issuedWithCombinedFF": await getPatientCountByCode("74935093"),
        "FGMAssociatedComplication": await getPatientCountByCode("74935093"),
        "totalScreened": await getPatientCountByCode("74935093"),
        "presumptiveTBCases": await getPatientCountByCode("74935093"),
        "alreadyOnTB": await getPatientCountByCode("74935093"),
        "totalNotScreened": await getPatientCountByCode("74935093")
    }
}
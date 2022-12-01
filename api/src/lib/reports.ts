import { FhirApi, generateReport, getObservationsWhere, countObservationsWhere, countUniquePatients } from "./utils"
import * as observationCodes from "./observationCodes.json"


const codes: any = observationCodes.codes;

let getNoOfAncVisits = async (patientId: string) => {
    let visits = [];
    let encounters = await (await FhirApi({ url: `/Encounter?patient=${patientId}&_limit=99999` })).data
    encounters = encounters?.entry ?? []

    for (let encounter of encounters) {
        visits.push(new Date(encounter.resource.meta.lastUpdated).toDateString())
    }
    let unique = [...new Set(visits)];
    return unique.length;
}

export let generateMOH405Report = async (patientId: string, from: string | null, to: string | null) => {

    let fromDate = from ? new Date(from) : new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0))
    let toDate = to ? new Date(to) : new Date();
    let _toDate = `${toDate.getFullYear()}-${toDate.getMonth()}-${toDate.getDate()}`
    let _fromDate = `${fromDate.getFullYear()}-${fromDate.getMonth()}-${fromDate.getDate()}`
    let reportFields = [
        'parity', 'gravidae', 'lmp', 'edd',
        'gestation', 'muacCodes', 'height', 'fgm', 'haemoglobin', 'bloodSugar',
        'bloodGroupAndRhesus', 'urynalysis', 'dualTesting', 'testResults',
        'treated', 'hivStatusBeforeANC', 'hivTesting', 'hivResults',
        'artEligibility', 'maternalHaartBeforeANC', 'maternalHaartCTX', 'infantProphylaxis',
        'partnerHIVTesting', 'partnerHIVResults', 'ppfpCounselling', 'otherConditions', 'deworming', 'ipt',
        'ttDose', 'supplimentation', 'receivedLLITN', 'referralsFrom',
        'referralsTo', 'reasonsForReferral', 'remarks'
    ];
    let results: { [index: string]: any } = {}
    let _codes = Object.keys(codes).map((code) => {
        if (reportFields.indexOf(code) > -1) {
            return String(codes[code]).split(":")[1];
        }
    })
    let observations = await (await FhirApi({ url: `/Observation?patient=${patientId}&code=${_codes.join()}&_count=99999&_updatedAt=ge${_fromDate}&_updatedAt=le${_toDate}` })).data
    observations = observations?.entry ?? [];
    // console.log(observations)
    let patient = await (await FhirApi({ url: `/Patient/${patientId}` })).data;

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

    let report = {
        ancNumber: patient.identifier ? patient.identifier[0].value : " - ",
        id: patient.id,
        noOfAncVisits: await getNoOfAncVisits(patientId),
        fullNames: (patient.name ? patient.name[0].family : " ") || " ",
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


let noOfPatients = async (from: Date = new Date(), to: Date = new Date()) => {
    let data = await (await FhirApi({ url: `/Patient` })).data;
    return data.total || (data.entry ? data.entry.length : 0)
}


let countUniqueObservations = async (code: string, value: any | null = null) => {
    let list = await getObservationsWhere(code, value)
    return countUniquePatients(list)
}


let noOfANCRevisits = async (from: Date = new Date(), to: Date = new Date()) => {
    let data = await (await FhirApi({ url: `/Patient` })).data;
    return data.total || (data.entry ? data.entry.length : 0)
}

let getPatientCountByCode = async (code: string) => {
    let data = await (await FhirApi({ url: `/Observation?code=${code}` })).data;
    return data.total || (data.entry ? data.entry.length : 0)
}

let aggregateByCode = async (code: string) => {
    let data = await (await FhirApi({ url: `/Observation?code=${code}` })).data;
    return data.total || (data.entry ? data.entry.length : 0)
}

export let generateMOH711Report = async () => {

    return {
        "newAncClients": await await noOfPatients(),
        "revisitAncClients": await getPatientCountByCode("74935093"),
        "iptDose1": await countObservationsWhere("520474952"),
        "iptDose2": await countObservationsWhere("520474952"),
        "iptDose3": await countObservationsWhere("520474952"),
        "hb": await countObservationsWhere("128241005-R"),
        "completed4ANCVisits": await getPatientCountByCode("74935093"),
        "LLINSUnder1Year": await countObservationsWhere("412894909", "Yes"),
        "LLINSToAncClients": await countObservationsWhere("412894909", "Yes"),
        "testedForSyphylis": await countObservationsWhere("76272004-Y"),
        "hivPositive": await getPatientCountByCode("31676001-Y"),
        "doneBreastExamination": await getPatientCountByCode("185712006"),
        "10-14": await getPatientCountByCode("74935093"),
        "15-19": await getPatientCountByCode("74935093"),
        "20-24": await getPatientCountByCode("74935093"),
        "pregnancyAtFirstAnc": await getPatientCountByCode("74935093"),
        "issuedWithIron": await getPatientCountByCode("6709950"),
        "issuedWithFolic": await getPatientCountByCode("74935093"),
        "issuedWithCombinedFF": await getPatientCountByCode("74935093"),
        "FGMAssociatedComplication": await getPatientCountByCode("95041000119101-C"),
        "totalScreened": await getPatientCountByCode("74935093"),
        "presumptiveTBCases": await getPatientCountByCode("74935093"),
        "alreadyOnTB": await getPatientCountByCode("74935093"),
        "totalNotScreened": await getPatientCountByCode("74935093")
    }
}



export const generateANCSummary = async () => {
    return {
        "No. of ANC Clients": await noOfPatients(),
        "No. of ANC Revisits": await getPatientCountByCode("74935093"),
        "Women with FGM Complications": await countObservationsWhere("95041000119101-C"),
        "Women positive for Syphyllis": await countObservationsWhere("76272004"),
        "Women who are HIV Positive": await getPatientCountByCode("31676001-Y"),
        "Women who have TB": await getPatientCountByCode("371569005"),
        "Women who have received LLITN": await countObservationsWhere("412894909", "Yes")
    }
}
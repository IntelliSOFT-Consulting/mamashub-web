import { FhirApi, generateReport, getObservationsWhere, countObservationsWhere, countUniquePatients, getAllPatientsObservations, getAllPatientsObservationsMapped, parseFhirPatient } from "./utils"
import * as observationCodes from "./observationCodes.json"
import { indexedCodes, codes } from './utils'

let getNoOfAncVisits = async (patientId: string) => {
    let visits = [];
    let encounters = await (await FhirApi({ url: `/Encounter?patient=${patientId}&_limit=100000` })).data
    encounters = encounters?.entry ?? []

    for (let encounter of encounters) {
        visits.push(new Date(encounter.resource.meta.lastUpdated).toDateString())
    }
    let unique = [...new Set(visits)];
    return unique.length;
}

export let generateMOH405Report = async (kmhflCode: string, from: Date | null, to: Date | null) => {
    let patientIds: any = [];
    let _observations: any = [];
    let report: any = [];
    let patients = await (await FhirApi({ url: `/Patient${kmhflCode && `?identifier=${kmhflCode}`}` })).data?.entry || [];
    patients.map((patient: any) => {
        patientIds.push(patient.resource.id);
    })

    for (let patient of patientIds) {
        let observations = await getAllPatientsObservationsMapped(patient, from, to)
        let _patient = await (await FhirApi({ url: `/Patient/${patient}` })).data
        let demographics = parseFhirPatient(_patient)
        _observations.push({ ...observations, ...demographics, noOfANCVisits: await getNoOfAncVisits(patient) })
    }

    let reportFields = [
        'ancNumber', 'id', 'fullNames', 'dob', 'noOfANCVisits', 'subCounty', 'village', 'estate', 'phone', 'maritalStatus',
        'county', 'parity', 'gravidae', 'lmp', 'edd',
        'gestation', 'muacCodes', 'height', 'fgm', 'haemoglobin', 'bloodSugar',
        'bloodGroupAndRhesus', 'urynalysis', 'dualTesting', 'testResults',
        'treated', 'hivStatusBeforeANC', 'hivTesting', 'hivResults',
        'artEligibility', 'maternalHaartBeforeANC', 'maternalHaartCTX', 'infantProphylaxis',
        'partnerHIVTesting', 'partnerHIVResults', 'ppfpCounselling', 'otherConditions', 'deworming', 'ipt',
        'ttDose', 'supplimentation', 'receivedLLITN', 'referralsFrom',
        'referralsTo', 'reasonsForReferral', 'remarks'
    ];

    for (let observation of _observations) {
        let _res: any = {}
        for (let k of reportFields) {
            console.log(k)
            if (Object.keys(observation).indexOf(k) > -1) {
                _res[k] = observation[k];
            } else {
                _res[k] = "-"
            }
        }
        report.push(_res);
    }
    return { report }
}


let noOfPatients = async (from: Date = new Date(), to: Date = new Date(), facilityKmhflCode: string | null = null) => {
    let data = await getPatients(undefined, undefined, facilityKmhflCode)
    return data.length;
}

export let getPatients = async (from: Date = new Date(), to: Date = new Date(), facilityKmhflCode: string | null = null) => {
    let data;
    if (facilityKmhflCode) {
        data = await (await FhirApi({ url: `/Patient${facilityKmhflCode && `?identifier=${facilityKmhflCode}`}` })).data;
    } else {
        data = await (await FhirApi({ url: `/Patient` })).data;
    }
    return data.entry ? data.entry : [];
}



let countUniqueObservations = async (code: string, value: any | null = null) => {
    let list = await getObservationsWhere(code, value)
    return countUniquePatients(list)
}


let noOfANCRevisits = async (from: Date = new Date(), to: Date = new Date(), facility: string | null | undefined = undefined) => {
    let patients = await getPatients(undefined, undefined, facility)
    for (let patient of patients) {
        let encounters = await (await FhirApi({ url: `/Encounter?patient=${patient.resource.id}&_limit=99999` })).data;
        encounters = encounters?.entry ?? []
        let visits = [];
        for (let encounter of encounters) {
            visits.push(new Date(encounter.resource.meta.lastUpdated).toDateString())
        }
        let unique = [...new Set(visits)];
        return unique.length;
    }
}

let getPatientCountByCode = async (code: string, facility: string | null = null) => {
    let patients = await getPatients(undefined, undefined, facility);
    let count = 0;
    for (let patient of patients) {
        let data = await (await FhirApi({ url: `/Observation?code=${code}&patient=${patient.resource.id}` })).data;
        if (data.entry) {
            count++;
        }
    }
    return count;
}


let aggregateByCode = async (code: string) => {
    let data = await (await FhirApi({ url: `/Observation?code=${code}` })).data;
    return data.total || (data.entry ? data.entry.length : 0)
}

export let generateMOH711Report = async (facility: string | null | undefined = undefined, from: string, to: string) => {

    return {
        "newAncClients": await noOfPatients(undefined, undefined, facility),
        "revisitAncClients": await getPatientCountByCode("74935093", facility),
        "iptDose1": await countObservationsWhere("520474952", facility),
        "iptDose2": await countObservationsWhere("520474952", facility),
        "iptDose3": await countObservationsWhere("520474952", facility),
        "hb": await countObservationsWhere("128241005-R", facility),
        "completed4ANCVisits": await getPatientCountByCode("74935093", facility),
        "LLINSUnder1Year": await countObservationsWhere("412894909", "Yes", facility),
        "LLINSToAncClients": await countObservationsWhere("412894909", "Yes", facility),
        "testedForSyphylis": await countObservationsWhere("76272004-Y", facility),
        "hivPositive": await getPatientCountByCode("31676001-Y", facility),
        "doneBreastExamination": await getPatientCountByCode("185712006", facility),
        "10-14": await getPatientCountByCode("74935093", facility),
        "15-19": await getPatientCountByCode("74935093", facility),
        "20-24": await getPatientCountByCode("74935093", facility),
        "pregnancyAtFirstAnc": await getPatientCountByCode("74935093", facility),
        "issuedWithIron": await getPatientCountByCode("6709950", facility),
        "issuedWithFolic": await getPatientCountByCode("74935093", facility),
        "issuedWithCombinedFF": await getPatientCountByCode("74935093"),
        "FGMAssociatedComplication": await getPatientCountByCode("95041000119101-C"),
        "totalScreened": await getPatientCountByCode("74935093"),
        "presumptiveTBCases": await getPatientCountByCode("74935093"),
        "alreadyOnTB": await getPatientCountByCode("74935093"),
        "totalNotScreened": await getPatientCountByCode("74935093")
    }
}


export const generateANCSummary = async (facility: string) => {
    return {
        "No. of ANC Clients": await noOfPatients(undefined, undefined, facility),
        "No. of ANC Revisits": await getPatientCountByCode("74935093", facility),
        "Women with FGM Complications": await countObservationsWhere("95041000119101-C", facility),
        "Women positive for Syphyllis": await countObservationsWhere("76272004", facility),
        "Women who are HIV Positive": await getPatientCountByCode("31676001-Y", facility),
        "Women who have TB": await getPatientCountByCode("371569005", facility),
        "Women who have received LLITN": await countObservationsWhere("412894909", "Yes", facility)
    }
}

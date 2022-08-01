
import { FhirApi } from './api'
import { timeSince } from './timeSince'

let getPatientDetails = async (id) => {

    let data = await FhirApi({
        url: `/fhir/Patient/${id}`, method: 'GET',
    })

    // console.log(data)
    if (data.status !== "error") {
        return data
    }
    else {
        return null
    }
}

export let startVisit = async (patientId) => {
    try {
        let patient = await getPatientDetails(patientId)
        // console.log(patient)
        let name = (patient.data.name[0].family || '')
        let id = patient.data.id
        let age = timeSince(new Date(patient.data.birthDate))
        window.localStorage.setItem("currentPatient", JSON.stringify({ name, id, age }))
        setTimeout(() => {
            window.location.href = "/patient-profile"
        }, 1500);
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}


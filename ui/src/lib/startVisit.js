
import { FhirApi } from './api'
import { timeSince } from './timeSince'

let getPatientDetails = async (id) => {
    let data = await FhirApi({
        url: `/crud/patients/${id}`, method: 'GET',
    });

    if (data.status !== "error") {
        data = data.data;
        return data;
    }
    else {
        return null;
    }
}

export let startVisit = async (patientId) => {
    try {
        let patient = await getPatientDetails(patientId)
        patient = patient.patient;
        console.log(patient);
        let name = (patient.surname);
        let id = patient.id;
        let age = timeSince(new Date(patient.dob));
        window.localStorage.setItem("currentPatient", JSON.stringify({ name, id, age }));
        window.location.href = '/antenatal-profile';
        return true;
    } catch (error) {
        console.log(error);
        return false
    }
}


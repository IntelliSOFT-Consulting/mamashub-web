// import {FHIRClient} from "@js-fhir/client";

// export let fhirClient = new FHIRClient(process.env['FHIR_BASE_URL'] as string)
import fetch from 'cross-fetch'
import {uuid} from 'uuidv4'

let ANCPatient = {

} 

// let ANCSuspectedCondition = {

// }

// let ANC
let baseQuestionnnaireResponseResource = {
    resourceType:"QuestionnaireResponse"
}

let submitQuestionnaire = async (questionnaireId: string, data: any) => {

    let resource = {...baseQuestionnnaireResponseResource, id: uuid(), items: data.answers }

    let request  = await fetch(`/fhir/QuestionnnaireResponse/${questionnaireId}`, {
        headers:{"Content-Type":"application/fhir+json;charset=utf-8"},
        method:"PUT",
        body: JSON.stringify(resource)
    })
    let response = await request.json()
    console.log(response)
    return response

}


let extract = (resource: any, attribute: string) => {
    return resource[attribute]
}
export let CreateEncounter = async (patientId, encounterId ) => {


    return {
        resourceType:"Encounter",
        id: encounterId,
        reference:{
            "patient":`Patient/${patientId}`
        },
        

        

    }
}
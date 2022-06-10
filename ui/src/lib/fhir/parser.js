
import observationCodes from  './observationCodes.json'

let loincRegex = RegExp('')
let snomedRegex = RegExp('')


export let parse = async (obj) => {

    for(let i in obj){
        console.log(String(obj[i]).split(':'))
    }


    return {

    }
}

parse(observationCodes)


import {getCookie} from './cookie';

export let apiHost = (process.env['REACT_APP_NODE_ENV'] === "dev") ? process.env['REACT_APP_API_URL'] : 'https://devmhis.netlify.app/api';

export let FhirApi = async (params) => {
    let _defaultHeaders = {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${getCookie("token")}`,
    }
    //To-do: replace with basicAuth configuration
    try {
        let response = await fetch(String(`${apiHost}${params.url}`), {
            headers: _defaultHeaders,
            method: params.method ? String(params.method) : 'GET',
            ...(params.method !== 'GET') && (params.method !== 'DELETE') && { body: String(params.data) }
        })
        let responseJSON = await response.json()
        let res = {
                status: "success",
                statusText: response.statusText,
                data: responseJSON
        }
        return res
    } catch (error) {
        console.error(error)
        let res = {
            statusText: "FHIRFetch: server error",
            status: "error",
            error: error
        }
        console.error(error)
        return res

    }

    //To-do: process response and response type
}

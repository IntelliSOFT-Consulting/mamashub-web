import mailjet from 'node-mailjet'

let maijetClient = mailjet.connect(process.env['MAILJET_API_KEY'] as string, process.env['MAILJET_API_SECRET'] as string )



export async function sendEmail(data: {subject: string, to: {email:string, name: string}, from: {name:string, email: string}, body: string, html: string}){

    let response = await maijetClient.post("send", {'version':'v3.1'}).request({
        "Messages":[
            {
                "From":{
                    "Email": data.from.email,
                    "Name": data.from.name
                },
                "To":[{
                    "Email":data.to.email,
                    "Name":data.to.name
                }],
                "Subject": data.subject,
                "TextPart":data.body,
                "HTMLPart": data.html
            }
        ]
    })
    return response

}


export let sendPasswordResetEmail = async (user:any, resetLink:string) => {

    try {
        let response = await sendEmail({
            subject: "Human Milk Bank Password Request",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Human Milk Bank",
                email: "railamolo@gmail.com"
            },
            body: `Dear ${user.names[0]},\n\n\nUse the link below to reset your password \n\n${resetLink}`,
            html: `<h4>Dear ${user.names[0]},<h4><br/>
            <h5>Use the link below to reset your password<h5/><br/>
            <a href=${resetLink}><button style="background-color:#115987;border: none;padding: 15px 32px;">Reset Link<button></a>
            <br/><br/>
            <a href=${"https://human-milk-bank.netlify.app"}>Human Milk Bank Website</a>
            `
        })
        return response
    } catch (error) {
        console.error(error)
        return error
    }
}
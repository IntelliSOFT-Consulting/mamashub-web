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
            subject: "Human Milk Bank Password Reset",
            to:{
                email:user.email as string,
                name: user.names as string
            },
            from:{
                name: "Human Milk Bank",
                email: "railamolo@gmail.com"
            },
            body: `Dear ${user.username},\n\n\nUse the link below to reset your password \n\n${resetLink}`,
            html: `
            <a href=${"https://human-milk-bank.netlify.app"}><button style="background-color: #115987;border: none;padding: 15px 32px;color: white;width: 400px;font-weight: bold;">HUMAN MILK BANK</button></a>
            
            <br/>
            <p>Dear ${user.username},<p>
            <h3>Click on the button or link below to reset your password<h3/>
            <a href=${resetLink}><button style="background-color:#115987;border: none;padding: 15px 32px;">Click Here</button></a>
            <br/><br/>
            <a href=${resetLink}>Reset Link</a>
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
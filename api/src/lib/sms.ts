import { Client } from 'africastalking-ts'
import db from './prisma'



export const sendSMS = async (phone: string, message: string) => {
    try {
        const client = new Client({
            apiKey: process.env['ATK_API_KEY'] || '', // you can get this from the dashboard: https://account.africastalking.com
            username: process.env['ATK_USERNAME'] || 'sandbox',
        });
        const response = await client.sendSms({
            to: [phone],
            message: message,
            from: process.env['ATK_SENDER'] || undefined
        })
        console.log(response);
        return { status: "success", message: response }
    } catch (error) {
        console.log(error)
        return { status: "error", error }
    }
}



export const generateOTP = async (phone: string, idNumber: string) => {
    try {
        let otp = (Math.floor((Math.random() * 99999) + 10000)).toString();
        console.log("OTP: ", otp);
        let user = await db.patient.update({
            where: {
                idNumber
            },
            data: {
                otp,
                otpExpiresAt: new Date(new Date().setMinutes(new Date().getMinutes() + 5))
            }
        });
        if (!user) {
            return { status: "error", error: "invalid client credentials" }
        }

        let otpMessage = `Dear ${(user.names).split(" ")[0]},\nWelcome to Mama's Hub\n\nUse the code ${user?.otp || otp} to verify your account\n.
        `
        let smsResponse = await sendSMS(phone, otpMessage);
        // console.log(smsResponse);
        return { status: "success", message: "OTP generated successfully", otp }
    } catch (error) {
        return { status: "error", error }
    }
}

export const verifyOTP = async (phone: string, otp: string) => {
    try {
        let user = await db.patient.findFirst({
            where: {
                phone, otp
            }
        })
        if (!user) {
            return { status: "error", error: "Could not verify otp. Try again" }
        }
        if (user && new Date(user.otpExpiresAt || '') > new Date()) {
            db.patient.update({
                where: {
                    id: user.id
                },
                data: {
                    otp: null,
                    otpExpiresAt: null
                }
            })
            return { status: "success", message: "OTP verified successfully" }
        }
        return { status: "error", error: "Could not verify otp. Try again" }

    } catch (error) {
        return { status: "error", error }
    }
}

export const parsePhoneNumber = (phone: string) => {
    if (phone.length < 9) {
        return null
    }
    if (phone.length === 9) {
        return "+254" + phone
    }
    if (phone.length === 10 && phone[0] === "0") {
        return "+254" + phone.slice(1)
    }
    if (phone.length === 12) {
        return "+" + phone.slice(1, phone.length - 1)
    }
    if (phone.length === 13 && phone[0] === "+") {
        return phone
    }
    return null
}
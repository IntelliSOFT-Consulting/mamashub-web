import admin from 'firebase-admin';
import serviceAccount from '../config/fcmConfig.json';
import getPushList from './nextVisit';

const sendMsg = async msg => {
    try {
        const response = await admin.messaging().sendToDevice(msg.token, msg.data);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.log(error);
    }
};

const sendMsgList = async () => {
    try {
        const recipients = await getPushList();

        if (!recipients || recipients?.total === 0) return;

        recipients.entry.forEach(async entry => {
            const token = entry.resource.subject.reference;
            const data = entry.resource;
            await sendMsg({ token, data });
        });
    } catch (error) {
        console.log(error);
    }
};

const init = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FCM_DB_URL,
    });
};

export { init, sendMsgList };

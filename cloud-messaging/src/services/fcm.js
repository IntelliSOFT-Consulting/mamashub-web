import admin from 'firebase-admin';
import serviceAccount from '../config/fcmConfig.json';
import getPushList from './nextVisit';

const sendMsg = async msg => {
  try {
    // send to subscribers
    const response = await admin.messaging().sendToTopic(msg.topic, msg.data);
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
      const topic = entry.resource?.patient?.reference?.split('/')[1];
    //   const data = entry.resource;
      const msg = {
        body: 'You have an appointment tomorrow at 10:00 AM',
        title: 'Next Visit Reminder',
      };
      await sendMsg({ topic, data: msg });
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

import axios from 'axios';
import getPushList from './nextVisit';
import { format } from 'date-fns';

const sendMsg = async msg => {
  try {
    const { data } = await axios.post(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: '/topics/' + msg.topic,
        notification: {
          title: msg.data.title,
          body: msg.data.body,
          sound: 'default',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + process.env.FCM_SERVER_KEY,
        },
      }
    );

    console.log(data);
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
        body: `You have an appointment tomorrow at ${format(
          new Date(entry.resource?.start),
          'HH:mm'
        )}`,
        title: 'Next Visit Reminder',
      };
      await sendMsg({ topic, data: msg });
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMsgList;

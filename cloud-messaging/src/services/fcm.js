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

    console.log(recipients);

    if (!recipients || recipients?.total === 0) return;

    recipients.entry.forEach(async entry => {
      const topic = entry.resource?.subject?.reference?.split('/')[1];
      //   const data = entry.resource;
      console.log(topic)
      const msg = {
        body: `You have an appointment tomorrow at ${format(
          new Date(entry.resource?.valueString),
          'HH:mm'
        )}`,
        title: 'Next Visit Reminder',
      };
      console.log(process.env.API_URL)
      await axios.post(`${process.env.API_URL}/admin/x_admin_sms`,
        JSON.stringify({ message: msg.body, patient: topic}),
        { headers: { "Content-Type": "application/json" } }
      )
      await sendMsg({ topic, data: msg });
    });
  } catch (error) {
    console.log(error);
  }
};

export default sendMsgList;

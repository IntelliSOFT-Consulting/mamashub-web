import express from 'express';
import cron from 'node-cron';
import sendMsgList from './services/fcm';

const app = express();
const Port = process.env.PORT || 8000;



// set up the cron job to run every day 6:00 pm
// cron.schedule('0 18 * * *', () => {
cron.schedule('0 * * * *', () => {
  sendMsgList();
});

app.post('/notifications_x', (req, res) => {
  try {
    sendMsgList();
    res.status(200).send('Notifications sent');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

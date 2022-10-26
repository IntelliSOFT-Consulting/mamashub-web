import express from 'express';
import cron from 'node-cron';
import sendMsgList from './services/fcm';

const app = express();
const Port = process.env.PORT || 8000;

// set up the cron job to run every day 6:00 pm
cron.schedule('0 18 * * *', () => {
  sendMsgList();
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

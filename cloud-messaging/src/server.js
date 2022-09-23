import express from 'express';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import { init, sendMsgList } from './services/fcm';

const app = express();
const Port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up the cron job to run every day 6:00 pm
cron.schedule('0 18 * * *', () => {
  init();
  sendMsgList();
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});

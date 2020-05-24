import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { setupFireStore, setupFireStorage } from './common/firebase';
const { v4: uuid } = require('uuid');

const app = express();
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

const line_pay = require("line-pay");
const pay = new line_pay({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET_KEY,
  isSandbox: true
})

app.use(cookieParser());

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/pay', (req, res) => {
  const options = {
    productName: "test",
    amount: 1000,
    currency: "JPY",
    orderId: uuid(),
    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
    confirmUrlType: "SERVER"
  }

  pay.reserve(options).then((response) => {
    const reservation = options;
    reservation.transactionId = response.info.transactionId;
    console.log(response)
    res.redirect(response.info.paymentUrl.web);
  })
//  res.json({ hello: 'world' });
});

app.get('/pay/confirm', (req, res) => {
  console.log(req.query)
  res.json(req.query);
});

app.get('/images', async (req, res) => {
  const fireStorage = setupFireStorage();
  const fileList = [];
  const fileBuckets = await fireStorage.bucket().getFiles();
  for(const files of fileBuckets){
    for(const file of files){
      fileList.push({
        name: file.id,
        price: 1000,
        currency: "JPY",
        image_id: file.metadata.id,
        image_url: "https://firebasestorage.googleapis.com/v0" + file.parent.baseUrl + "/" + file.parent.id + file.baseUrl + "/" + file.id + "?alt=media",
        content_type: file.metadata.contentType,
        file_size: file.metadata.size,
        created_at: file.metadata.timeCreated,
        updated_at: file.metadata.updated,
      })
    }
  }
  res.json(fileList);
});

app.get('/upload', (req, res) => {
  const fireBucket = setupFireStorage().bucket();
  fireBucket.upload('./onepiece_ex01.png', { destination: 'aaa.png' }).then((file) => {
    console.log(file)
  })
  res.json({ hello: 'world' });
});

app.post('/uploadFile', (req, res) => {
  res.json({ hello: 'world' });
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
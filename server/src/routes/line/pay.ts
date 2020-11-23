import { NextFunction, Request, Response } from 'express';
import { setupFireStore } from '../../common/firebase';

const { v4: uuid } = require('uuid');
const express = require('express');
const linePayRouter = express.Router();

const line_pay = require("line-pay");
const pay = new line_pay({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET_KEY,
  isSandbox: true
})

linePayRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('hello line');
});

linePayRouter.get('/reserve', async (req, res) => {
  console.log(req.headers)
  const options = {
    productName: "test",
    amount: 1000,
    currency: "JPY",
    orderId: uuid(),
    confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
    confirmUrlType: "CLIENT"
  }

  const reserveResponse = await pay.reserve(options).catch((err) => {
    res.json(err);
  })
  const reservation = options;
  reservation.transactionId = reserveResponse.info.transactionId;
  const firestore = setupFireStore();
  const result = await firestore.collection("LinePayPurchaseLogs").doc(reservation.transactionId).set(options)
  // LineBotからはwebではなくappを使う
  res.redirect(reserveResponse.info.paymentUrl.web);
});

linePayRouter.get('/confirm', async (req, res) => {
  console.log(req.query)
  const firestore = setupFireStore();
  const purchaseLogDoc = await firestore.collection("LinePayPurchaseLogs").doc(req.query.transactionId).get()
  const purchaseLogData = purchaseLogDoc.data();
  const options = {
    transactionId: req.query.transactionId,
    amount: purchaseLogData.amount,
    currency: purchaseLogData.currency,
  }
  const confirmResponse = await pay.confirm(options).catch((err) => {
    res.json(err);
  })
  if(confirmResponse){
    res.redirect("https://takukobayashi.github.io/TeleportDresser/")
  }
});

export { linePayRouter };

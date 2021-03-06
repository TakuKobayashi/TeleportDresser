import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';
import { setupFireStore, setupFireStorage } from './common/firebase';
import { getFileList } from './common/firebase-storage'
import { linePayRouter } from './routes/line/pay';

const app = express();
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(cors({ origin: true }));

app.use('/line/pay', linePayRouter);

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/images', async (req, res) => {
  const fileList = await getFileList();
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
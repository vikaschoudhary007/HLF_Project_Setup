const express = require('express');
const Blockchain = require('../blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const P2pServer = require('./p2p-server');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);

app.use(express.json());

app.get('/blocks', (req, res) => {
  res.json(bc.chain);
});

app.post('/mine', (req, res) => {
  const data = req.body.data;
  const block = bc.addBlock(data);

  console.log(`New Block added ${block.toString()}`);

  p2pServer.syncChains();

  res.redirect('/blocks');
});

app.listen(HTTP_PORT, () => {
  console.log(`Server listening on PORT : ${HTTP_PORT}`);
});

p2pServer.listen();

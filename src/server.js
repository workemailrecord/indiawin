import "dotenv/config";

import express from "express";
import configViewEngine from "./config/configEngine.js";
import routes from "./routes/web.js";
import cronJobController from "./controllers/cronJobController.js";
import socketIoController from "./controllers/socketIoController.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
const app = express();
import createUSDTGateway from './controllers/usdtGatewayController.js';
import topbetgaming from './controllers/topbatgaming.js';
import jiligames from './controllers/jilimain.js';
import path from 'path';
import  authenticateAndCheckBalance from "./controllers/authenticateAndCheckBalance.js";



const server = http.createServer(app);
const io = new Server(server);


const port = process.env.PORT || 3000;

app.use(cookieParser());
// app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setup viewEngine
configViewEngine(app);
// init Web Routes
routes.initWebRouter(app);

// Cron game 1 Phut
cronJobController.cronJobGame1p(io);

// Check xem ai connect vào sever
socketIoController.sendMessageAdmin(io);


const usdtGatewayRouter = createUSDTGateway();
app.use('/usdt', usdtGatewayRouter);
app.use('/topbetgaming', topbetgaming);
app.use('/jiligames', jiligames);

app.get('/balancec', authenticateAndCheckBalance);

// app.get('/popup', (req, res) => {
//   res.render('popup.ejs');
// });

// Use the balance router


const gameHistory = [
  {
      name: "Win Go",
      status: "Win",
      dateTime: "2024-12-10 17:41:08",
      type: "Win Go 30 second",
      period: "20241210100051463",
      orderNumber: "WG2024121017410888752388d",
      selected: "Red",
      totalBet: "₹1.00",
      lotteryResult: "0",
      actualAmount: "₹0.98",
      winnings: "₹1.47",
      handlingFee: "₹0.02",
      profitLoss: "₹0.47"
  },
  {
      name: "Trx Win Go",
      status: "Lose",
      dateTime: "2024-12-11 18:30:00",
      type: "Trx Win Go 30 second",
      period: "20241211180000123",
      orderNumber: "TW2024121118300012345",
      selected: "Blue",
      totalBet: "₹2.00",
      lotteryResult: "1",
      actualAmount: "₹1.50",
      winnings: "₹0.00",
      handlingFee: "₹0.10",
      profitLoss: "-₹0.50"
  }
  // Add more dummy entries as needed
];

// Endpoint to get game history
app.get('/api/member/game_history', (req, res) => {
  res.json(gameHistory);
});

// app.all('*', (req, res) => {
//     return res.render("404.ejs");
// });

server.listen(port, () => {
  console.log(`Connected success http://localhost:${port}`);
});

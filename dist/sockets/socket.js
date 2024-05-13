"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: +(process.env.NODE_ENV === "test" ? 0 : 8081) });
wss.on("connection", (ws) => {
    console.log("Connecting");
    ws.on("error", console.error);
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
});
exports.default = wss;

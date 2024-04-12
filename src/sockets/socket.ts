import { WebSocketServer } from "ws";


const wss = new WebSocketServer({ port: +(process.env.NODE_ENV === "test" ? 0 : 8081) });
wss.on("connection", (ws) => {
    console.log("Connecting");
    ws.on("error", console.error)
    ws.on("message", (message) => {
        console.log(`Received message => ${message}`);
    });
   
    
});
export default wss;
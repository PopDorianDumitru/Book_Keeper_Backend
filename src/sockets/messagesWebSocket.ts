import { randomUUID } from "crypto";
import { WebSocketServer } from "ws";


const StartChattingSocket = () => {
    console.log("Starting chat");
    const wss = new WebSocketServer({ port: +(process.env.NODE_ENV === "test" ? 0 : 8082) });
    wss.on("connection", (ws) => {
        console.log("Connecting to chat");
        ws.on("error", console.error)
        ws.on("message", (message) => {
            wss.clients.forEach((client) => {
                const stringMessage = JSON.parse(message.toString());
                if (client !== ws && client.readyState === 1) {
                    client.send(JSON.stringify(stringMessage));
                }   
            });
        });
        
    });
}

export default StartChattingSocket;
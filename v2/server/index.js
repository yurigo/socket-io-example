import 'dotenv/config'
import { createServer } from "node:http";
import { Server } from "socket.io";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const history = [
  "hola",
  "hola!",
  "que tal? como estas? que tal las vacaciones?",
  "ostras! pues muy bien. Nos fuimos a Alicante",
  "y que tal?",
  "Mucho calor pero comimos bien",
  "me alegro",
];

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("use ");
  res.end();
}).listen(3000);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5500", "http://120.0.0.1:5500"],
    methods: ["GET", "POST", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", async (msg) => {
    
    if (msg.startsWith("/vanilla")){
      const question = msg.replace("/vanilla ", "");
      const iaMsg = await getMessageFromAI(question);
      return socket.emit("chat message", iaMsg);
    }

    if (msg.startsWith("/resumen")){
      const prompt = "Resumeme el chat: " + history.join(", ")
      const iaMsg = await getMessageFromAI("Resumeme el chat: " + history.join(", "));
      return io.emit("chat message", iaMsg);
    }

    history.push(msg);
    return io.emit("chat message", msg);
  });
});

async function getMessageFromAI(promt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: promt,
  });
  return response.text;
}
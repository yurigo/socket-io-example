import { createServer } from "node:http";
import { Server } from "socket.io";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("use ");
  res.end();
}).listen(3000);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5500", "http://120.0.0.1:5500"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", (msg) => {
    // console.log(chalk.blue("message: " + msg));
    io.emit("chat message", msg);
  });
});

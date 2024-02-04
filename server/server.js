const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer((req, res) => {
  // Handle HTTP requests if needed
});
app.use(express.json());
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

app.post("/api/auth", function (req, res) {
  // console.log(req.body);
  if (req.body.authStatus)
    io.emit("authenticated", JSON.stringify({ authed: true }));
  else io.emit("authenticated", JSON.stringify({ authed: false }));
  return res.status(200).json({ status: "ok" });
});
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  // socket.on("authStatus", (auth) => {
  //   // console.log(auth);
  //   if(auth.status=false) return io.emit()
  //   io.emit("authenticated", message); // Broadcast the message to all connected clients
  // });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("sendAuthPerm", () => {});
});
app.listen(3002, () => {
  console.log("Express ready on 3002");
});
server.listen(3001, () => {
  console.log("WebSocket server listening on port 3001");
});

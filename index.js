import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public/root.html"));
});

const tasks = [];

io.on("connection", (socket) => {
  console.log("User Connected");

  socket.emit("updateTasks", tasks);

  socket.on("addTask", (task) => {
    tasks.push(task);
    io.emit("updateTasks", tasks);
  });

  socket.on("removeTask", (taskId) => {
    tasks.splice(taskId, 1);
    io.emit("updateTasks", tasks);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server Is Listening on http://localhost:${PORT}`);
});

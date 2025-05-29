require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password || username.length < 3 || password.length < 6) {
    return res.status(400).json({
      message:
        "Username (min 3 chars) and password (min 6 chars) are required.",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        password,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    console.log(`User registered: ${newUser.username}`);
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error during registration" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`User logged in: ${user.username}`);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
});

// --- SOCKET.IO IMPLEMENTATION ---
io.on("connection", async (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  try {
    const messages = await prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 50, 
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    socket.emit("recentMessages", messages);
  } catch (error) {
    console.error(`Error sending recent messages to ${socket.id}:`, error);
    socket.emit("error", "Failed to load recent messages.");
  }

  socket.on("sendMessage", async (payload) => {
    if (!payload || !payload.userId || !payload.username || !payload.content) {
      console.warn(`Invalid message payload from ${socket.id}:`, payload);
      socket.emit(
        "error",
        "Invalid message format. Missing userId, username, or content."
      );
      return;
    }

    const { userId, username, content } = payload;
    console.log(`Received message from ${username} (${userId}): ${content}`);
    
    try {
      const savedMessage = await prisma.message.create({
        data: {
          content,
          user: {
            connect: { id: userId }, 
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      });

      io.emit("newMessage", savedMessage);
      console.log(`Message saved and broadcasted: ${savedMessage.content}`);
    } catch (error) {
      console.error(`Error handling sendMessage from ${socket.id}:`, error);
      socket.emit("error", "Failed to send message.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  socket.on("error", (err) => {
    console.error(`Socket error for ${socket.id}:`, err);
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`HTTP routes available at http://localhost:${PORT}`);
  console.log(`Socket.IO listening on ws://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(async () => {
    console.log("HTTP server closed. Disconnecting from Prisma.");
    await prisma.$disconnect();
    console.log("Prisma client disconnected. Exiting process.");
    process.exit(0);
  });
});

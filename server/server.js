const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React port
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/realtime-doc", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Define Document schema
const Document = mongoose.model("Document", new mongoose.Schema({
  _id: String,
  content: String,
}));

const defaultContent = "";

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.content);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { content: data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return;
  const doc = await Document.findById(id);
  if (doc) return doc;
  return await Document.create({ _id: id, content: defaultContent });
}

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
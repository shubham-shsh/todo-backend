import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Todo } from "./models/todo.model.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log("Mongo error ❌", err));

console.log("🔥 Routes are loading...");

// GET all todos
app.get("/todos", async (req, res) => {
  console.log("📥 /todos route hit");
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// ADD todo
app.post("/todos", async (req, res) => {
  const { todo } = req.body;
  const newTodo = await Todo.create({ todo });
  res.json(newTodo);
});

// UPDATE todo
app.put("/todos/:id", async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running 🚀 on port", PORT);
});
const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

// 할일 목록 조회 GET /api/todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "할일 목록을 불러오는데 실패했습니다." });
  }
});

// 할일 생성 POST /api/todos
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "할일 내용(title)을 입력해 주세요." });
    }
    const todo = await Todo.create({ title: title.trim() });
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "할일 생성에 실패했습니다." });
  }
});

// 할일 수정 PATCH /api/todos/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "올바른 할일 ID가 아닙니다." });
    }
    const { title, completed } = req.body;
    const update = {};
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "할일 내용(title)을 입력해 주세요." });
      }
      update.title = title.trim();
    }
    if (completed !== undefined) update.completed = Boolean(completed);

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: "수정할 항목(title 또는 completed)을 보내 주세요." });
    }

    const todo = await Todo.findByIdAndUpdate(id, update, { new: true });
    if (!todo) {
      return res.status(404).json({ error: "해당 할일을 찾을 수 없습니다." });
    }
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "할일 수정에 실패했습니다." });
  }
});

module.exports = router;

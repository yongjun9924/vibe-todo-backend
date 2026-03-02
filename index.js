const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRouter = require("./routes/todoRouter");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/todo-db";

// 환경변수 로드 확인 (비밀번호는 마스킹)
const envSource = process.env.MONGO_URI ? ".env" : "기본값(localhost)";
const maskedUri = MONGO_URI.replace(/:([^:@]+)@/, ":****@");
console.log("[환경변수] MONGO_URI 로드:", envSource, "→", maskedUri);

app.use(
  cors({
    origin: true, // 요청한 origin 그대로 허용 (localhost:3000 등)
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/api/todos", todoRouter);

app.get("/", (req, res) => {
  res.send("Todo backend 서버가 동작 중입니다.");
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("연결 성공");

    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}번에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
    process.exit(1);
  }
}

startServer();

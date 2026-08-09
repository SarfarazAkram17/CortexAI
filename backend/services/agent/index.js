import "dotenv/config";
import express from "express";
import connecDb from "./config/db.js";
import router from "./routes/agent.route.js";
import { initMinio } from "./config/minio.js";

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.get("/", (req, res) => {
  res.json({ message: "hello from agent" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({ message: `Agent error ${err}` });
});

app.listen(port, async () => {
  console.log(`agent started at ${port}`);
  try {
    await connecDb();
    await initMinio();
    console.log("DB and MinIO initialized");
  } catch (err) {
    console.error("Startup initialization failed:", err);
    process.exit(1);
  }
});

// updated to use minio

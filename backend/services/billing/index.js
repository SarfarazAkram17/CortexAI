import "dotenv/config";
import express from "express";
import connecDb from "./config/db.js";
import router from "./routes/billing.route.js";

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "hello from billing" });
});

app.listen(port, async () => {
  console.log(`billing started at ${port}`);
  connecDb();
});

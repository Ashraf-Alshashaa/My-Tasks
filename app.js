import express from "express";
import router from "./routes/my-tasks.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(express.static("public"));

export default app;

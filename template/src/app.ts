import express from "express";
import { json } from "express";
import { exampleRoute } from "./routes/example.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(json());

// mount example (placeholder)
app.use("/api/example", exampleRoute);

// global error handler
app.use(errorHandler);

export default app;

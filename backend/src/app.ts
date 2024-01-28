import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./routes/chat";
import { errorHandler } from "./errorHandler";

const app = express();

app.use(express.json());

//middleware
//TODO: move it to it's module
app.use(async (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (errorHandler.isTrustedError(err)) {
    await errorHandler.handleError(res, err);
  }
  next(err);
});

app.use(cors());

app.use("/chatbot", router);

app.listen(5000, () => {
  console.log("Server listening on port 5000...");
});

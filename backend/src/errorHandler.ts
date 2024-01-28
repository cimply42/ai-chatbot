import { Response } from "express";
import { BaseError } from "./errors";

class ErrorHandler {
  public async handleError(res: Response, err: Error): Promise<void> {
    //TODO user logger here
    if (err instanceof BaseError) {
      res.status(err.httpCode);
    }
    await setTimeout(() => console.log(err), 1000);
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

export const errorHandler = new ErrorHandler();

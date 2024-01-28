import { HttpStatusCode } from "./constants";

export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export class WeatherApiError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.SERVER_ERROR,
    description = `Weather api call failed with status code ${HttpStatusCode.SERVER_ERROR}`,
    isOperational = true
  ) {
    super(name, httpCode, description, isOperational);
  }
}

export class ExchangeRateApiError extends BaseError {
  constructor(
    name: string,
    httpCode = HttpStatusCode.SERVER_ERROR,
    description = `Exchange rate api call failed with status code ${HttpStatusCode.SERVER_ERROR}`,
    isOperational = true
  ) {
    super(name, httpCode, description, isOperational);
  }
}

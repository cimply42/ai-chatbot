import { z } from "zod";
import { HttpStatusCode } from "../constants";
import { ExchangeRateApiError } from "../errors";

const ExchangeRateResponseSchema = z.object({
  conversion_rate: z.number(),
  conversion_result: z.number().optional(),
});

export const getCurrentExchangeRate = async ({
  baseCurrency,
  targetCurrency,
  amount,
}: {
  baseCurrency: string;
  targetCurrency: string;
  amount?: number;
}): Promise<string> => {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${
      process.env.EXCHANGE_RATE_API_KEY
    }/pair/${baseCurrency}/${targetCurrency}/${amount ? `${amount}` : ""}`
  );
  switch (res.status) {
    case HttpStatusCode.OK:
      const parsedRes = ExchangeRateResponseSchema.safeParse(await res.json());
      if (!parsedRes.success) {
        throw new ExchangeRateApiError(
          "SERVER ERROR",
          HttpStatusCode.SERVER_ERROR,
          "Schema validation failed on exchange rate api response"
        );
      }
      return amount
        ? parsedRes.data.conversion_result.toString()
        : parsedRes.data.conversion_rate.toString();
    case HttpStatusCode.BAD_REQUEST:
      throw new ExchangeRateApiError(
        "BAD REQUEST",
        HttpStatusCode.BAD_REQUEST,
        "Invalid arguments passed to exchange rate api"
      );
    case HttpStatusCode.NOT_FOUND:
      throw new ExchangeRateApiError(
        "NOT FOUND",
        HttpStatusCode.NOT_FOUND,
        "Unsupported currency code sent to exchange rate api"
      );
    default:
      throw new ExchangeRateApiError(
        "SERVER ERROR",
        HttpStatusCode.SERVER_ERROR
      );
  }
};

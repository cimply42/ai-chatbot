import { z } from "zod";
import { HttpStatusCode } from "../constants";
import { WeatherApiError } from "../errors";

const WeatherResponseSchema = z.object({
  current: z.object({
    temp_f: z.number(),
    temp_c: z.number(),
  }),
});

export const getCurrentWeather = async ({
  location,
  format,
}: {
  location: string;
  format: string;
}): Promise<string> => {
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`
  );
  switch (res.status) {
    case HttpStatusCode.OK:
      const parsedRes = WeatherResponseSchema.safeParse(await res.json());
      if (!parsedRes.success) {
        throw new WeatherApiError(
          "SERVER ERROR",
          HttpStatusCode.SERVER_ERROR,
          "Schema validation failed on weather api response"
        );
      }
      return format === "fahrenheit"
        ? parsedRes.data.current.temp_f.toString()
        : parsedRes.data.current.temp_c.toString();
    case HttpStatusCode.BAD_REQUEST:
      throw new WeatherApiError(
        "BAD REQUEST",
        HttpStatusCode.BAD_REQUEST,
        `Invalid arguments passed to weather api`,
        true
      );
    default:
      throw new WeatherApiError("SERVER ERROR", HttpStatusCode.SERVER_ERROR);
  }
};

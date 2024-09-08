import React from "react";
import Container from "./Container";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { kelvinToCelsius } from "@/utils/converеKelvinToCelsius";

export interface ForecastWeatherDetailsProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetails({
  weatherIcon,
  date,
  day,
  temp,
  feels_like,
  temp_max,
  temp_min,
  description,
  visability,
  humidity,
  windSpeed,
  airPressure,
  sunrise,
  sunset,
}: ForecastWeatherDetailsProps) {
  return (
    <Container className="gap-4">
      <section className="flex gap-4 items-center px-4">
        <div className="flex flex-col items-center">
          <WeatherIcon iconName={weatherIcon} />
          <p>{date}</p>
          <p className="text-sm">{day}</p>
        </div>

        <div className="flex flex-col px-4">
          <span className="text-5xl">{kelvinToCelsius(temp ?? 0)}°</span>
          <p className="text-xs space-x-1 whitespace-nowrap">
            <span>Feels like</span>
            <span>{kelvinToCelsius(feels_like ?? 0)}°</span>
          </p>
          <p className="capitalization">{description}</p>
          <div className="flex gap-2">
            <span>{temp_min}°↓</span> <span>{temp_max}°↑</span>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto flex justify-between gap-4 px-4 w-full pr-10">
        <WeatherDetails
          visability={visability}
          humidity={humidity}
          windSpeed={windSpeed}
          airPressure={airPressure}
          sunrise={sunrise}
          sunset={sunset}
        />
      </section>
    </Container>
  );
}

import React from "react";
import SingleWeatherDetail from "./SingleWeatherDetail";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { FaWind } from "react-icons/fa";
import { IoMdSpeedometer } from "react-icons/io";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

function WeatherDetails({
  visability,
  humidity,
  windSpeed,
  airPressure,
  sunrise,
  sunset,
}: WeatherDetailProps) {
  return (
    <>
      <SingleWeatherDetail
        information="Visability"
        icon={<LuEye />}
        value={visability}
      />
      <SingleWeatherDetail
        information="Humidity"
        icon={<FiDroplet />}
        value={humidity}
      />
      <SingleWeatherDetail
        information="WindSpeed"
        icon={<FaWind />}
        value={windSpeed}
      />
      <SingleWeatherDetail
        information="AirPressure"
        icon={<IoMdSpeedometer />}
        value={airPressure}
      />
      <SingleWeatherDetail
        information="Sunrise"
        icon={<LuSunrise />}
        value={sunrise}
      />
      <SingleWeatherDetail
        information="Sunset"
        icon={<LuSunset />}
        value={sunset}
      />
    </>
  );
}

export default WeatherDetails;

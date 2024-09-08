"use client";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { kelvinToCelsius } from "@/utils/converеKelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/meterToKilometers";
import { convertUnixTimestampToTime } from "@/utils/convertUnixTimestampToTime";
import { metersPerSecondToKilometersPerHours } from "@/utils/metersPerSecondToKilometersPerHours";
import { useAtom } from "jotai";
import { loadinCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";

import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherIcon from "@/components/WeatherIcon";
import WeatherDetails from "@/components/WeatherDetails";
import ForecastWeatherDetails from "@/components/ForecastWeatherDetails";
import WeatherSkeleton from "@/components/WeatherSkeleton";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

/*https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=a4436e4874c153a841c09e96a1e0d2c3&cnt=56*/

type WeatherResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity, setIsLoadingCity] = useAtom(loadinCityAtom);
  console.log(place);

  const { isPending, error, data, refetch } = useQuery<WeatherResponse>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${API_KEY}&cnt=56`
      );

      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading....</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  {/*temerature*/}
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {kelvinToCelsius(firstData?.main.temp ?? 0)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span>
                        Feels like{" "}
                        {kelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {kelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓
                      </span>
                      <span>
                        {kelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                      </span>
                    </p>
                  </div>
                  {/*time and weather icon*/}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{kelvinToCelsius(d.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    windSpeed={metersPerSecondToKilometersPerHours(
                      firstData?.wind.speed ?? 1.64
                    )}
                    sunrise={convertUnixTimestampToTime(
                      data?.city.sunrise ?? 0
                    )}
                    sunset={convertUnixTimestampToTime(data?.city.sunset ?? 0)}
                  />
                </Container>
              </div>
            </section>

            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forcast (7 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetails
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={format(parseISO(d?.dt_txt ?? ""), "dd.MM")}
                  day={format(parseISO(d?.dt_txt ?? ""), "EEEE")}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={kelvinToCelsius(d?.main.temp_max ?? 0)}
                  temp_min={kelvinToCelsius(d?.main.temp_min ?? 0)}
                  airPressure={`${d?.main.pressure} hPa`}
                  humidity={`${d?.main.humidity}%`}
                  sunrise={convertUnixTimestampToTime(data?.city.sunrise ?? 0)}
                  sunset={convertUnixTimestampToTime(data?.city.sunset ?? 0)}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)}`}
                  windSpeed={metersPerSecondToKilometersPerHours(
                    d?.wind.speed ?? 1.64
                  )}
                />
              ))}
            </section>
          </>
        )}
        {/*today date*/}
      </main>
    </div>
  );
}

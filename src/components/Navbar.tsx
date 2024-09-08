"use client";

import axios from "axios";
import React, { useState } from "react";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import { useAtom } from "jotai";
import { loadinCityAtom, placeAtom } from "@/app/atom";

import SuggestionBox from "./SuggestionBox";
import SearchBox from "./SearchBox";

type Props = { location?: string };

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  console.log(city);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  console.log(suggestions);

  const [, setPlace] = useAtom(placeAtom);
  const [, setIsLoading] = useAtom(loadinCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestion(vlaue: string) {
    setCity(vlaue);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();

    if (suggestions.length == 0) {
      setError("Loacation not found");
      setIsLoading(false);
    } else {
      setError("");
      setTimeout(() => {
        setIsLoading(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setIsLoading(true);
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          setTimeout(() => {
            setIsLoading(false);
            setPlace(response.data.name);
          }, 1000);
        } catch (error) {
          setIsLoading(false);
        }
      });
    }
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl  mt-1 text-yellow-300" />
          </div>

          <section className="flex gap-2 items-center">
            <MdMyLocation
              title="Your current location"
              onClick={handleCurrentLocation}
              className="text-2xl text-gray-400 hover:opacity-80 cursor-pointer"
            />
            <MdOutlineLocationOn className="text-3xl" />
            <p className="text-slate-900/80 text-sm">{location}</p>
            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onChange={(e) => handleInputChange(e.target.value)}
                onSubmit={handleSubmitSearch}
              />
              <SuggestionBox
                showSuggestion={showSuggestions}
                suggestions={suggestions}
                handleSuggestionClick={handleSuggestion}
                error={error}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden">
        <div className="relative ">
          <SearchBox
            value={city}
            onChange={(e) => handleInputChange(e.target.value)}
            onSubmit={handleSubmitSearch}
          />
          <SuggestionBox
            showSuggestion={showSuggestions}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestion}
            error={error}
          />
        </div>
      </section>
    </>
  );
}

import React from "react";

interface SuggestionBoxProps {
  showSuggestion: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}

export default function SuggestionBox({
  showSuggestion,
  suggestions,
  handleSuggestionClick,
  error,
}: SuggestionBoxProps) {
  return (
    <>
      {((showSuggestion && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 px-2 py-2">
          {error && suggestions.length < 1 && (
            <li className="cursor-pointer p-1 rounded hover:bg-gray-200">
              {error}
            </li>
          )}

          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded hover:bg-gray-200"
            >
              {item}
            </li>
          ))}

          {/*s*/}
        </ul>
      )}
    </>
  );
}

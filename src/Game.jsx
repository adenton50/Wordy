import React, { useEffect, useState } from "react";
import Keyboard from "./Keyboard";

export default function Game() {
  const [wordList, setWordList] = useState([]);
  const [wordToGuess, setWordToGuess] = useState("");
  const maxColumns = 5;
  const [tries, setTries] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guess, setGuess] = useState(
    Array(6)
      .fill("")
      .map(() => Array(5).fill(""))
  );
  const [colors, setColors] = useState(
    Array(6).fill(Array(maxColumns).fill(""))
  );
  const [colIndex, setColIndex] = useState(0);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  useEffect(() => {
    const fetchWordList = async () => {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words"
        );
        const data = await res.text();
        const wordsArray = data.split("\n");
        setWordList(wordsArray);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchWordList();
  }, []);

  useEffect(() => {
    if (wordList.length > 0) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      setWordToGuess(wordList[randomIndex].toUpperCase());
    }
  }, [wordList]);

  const handleKeyDown = (eventOrKey) => {
    // Determine if the input is an event or a string
    const key = typeof eventOrKey === "string" ? eventOrKey : eventOrKey.key;

    if (key === "Backspace") {
      if (colIndex > 0) {
        setGuess((prev) => {
          const newGuess = [...prev];
          newGuess[currentRowIndex][colIndex - 1] = "";
          return newGuess;
        });
        setColIndex((prev) => prev - 1);
      }
    } else if (key === "Enter") {
      const guessedWord = guess[currentRowIndex].join("");
      const guessedWord2 = guessedWord.toLowerCase();

      if (!wordList.map((word) => word.toLowerCase()).includes(guessedWord2)) {
        alert("Not a valid word!");
        return;
      }

      setTries(tries + 1);
      if (tries === 5) {
        setGameOver(true);
      }

      if (guessedWord.length === maxColumns) {
        const currentColors = Array(maxColumns).fill("grey");
        const wordToGuessArray = wordToGuess.split("");

        // First pass: Check for correct letters (green)
        for (let i = 0; i < maxColumns; i++) {
          if (guessedWord[i] === wordToGuess[i]) {
            currentColors[i] = "green";
            wordToGuessArray[i] = null; // Prevent duplicate matches
          }
        }

        // Second pass: Check for included letters (yellow)
        for (let i = 0; i < maxColumns; i++) {
          if (
            currentColors[i] === "grey" &&
            wordToGuessArray.includes(guessedWord[i])
          ) {
            currentColors[i] = "yellow";
            const index = wordToGuessArray.indexOf(guessedWord[i]);
            if (index > -1) {
              wordToGuessArray[index] = null;
            }
          }
        }

        if (guessedWord === wordToGuess) {
          setGameOver(true);
          setGameWon(true);
        }

        if (guessedWord !== wordToGuess && tries === 5) {
          setGameLost(true);
        }

        setColors((prev) => {
          const newColors = [...prev];
          newColors[currentRowIndex] = currentColors; // Update colors for the current row
          return newColors;
        });

        setCurrentRowIndex((prev) => prev + 1);
        setColIndex(0);
      }
    } else {
      updateGuess(key);
    }
  };
  useEffect(() => {
    if (!gameOver) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, colIndex, currentRowIndex]);

  const updateGuess = (key) => {
    if (gameOver) {
      return;
    }

    if (colIndex < maxColumns) {
      setGuess((prev) => {
        const newGuess = [...prev];

        if (!newGuess[currentRowIndex]) {
          newGuess[currentRowIndex] = Array(maxColumns).fill("");
        }

        newGuess[currentRowIndex][colIndex] = key.toUpperCase();
        return newGuess;
      });
      setColIndex((prev) => prev + 1);
    }
  };

  const handleButtonClick = (key) => {
    updateGuess(key);
  };
  const colorClasses = {
    green: "bg-green-500",
    yellow: "bg-yellow-700",
    grey: "bg-gray-500",
  };

  return (
    <div className="text-white flex items-center flex-col justify-center mt-8 gap-4">
      <h1 className="text-6xl">WORDY</h1>
      {gameOver && <p className="text-2xl">{wordToGuess}</p>}
      {gameWon && <p className="text-2xl">Game Won!</p>}
      {gameLost && <p className="text-2xl">Game Lost!</p>}
      <div className="flex flex-col gap-4">
        {guess.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row gap-2">
            {row.map((letter, colIndex) => {
              const colorKey = colors[rowIndex]
                ? colors[rowIndex][colIndex]
                : "grey"; // Fallback if colors[rowIndex] is undefined
              const colorClass = colorClasses[colorKey] || ""; // Calculate color class here
              return (
                <div
                  key={colIndex}
                  className={`${colorClass} border-2 border-white h-14 w-14 md:h-16 md:w-16 flex items-center justify-center text-3xl`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Keyboard handleButtonClick={handleButtonClick} />
      <div className="flex flex-row gap-4">
        <button
          onClick={() => handleKeyDown("Enter")}
          className="bg-white font-bold border-0 outline-none border-0 rounded md:text-xl hover:bg-gray-400 text-black py-2 px-4"
        >
          Enter
        </button>
        <button
          onClick={() => handleKeyDown("Backspace")}
          className="bg-white font-bold border-0 outline-none border-0 rounded md:text-xl hover:bg-gray-400 text-black py-2 px-4"
        >
          Backspace
        </button>
        {gameOver && (
          <button
            onClick={() => window.location.reload()}
            className="bg-white font-bold border-0 outline-none border-0 rounded md:text-xl hover:bg-gray-400 text-black py-2 px-4"
          >
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
}

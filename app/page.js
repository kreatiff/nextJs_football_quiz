"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";
import { categoryOptions, difficultyOptions, modeOptions } from "@/constant";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";
import AppContext from "@/context/AppContext";

export default function Home() {
  const {
    setShowQuestionScreen,
    difficulty,
    setdifficulty,
    mode,
    setmode,
    category,
    setCategory,
    limit,
    setLimit,
    resetValues,
  } = React.useContext(AppContext);
  const router = useRouter();

  React.useEffect(() => {
    resetValues();
  }, []);

  const handleQuizStart = () => {
    setShowQuestionScreen(true);
    router.push("/questions");
  };

  return (
    <main className="wrapper">
      <div className="bg-white px-4 shadow-md w-full md:w-[80%] lg:w-[70%] max-w-5xl rounded-md">
        <h1 className="heading">Welcome to Football Quiz</h1>
        <div className="divider" />
        <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-4">
          <Image
            src={"/logo.png"}
            alt="banner-image"
            className="w-full h-auto"
          />
          <div className="flex flex-col justify-center items-center gap-6">
            <h2 className="text-center tracking-wide text-2xl font-bold">
              Quiz Settings
            </h2>
            <Dropdown
              value={difficulty}
              onChange={(e) => setdifficulty(e.value)}
              options={difficultyOptions}
              optionLabel="option"
              placeholder="Difficulty Level"
              className="w-full md:max-w-xs xl:max-w-md"
            />
            <Dropdown
              value={mode}
              onChange={(e) => setmode(e.value)}
              options={modeOptions}
              optionLabel="option"
              placeholder="Game Mode"
              className="w-full md:max-w-xs xl:max-w-md"
            />
            <Button
              label="Start Quiz"
              severity="info"
              disabled={!difficulty}
              onClick={handleQuizStart}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

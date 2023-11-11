"use client";

import AppContext from "@/context/AppContext";
import { useState, useContext, useEffect, useRef } from "react";
import { alphabeticNumeral, showCategory } from "@/constant";
import { redirect, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { ProgressBar } from "primereact/progressbar";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import OpenAI from "openai";
//test
const fetchedApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: fetchedApiKey,
});

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 16);
};

const Questions = () => {
  const {
    showQuestionScreen,
    category,
    difficulty,
    mode,
    limit,
    score,
    setScore,
    setShowQuestionScreen,
    setShowResultScreen,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [curr, setCurr] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState();
  const [data, setData] = useState([]);
  const [progressValue, setProgressValue] = useState(0);
  const [toggle, setToggle] = useState(false);
  const router = useRouter();
  const toast = useRef(null);

  if (!showQuestionScreen) {
    redirect("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo-1106", // Replace with your model name if different
          messages: [
            {
              role: "system",
              content: `You are a helpful assistant designed to generate multiple choice football questions with one correct answer and three incorrect answers. The questions should be of ${difficulty} difficulty. ${mode} Your output format should be JSON in the following template "id": "622a1c367cc59eab6f950026", "correctAnswer": "Baseball", "incorrectAnswers": ["Basketball", "American Football", "Soccer"],"question": "With which sport is Babe Ruth associated?"`,
            },
            { role: "user", content: "Generate 10 new questions" },
          ],
        });
        // Extracting the content and removing the code block syntax
        const contentString = response.choices[0].message.content;
        const jsonContent = contentString
          .replace(/```json\n|\n```/g, "")
          .trim();
        const questionsJson = JSON.parse(jsonContent);
        return setData(questionsJson);
      } catch (error) {
        console.error("Error fetching football questions:", error);
        return [];
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchData();

    return () => setShowQuestionScreen(false);
  }, []);

  useEffect(() => {
    if (data.length >= 5) {
      setAnswers(
        handleShuffle(data[curr].correctAnswer, data[curr].incorrectAnswers)
      );
    }
    setProgressValue((100 / limit) * (curr + 1));
  }, [curr, data]);

  const handleShuffle = (element, array) => {
    array.sort(() => Math.random() - 0.5);
    const randomIndex = Math.floor(Math.random() * (array.length + 1));
    array.splice(randomIndex, 0, element);
    return array;
  };

  const handleSelect = (i) => {
    if (selected === i && selected === data[curr].correctAnswer)
      return "correct";
    else if (selected === i && selected !== data[curr].correctAnswer)
      return "incorrect";
    else if (i === data[curr].correctAnswer) return "correct";
  };

  const handleCheck = (answer) => {
    setSelected(answer);
    if (answer === data[curr].correctAnswer) setScore(score + 1);
  };

  const handleNext = () => {
    setCurr((curr) => curr + 1);
    setSelected();
  };

  const handleQuit = () => {
    router.push("/");
  };

  const handleShowResult = async () => {
    await setShowResultScreen(true);
    router.push("/results");
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="wrapper">
        <div className="bg-white px-4 shadow-md w-full md:w-[80%] lg:w-[70%] max-w-5xl rounded-md">
          <h1 className="heading">Quizy</h1>
          <ProgressBar
            value={progressValue}
            showValue={false}
            style={{ height: "10px" }}
            color={progressValue === 100 && "green"}
          />
          <div className="flex justify-between py-5 px-2 font-bold text-md">
            <p>Score: {score}</p>
          </div>
          <div className="flex flex-col min-h-[70vh] p-10 gap-4 w-full">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <ProgressSpinner />
              </div>
            )}
            {data.length > 0 && (
              <>
                <h2 className="text-2xl text-center font-medium">{`Q${
                  curr + 1
                }. ${data[curr]?.question}`}</h2>

                {answers?.map((answer, i) => (
                  <button
                    key={answer}
                    className={`option ${selected && handleSelect(answer)}`}
                    disabled={selected}
                    onClick={() => handleCheck(answer)}
                  >
                    {alphabeticNumeral(i)}
                    {answer}
                  </button>
                ))}
                <div className="flex mt-5 md:justify-between md:flex-row flex-col gap-4 md:gap-0 mx-auto max-w-xs w-full">
                  <Button
                    label={
                      data.length - 1 != curr ? "Next Question" : "Show Results"
                    }
                    disabled={!selected}
                    onClick={() =>
                      data.length === curr + 1
                        ? handleShowResult()
                        : handleNext()
                    }
                  />
                  <Button
                    label="Quit Quiz"
                    severity="danger"
                    onClick={() => setToggle(true)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ConfirmDialog
        visible={toggle}
        onHide={() => setToggle(false)}
        message="Your Progress will be lost, Are you Sure?"
        header="Confirmation"
        accept={handleQuit}
        reject={() => setToggle(false)}
      />
    </>
  );
};

export default Questions;

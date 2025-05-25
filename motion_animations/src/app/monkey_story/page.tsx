"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import Head from "next/head";

const array = [1, 2, 3, 1, 1, 1, 1, 2];
const targetSum = 6;

const pythonCode = `
def longest_subarray_with_sum(array, target):
    start = 0
    current_sum = 0
    max_len = 0

    for end in range(len(array)):
        current_sum += array[end]
        while current_sum > target:
            current_sum -= array[start]
            start += 1
        if current_sum == target:
            max_len = max(max_len, end - start + 1)
    return max_len

# Example usage:
array = [1, 2, 3, 1, 1, 1, 1, 2]
target = 6
print("Longest subarray length with sum =", target, "is", longest_subarray_with_sum(array, target))
`;

export default function MonkeySlidingWindow() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [sum, setSum] = useState(array[0]);
  const [maxLen, setMaxLen] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [stepsSoFar, setStepsSoFar] = useState<string[]>([]);
  const [showPython, setShowPython] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      if (end >= array.length) {
        clearInterval(interval);
        setIsRunning(false);
        setStepsSoFar((prev) => [...prev, "🎉 Algorithm finished!"]);
        return;
      }

      if (sum > targetSum) {
        setStepsSoFar((prev) => [
          ...prev,
          `⚠️ Sum (${sum}) > Target (${targetSum}). Removing array[${start}] = ${array[start]}.`,
        ]);
        setSum((prevSum) => prevSum - array[start]);
        setStart((prevStart) => prevStart + 1);
      } else {
        if (sum === targetSum) {
          const currentLen = end - start + 1;
          setStepsSoFar((prev) => [
            ...prev,
            `✅ Sum (${sum}) == Target. Window length ${currentLen} is a new candidate.`,
          ]);
          setMaxLen((prev) => Math.max(prev, currentLen));
        } else {
          setStepsSoFar((prev) => [
            ...prev,
            `🔍 Sum (${sum}) < Target. Expanding window.`,
          ]);
        }
        const nextEnd = end + 1;
        if (nextEnd < array.length) {
          setEnd(nextEnd);
          setSum((prevSum) => prevSum + array[nextEnd]);
          setStepsSoFar((prev) => [
            ...prev,
            `➕ Added array[${nextEnd}] = ${array[nextEnd]}. New sum is ${
              sum + array[nextEnd]
            }.`,
          ]);
        } else {
          clearInterval(interval);
          setIsRunning(false);
          setStepsSoFar((prev) => [...prev, "🏁 Reached end of array."]);
        }
      }
    }, 900);

    return () => clearInterval(interval);
  }, [isRunning, start, end, sum]);

  const reset = () => {
    setStart(0);
    setEnd(0);
    setSum(array[0]);
    setMaxLen(0);
    setIsRunning(false);
    setStepsSoFar([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
      {/* Left side: Visualization and controls */}
      <div className="flex-1 flex flex-col gap-6">
        <Head>
          <title>🐒 Bandar ki Chori - Sliding Window Visualizer | Asaan Hai Coding</title>
          <meta
            name="description"
            content="Learn Sliding Window algorithm with Monkey ki Chori story. Visualize subarray sums and longest subarray with exact sum 6 using React animations."
          />
        </Head>

        <div className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold flex justify-center items-center gap-3 text-yellow-600 drop-shadow-lg">
            🐒 Bandar ki Chori <Sparkles className="w-7 h-7 text-yellow-400 animate-pulse" />
          </h1>
          <p className="text-yellow-800 text-xl font-medium">
            Mission: <span className="font-bold">{targetSum}</span> rupees ka khaana churao (sum)
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 my-8">
          {array.map((value, idx) => (
            <motion.div
              key={idx}
              className={`relative flex items-center justify-center w-16 h-16 rounded-xl border-4 font-semibold text-xl cursor-default select-none
                ${
                  idx >= start && idx <= end
                    ? "bg-yellow-200 border-yellow-500 shadow-lg shadow-yellow-300"
                    : "bg-white border-yellow-300"
                }
              `}
              layout
              whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(245,158,11,0.5)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {value}
              {idx === start && (
                <motion.span
                  className="absolute -top-12 text-5xl"
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  🐒
                </motion.span>
              )}
              {idx === end && (
                <motion.span
                  className="absolute -bottom-12 text-5xl z-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  💂🏼
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <Card className="bg-yellow-50 border-yellow-400 shadow-lg">
          <CardContent className="p-6 space-y-3 text-lg text-yellow-900">
            <p>
              🍌 <span className="font-semibold">Khaana Churaya:</span> {sum}
            </p>
            <p>
              📦 <span className="font-semibold">Window Range:</span> [{start} → {end}]
            </p>
            <p>
              🏆 <span className="font-semibold">Longest Chori So Far:</span> {maxLen} cages
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-5 mt-6">
          <Button
            onClick={() => setIsRunning(true)}
            disabled={isRunning}
            className="bg-yellow-500 hover:bg-yellow-600 text-black shadow-md shadow-yellow-400"
          >
            ▶️ Start Chori
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsRunning(false)}
            disabled={!isRunning}
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-100"
          >
            ⏸️ Pause
          </Button>
          <Button
            variant="destructive"
            onClick={reset}
            className="bg-red-500 hover:bg-red-600 shadow-red-400"
          >
            🔁 Reset
          </Button>
        </div>

        <div className="mt-8 p-5 bg-yellow-100 rounded-lg border border-yellow-300 text-yellow-900 text-sm leading-relaxed shadow-inner">
          <h3 className="font-semibold mb-3 text-lg text-yellow-800">Legend (Bandar ki Chori terms):</h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-900">
            <li>
              <strong>🐒 Start:</strong> Where the monkey begins stealing bananas.
            </li>
            <li>
              <strong>💂🏼 End:</strong> Where the guard stands, marking the window's end.
            </li>
            <li>
              <strong>🍌 Khaana Churaya (Sum):</strong> Total stolen bananas counted in current window.
            </li>
            <li>
              <strong>📦 Window Range:</strong> The range of houses (indexes) the monkey has stolen from.
            </li>
            <li>
              <strong>🏆 Longest Chori:</strong> The largest batch of bananas stolen exactly equal to {targetSum}.
            </li>
          </ul>
        </div>
      </div>

      {/* Right side: Algorithm steps + toggle */}
      <div className="w-full md:w-96 p-5 bg-yellow-50 rounded-2xl border border-yellow-300 shadow-lg flex flex-col max-h-[calc(100dvh-50px)]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-yellow-700 text-2xl text-center flex-1 select-none">
            Algorithm Steps
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPython((prev) => !prev)}
            className="ml-4 text-yellow-700 border-yellow-700 hover:bg-yellow-100"
          >
            {showPython ? "Show Steps" : "Show Python Code"}
          </Button>
        </div>
        <pre className="overflow-y-auto flex-1 bg-yellow-100 rounded-lg p-4 font-mono text-sm text-yellow-900 leading-relaxed whitespace-pre-wrap shadow-inner">
          {showPython ? pythonCode : stepsSoFar.length === 0 ? (
            <p className="text-yellow-700 text-center select-none">Steps will appear here...</p>
          ) : (
            stepsSoFar.map((step, idx) => (
              <p
                key={idx}
                className="bg-yellow-200 rounded-md p-2 mb-1 border border-yellow-300 shadow-sm"
              >
                {idx + 1}. {step}
              </p>
            ))
          )}
        </pre>
      </div>
    </div>
  );
}

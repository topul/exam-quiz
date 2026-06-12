"use client";

import { useState } from "react";
import type { FillQuestion } from "@/data/questions";

interface Props {
  question: FillQuestion;
  globalIdx: number;
  isAnswered: boolean;
  onAnswered: (gi: number, isCorrect: boolean) => void;
}

export default function FillCard({ question, globalIdx, isAnswered, onAnswered }: Props) {
  const [inputs, setInputs] = useState<string[]>(
    question.blanks.map(() => "")
  );
  const [results, setResults] = useState<("correct" | "wrong" | null)[]>(
    question.blanks.map(() => null)
  );
  const [showHint, setShowHint] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheck = () => {
    if (checked) return;
    const newResults = question.blanks.map((blank, i) => {
      const val = inputs[i].trim();
      const correct = blank.answer.some(
        (a) => val === a || val.toLowerCase() === a.toLowerCase()
      );
      return correct ? ("correct" as const) : ("wrong" as const);
    });
    setResults(newResults);
    setChecked(true);
    const allCorrect = newResults.every((r) => r === "correct");
    onAnswered(globalIdx, allCorrect);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      <p className="text-sm text-slate-400 mb-3">{question.context}</p>

      {/* Code Block */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-sm leading-relaxed mb-4 overflow-x-auto whitespace-pre-wrap">
        {question.codeLines.map((line, li) => {
          const blankForLine = question.blanks.find(
            (b) => b.index === li
          );
          if (blankForLine) {
            const bi = question.blanks.indexOf(blankForLine);
            return (
              <div key={li}>
                {line.split("____").map((part, pi, arr) => (
                  <span key={pi}>
                    {part}
                    {pi < arr.length - 1 && (
                      <input
                        value={inputs[bi]}
                        onChange={(e) => {
                          const next = [...inputs];
                          next[bi] = e.target.value;
                          setInputs(next);
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={checked}
                        className={`inline-block mx-1 px-3 py-0.5 rounded border text-center font-mono text-sm min-w-[80px] outline-none transition-colors ${
                          results[bi] === "correct"
                            ? "bg-emerald-950 border-emerald-600 text-emerald-300"
                            : results[bi] === "wrong"
                            ? "bg-red-950 border-red-600 text-red-300"
                            : "bg-indigo-950 border-indigo-500 text-indigo-200 focus:border-indigo-400"
                        }`}
                        placeholder="?"
                      />
                    )}
                  </span>
                ))}
              </div>
            );
          }
          return <div key={li}>{line}</div>;
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            确认
          </button>
        )}
        <button
          onClick={() => setShowHint((v) => !v)}
          className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-400 hover:bg-amber-950/30 text-sm font-medium transition-colors"
        >
          {showHint ? "隐藏提示" : "提示"}
        </button>
      </div>

      {/* Hint */}
      {showHint && !checked && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 text-sm">
          {question.blanks[0].hint}
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm leading-relaxed ${
            results.every((r) => r === "correct")
              ? "bg-emerald-950/50 border border-emerald-700/50 text-emerald-300"
              : "bg-red-950/50 border border-red-700/50 text-red-300"
          }`}
        >
          {results.every((r) => r === "correct") ? "✅ 正确！" : "❌ 错误。"}{" "}
          {question.explanation}
        </div>
      )}
    </div>
  );
}

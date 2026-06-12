"use client";

import { useState } from "react";
import type { MultiQuestion } from "@/data/questions";

interface Props {
  question: MultiQuestion;
  globalIdx: number;
  isAnswered: boolean;
  onAnswered: (gi: number, isCorrect: boolean) => void;
}

export default function MultiCard({ question, globalIdx, isAnswered, onAnswered }: Props) {
  const [selected, setSelected] = useState(-1);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (i: number) => {
    if (checked) return;
    setSelected(i);
  };

  const handleCheck = () => {
    if (checked || selected < 0) return;
    setChecked(true);
    onAnswered(globalIdx, selected === question.correctIndex);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      <p className="text-[15px] leading-relaxed mb-4">{question.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2 mb-4">
        {question.options.map((opt, i) => {
          let cls =
            "px-4 py-3 rounded-xl border-2 text-sm leading-relaxed cursor-pointer transition-colors ";
          if (checked) {
            if (i === question.correctIndex) {
              cls += "bg-emerald-950 border-emerald-600 text-emerald-200 cursor-default";
            } else if (i === selected && i !== question.correctIndex) {
              cls += "bg-red-950 border-red-600 text-red-200 cursor-default";
            } else {
              cls += "bg-slate-950 border-slate-800 text-slate-500 cursor-default";
            }
          } else {
            if (i === selected) {
              cls += "bg-indigo-950 border-indigo-500 text-indigo-200";
            } else {
              cls += "bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-500";
            }
          }
          return (
            <div key={i} className={cls} onClick={() => handleSelect(i)}>
              {opt}
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {!checked && (
          <button
            onClick={handleCheck}
            disabled={selected < 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected < 0
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
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
          {question.hint}
        </div>
      )}

      {/* Feedback */}
      {checked && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm leading-relaxed ${
            selected === question.correctIndex
              ? "bg-emerald-950/50 border border-emerald-700/50 text-emerald-300"
              : "bg-red-950/50 border border-red-700/50 text-red-300"
          }`}
        >
          {selected === question.correctIndex ? "✅ 正确！" : "❌ 错误。"}{" "}
          {question.explanation}
        </div>
      )}
    </div>
  );
}

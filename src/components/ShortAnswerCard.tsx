"use client";

import { useState } from "react";
import type { ShortAnswerQuestion } from "@/data/questions";

interface Props {
  question: ShortAnswerQuestion;
  globalIdx: number;
  isAnswered: boolean;
  onAnswered: (gi: number, isCorrect: boolean) => void;
}

export default function ShortAnswerCard({
  question,
  globalIdx,
  isAnswered,
  onAnswered,
}: Props) {
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleCheck = () => {
    if (checked || !input.trim()) return;
    const val = input.trim();
    const correct = question.answer.some(
      (a) => val === a || val.toLowerCase() === a.toLowerCase()
    );
    setIsCorrect(correct);
    setChecked(true);
    onAnswered(globalIdx, correct);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      <p className="text-[15px] leading-relaxed mb-4">{question.question}</p>

      {/* Options display */}
      <div className="flex flex-col gap-2 mb-4">
        {question.options.map((opt, i) => (
          <div
            key={i}
            className="px-4 py-3 rounded-xl border-2 bg-slate-950 border-slate-700 text-slate-300 text-sm leading-relaxed"
          >
            {opt}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-slate-400 shrink-0">你的答案：</span>
        <input
          value={input}
          onChange={(e) => {
            if (!checked) setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={checked}
          className={`flex-1 px-4 py-2.5 rounded-lg border font-mono text-sm outline-none transition-colors ${
            checked
              ? isCorrect
                ? "bg-emerald-950 border-emerald-600 text-emerald-300"
                : "bg-red-950 border-red-600 text-red-300"
              : "bg-slate-950 border-indigo-500 text-indigo-200 focus:border-indigo-400"
          }`}
          placeholder="输入选项字母"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {!checked && (
          <button
            onClick={handleCheck}
            disabled={!input.trim()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !input.trim()
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
            isCorrect
              ? "bg-emerald-950/50 border border-emerald-700/50 text-emerald-300"
              : "bg-red-950/50 border border-red-700/50 text-red-300"
          }`}
        >
          {isCorrect ? "✅ 正确！" : "❌ 错误。"} {question.explanation}
        </div>
      )}
    </div>
  );
}

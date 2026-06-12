"use client";

import { useState } from "react";
import type { EssayQuestion } from "@/data/questions";

interface Props {
  question: EssayQuestion;
  globalIdx: number;
}

export default function EssayCard({ question }: Props) {
  const [text, setText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showRef, setShowRef] = useState(false);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      <p className="text-[15px] leading-relaxed mb-4">{question.question}</p>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="写下你的答案..."
        className="w-full min-h-[120px] p-4 rounded-xl border-2 border-slate-700 bg-slate-950 text-slate-200 text-sm leading-relaxed outline-none resize-y focus:border-indigo-500 transition-colors"
      />

      {/* Buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => setShowHint((v) => !v)}
          className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-400 hover:bg-amber-950/30 text-sm font-medium transition-colors"
        >
          {showHint ? "隐藏提示" : "提示"}
        </button>
        <button
          onClick={() => setShowRef((v) => !v)}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          {showRef ? "隐藏参考答案" : "查看参考答案"}
        </button>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 text-sm">
          {question.hint}
        </div>
      )}

      {/* Reference Answer */}
      {showRef && (
        <div className="mt-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <h4 className="text-sky-400 text-sm font-semibold mb-2">参考答案</h4>
          <div className="space-y-2">
            {question.reference.map((line, i) => (
              <p key={i} className="text-sm text-slate-300 leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import type { CodeBlockQuestion } from "@/data/questions";

interface Props {
  question: CodeBlockQuestion;
  globalIdx: number;
  isAnswered: boolean;
  onAnswered: (gi: number, isCorrect: boolean) => void;
}

export default function CodeBlockCard({
  question,
  globalIdx,
  isAnswered,
  onAnswered,
}: Props) {
  const [inputs, setInputs] = useState<string[]>(question.blanks.map(() => ""));
  const [results, setResults] = useState<("correct" | "wrong" | null)[]>(
    question.blanks.map(() => null)
  );
  const [checked, setChecked] = useState(false);
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    codeRef.current
      ?.querySelectorAll<HTMLInputElement>("input[data-blank]")
      .forEach((el) => {
        el.style.width = `${Math.max(el.value.length + 2, 6)}ch`;
      });
  }, [inputs]);

  const handleInput = (bi: number, val: string) => {
    const next = [...inputs];
    next[bi] = val;
    setInputs(next);
  };

  const handleCheck = () => {
    if (checked) return;
    const newResults = question.blanks.map((blank, i) => {
      const val = inputs[i].trim();
      return blank.answer.some(
        (a) => val === a || val.toLowerCase() === a.toLowerCase()
      )
        ? ("correct" as const)
        : ("wrong" as const);
    });
    setResults(newResults);
    setChecked(true);
    onAnswered(
      globalIdx,
      newResults.every((r) => r === "correct")
    );
  };

  const toggleHint = (bi: number) => {
    setActiveHint((prev) => (prev === bi ? null : bi));
  };

  const correctCount = results.filter((r) => r === "correct").length;
  const totalBlanks = question.blanks.length;

  // Pre-compute which blank index belongs to which line
  const lineBlankMap = new Map<number, number[]>();
  let blankCursor = 0;
  const BLANK_TOKEN = "____";
  for (let li = 0; li < question.codeLines.length; li++) {
    const indices: number[] = [];
    let pos = 0;
    while (true) {
      const idx = question.codeLines[li].indexOf(BLANK_TOKEN, pos);
      if (idx === -1) break;
      indices.push(blankCursor++);
      pos = idx + BLANK_TOKEN.length;
    }
    if (indices.length > 0) lineBlankMap.set(li, indices);
  }

  const renderLine = (line: string, lineIdx: number) => {
    const blankIndices = lineBlankMap.get(lineIdx);

    const lineNum = (
      <span className="inline-block w-8 text-right mr-3 text-slate-600 select-none text-xs">
        {lineIdx + 1}
      </span>
    );

    // No blanks on this line
    if (!blankIndices || blankIndices.length === 0) {
      return (
        <div key={lineIdx} className="whitespace-pre">
          {lineNum}
          <span className="text-slate-300">{line || "\u00A0"}</span>
        </div>
      );
    }

    // Split line by "____" and interleave with inputs
    const textParts = line.split(BLANK_TOKEN);
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < textParts.length; i++) {
      if (textParts[i]) {
        elements.push(
          <span key={`t${i}`} className="text-slate-300">
            {textParts[i]}
          </span>
        );
      }
      if (i < blankIndices.length) {
        const bi = blankIndices[i];
        const blank = question.blanks[bi];
        const r = results[bi];
        const cls = `inline-block px-2 py-0 rounded border text-center font-mono text-[13px] outline-none transition-all ${
          r === "correct"
            ? "bg-emerald-950 border-emerald-500 text-emerald-300"
            : r === "wrong"
            ? "bg-red-950 border-red-500 text-red-300"
            : "bg-indigo-950/80 border-indigo-500/60 text-indigo-200 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-400"
        }`;

        elements.push(
          <span key={`b${bi}`} className="inline-flex items-center gap-0.5">
            <span className="text-indigo-400/70 text-[10px] font-bold select-none">
              {bi + 1}
            </span>
            <input
              data-blank={bi}
              value={inputs[bi]}
              onChange={(e) => handleInput(bi, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCheck();
                if (e.key === "Tab") {
                  e.preventDefault();
                  const next = (bi + 1) % question.blanks.length;
                  codeRef.current
                    ?.querySelector<HTMLInputElement>(
                      `input[data-blank="${next}"]`
                    )
                    ?.focus();
                }
              }}
              disabled={checked}
              className={cls}
              style={{
                minWidth: "6ch",
                width: `${Math.max(inputs[bi].length + 2, 6)}ch`,
              }}
              placeholder="?"
            />
          </span>
        );
      }
    }

    return (
      <div key={lineIdx} className="whitespace-pre">
        {lineNum}
        {elements}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
          {question.title}
        </span>
        {checked && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              correctCount === totalBlanks
                ? "bg-emerald-900 text-emerald-300"
                : "bg-amber-900 text-amber-300"
            }`}
          >
            {correctCount}/{totalBlanks} 空正确
          </span>
        )}
      </div>

      <div
        ref={codeRef}
        className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[13px] leading-[1.85] mb-4 overflow-x-auto"
      >
        {question.codeLines.map((line, li) => renderLine(line, li))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.blanks.map((blank, bi) => (
          <button
            key={bi}
            onClick={() => toggleHint(bi)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              activeHint === bi
                ? "bg-amber-950/60 border-amber-500 text-amber-300"
                : results[bi] === "correct"
                ? "bg-emerald-950/40 border-emerald-700 text-emerald-400"
                : results[bi] === "wrong"
                ? "bg-red-950/40 border-red-700 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            #{bi + 1}
          </button>
        ))}
      </div>

      {activeHint !== null && !checked && (
        <div className="mb-3 p-3 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 text-sm">
          填空 #{activeHint + 1} 提示：{question.blanks[activeHint].hint}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            全部确认
          </button>
        )}
      </div>

      {checked && (
        <div className="mt-4 space-y-2">
          {question.blanks.map((blank, bi) => {
            const r = results[bi];
            return (
              <div
                key={bi}
                className={`p-3 rounded-lg text-sm leading-relaxed ${
                  r === "correct"
                    ? "bg-emerald-950/40 border border-emerald-800/50 text-emerald-300"
                    : "bg-red-950/40 border border-red-800/50 text-red-300"
                }`}
              >
                <span className="font-medium">
                  #{bi + 1} {r === "correct" ? "✅" : "❌"}
                </span>{" "}
                {r === "wrong" && (
                  <span className="text-red-200">
                    正确答案：
                    <code className="bg-red-900/50 px-1 rounded">
                      {blank.answer[0]}
                    </code>{" "}
                  </span>
                )}
                <span className="text-slate-400">
                  {question.explanations[bi]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

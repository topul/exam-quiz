"use client";

import { useState, useCallback, useMemo } from "react";
import { questions, PROJECTS, PROJECT_SHORT } from "@/data/questions";
import FillCard from "@/components/FillCard";
import MultiCard from "@/components/MultiCard";
import EssayCard from "@/components/EssayCard";

type FilterType = "all" | (typeof PROJECTS)[number];

export default function QuizPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [correctSet, setCorrectSet] = useState<Set<number>>(new Set());
  const [wrongSet, setWrongSet] = useState<Set<number>>(new Set());

  const filtered = useMemo(
    () => (filter === "all" ? questions : questions.filter((q) => q.project === filter)),
    [filter]
  );

  const globalIdx = useMemo(
    () => (filtered.length > 0 ? questions.indexOf(filtered[currentIdx]) : -1),
    [filtered, currentIdx]
  );

  const handleAnswered = useCallback((gi: number, isCorrect: boolean) => {
    setAnswered((prev) => new Set(prev).add(gi));
    if (isCorrect) setCorrectSet((prev) => new Set(prev).add(gi));
    else setWrongSet((prev) => new Set(prev).add(gi));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % filtered.length);
  }, [filtered.length]);

  const switchFilter = useCallback((f: FilterType) => {
    setFilter(f);
    setCurrentIdx(0);
  }, []);

  if (filtered.length === 0)
    return <div className="p-8 text-center text-slate-400">无题目</div>;

  const q = filtered[currentIdx];
  const isAnswered = answered.has(globalIdx);
  const pct = Math.round((answered.size / questions.length) * 100);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-sky-400">
            人工智能训练师 — 考前突击测验
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {questions.length} 题 · 反复刷到满分
          </p>
        </header>

        {/* Progress */}
        <div className="h-2 rounded-full bg-slate-800 mb-5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-10 mb-5">
          <Stat label="正确" value={correctSet.size} color="text-emerald-400" />
          <Stat label="错误" value={wrongSet.size} color="text-red-400" />
          <Stat
            label={`已答 / ${questions.length}`}
            value={answered.size}
            color="text-sky-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabBtn active={filter === "all"} onClick={() => switchFilter("all")}>
            全部
          </TabBtn>
          {PROJECTS.map((p) => (
            <TabBtn
              key={p}
              active={filter === p}
              onClick={() => switchFilter(p)}
            >
              {PROJECT_SHORT[p]}
            </TabBtn>
          ))}
        </div>

        {/* Question Card */}
        <div className="mb-4 text-xs text-slate-500">
          {q.project} · 第 {currentIdx + 1} / {filtered.length} 题
        </div>

        {q.type === "fill" && (
          <FillCard
            key={globalIdx}
            question={q}
            globalIdx={globalIdx}
            isAnswered={isAnswered}
            onAnswered={handleAnswered}
          />
        )}
        {q.type === "multi" && (
          <MultiCard
            key={globalIdx}
            question={q}
            globalIdx={globalIdx}
            isAnswered={isAnswered}
            onAnswered={handleAnswered}
          />
        )}
        {q.type === "essay" && (
          <EssayCard key={globalIdx} question={q} globalIdx={globalIdx} />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pb-12">
          <button
            onClick={() =>
              setCurrentIdx(
                (i) => (i - 1 + filtered.length) % filtered.length
              )
            }
            className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            ← 上一题
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
          >
            下一题 →
          </button>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        active
          ? "bg-sky-950 border-sky-500 text-sky-400"
          : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
      }`}
    >
      {children}
    </button>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  ListChecks,
  RotateCcw,
  SunMedium,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  formatDominantLabel,
  getDailyPlanForResults,
} from "@/lib/dailyPlans";
import { loadPrakritiResults } from "@/lib/quizResultsStorage";

const CHECKLIST_KEY = "ayurai-daily-planner-checklist-v1";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadChecklist(dayKey) {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed?.[dayKey] ?? {};
  } catch {
    return {};
  }
}

function saveChecklist(dayKey, values) {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[dayKey] = values;
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

function ChecklistSection({ title, items, checked, onToggle }) {
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:border-gold transition-colors"
          >
            <Checkbox
              checked={Boolean(checked[item.id])}
              onCheckedChange={(next) => onToggle(item.id, Boolean(next))}
              className="mt-0.5"
            />
            <span className="text-sm text-foreground leading-relaxed">
              {item.label}
            </span>
          </label>
        ))}
      </CardContent>
    </Card>
  );
}

const DailyPlanner = () => {
  const [stored, setStored] = useState(() => loadPrakritiResults());
  const [dayKey, setDayKey] = useState(() => getTodayKey());
  const [checked, setChecked] = useState({});

  useEffect(() => {
    setStored(loadPrakritiResults());
    const today = getTodayKey();
    setDayKey(today);
    setChecked(loadChecklist(today));
  }, []);

  const plan = useMemo(() => {
    if (!stored?.tied?.length) return null;
    return getDailyPlanForResults({
      tied: stored.tied,
      scores: stored.scores,
    });
  }, [stored]);

  const dominantLabel = stored?.tied?.length
    ? formatDominantLabel(stored.tied)
    : null;

  const allItems = useMemo(() => {
    if (!plan) return [];
    return [
      ...plan.breakfast,
      ...plan.lunch,
      ...plan.dinner,
      ...plan.yogaAsanas,
      ...plan.wellnessSuggestions,
    ];
  }, [plan]);

  const completedCount = allItems.filter((item) => checked[item.id]).length;
  const completion = allItems.length
    ? Math.round((completedCount / allItems.length) * 100)
    : 0;

  const handleToggle = (id, next) => {
    setChecked((prev) => {
      const updated = { ...prev, [id]: next };
      saveChecklist(dayKey, updated);
      return updated;
    });
  };

  const resetToday = () => {
    setChecked({});
    saveChecklist(dayKey, {});
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/90 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/" aria-label="Back to chat">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" aria-hidden />
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
              Daily planner
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/quiz">
              <ClipboardList className="w-4 h-4" />
              Prakriti Quiz
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={resetToday} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset today
          </Button>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-[900px] mx-auto space-y-6">
          {!stored || !plan ? (
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Take the quiz first</CardTitle>
                <CardDescription>
                  Your daily checklist is tailored from your Prakriti quiz result.
                  Complete the quiz once and come back.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/quiz">Start Prakriti Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle>Today for {dominantLabel}</CardTitle>
                  <CardDescription>
                    <span className="inline-flex items-center gap-1">
                      <SunMedium className="w-3.5 h-3.5" />
                      Date: {dayKey}
                    </span>{" "}
                    - completed {completedCount}/{allItems.length} tasks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.summary}
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Daily completion</span>
                      <span>{completion}%</span>
                    </div>
                    <Progress value={completion} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <ChecklistSection
                  title="Breakfast checklist"
                  items={plan.breakfast}
                  checked={checked}
                  onToggle={handleToggle}
                />
                <ChecklistSection
                  title="Lunch checklist"
                  items={plan.lunch}
                  checked={checked}
                  onToggle={handleToggle}
                />
                <ChecklistSection
                  title="Dinner checklist"
                  items={plan.dinner}
                  checked={checked}
                  onToggle={handleToggle}
                />
                <ChecklistSection
                  title="Yoga asanas"
                  items={plan.yogaAsanas}
                  checked={checked}
                  onToggle={handleToggle}
                />
              </div>

              <ChecklistSection
                title="Extra daily suggestions"
                items={plan.wellnessSuggestions}
                checked={checked}
                onToggle={handleToggle}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DailyPlanner;

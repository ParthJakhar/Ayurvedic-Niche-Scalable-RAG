import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const DOSHA = /** @type {const} */ ({
  vata: "Vata",
  pitta: "Pitta",
  kapha: "Kapha",
});

const QUESTIONS = [
  {
    title: "How would you describe your body frame?",
    a: "Thin, light, difficulty gaining weight",
    b: "Medium build, muscular",
    c: "Large frame, gains weight easily",
  },
  {
    title: "Skin Type",
    a: "Dry, rough, cool",
    b: "Warm, sensitive, reddish",
    c: "Smooth, oily, thick",
  },
  {
    title: "Hair Type",
    a: "Dry, frizzy",
    b: "Fine, straight, early greying",
    c: "Thick, oily, wavy",
  },
  {
    title: "Appetite",
    a: "Irregular",
    b: "Strong and frequent",
    c: "Slow but steady",
  },
  {
    title: "Digestion",
    a: "Bloating or gas",
    b: "Burning or acidity",
    c: "Heavy or sluggish",
  },
  {
    title: "Energy Level",
    a: "Bursts of energy then fatigue",
    b: "Consistent and intense",
    c: "Stable but slow",
  },
  {
    title: "Sleep Pattern",
    a: "Light and easily disturbed",
    b: "Moderate",
    c: "Deep and long",
  },
  {
    title: "Climate Preference",
    a: "Warm climates",
    b: "Cool climates",
    c: "Dry climates",
  },
  {
    title: "Walking Style",
    a: "Fast and restless",
    b: "Purposeful and steady",
    c: "Slow and calm",
  },
  {
    title: "Speaking Style",
    a: "Quickly and a lot",
    b: "Clearly and sharply",
    c: "Slowly and calmly",
  },
  {
    title: "Memory",
    a: "Quick to learn but quick to forget",
    b: "Sharp and analytical",
    c: "Slow to learn but excellent long-term memory",
  },
  {
    title: "Stress Response",
    a: "Feel anxious or worried",
    b: "Become irritated or angry",
    c: "Withdraw or become quiet",
  },
  {
    title: "Temperature Sensitivity",
    a: "Cold",
    b: "Heat",
    c: "Damp or cold weather",
  },
  {
    title: "Weight Gain",
    a: "Hard to gain weight",
    b: "Moderate and stable",
    c: "Gain weight easily",
  },
  {
    title: "Emotional Nature",
    a: "Creative but anxious",
    b: "Ambitious and driven",
    c: "Calm and patient",
  },
  {
    title: "Perspiration",
    a: "Very little sweat",
    b: "Sweats easily",
    c: "Moderate sweat",
  },
  {
    title: "Hunger Pattern",
    a: "Slight discomfort",
    b: "Very irritated or weak",
    c: "Mostly fine",
  },
  {
    title: "Decision Making",
    a: "Change frequently",
    b: "Quick and confident",
    c: "Slow but firm",
  },
  {
    title: "Work Style",
    a: "Creative but inconsistent",
    b: "Efficient and competitive",
    c: "Patient and steady",
  },
  {
    title: "Social Nature",
    a: "Talkative and enthusiastic",
    b: "Leader-type personality",
    c: "Quiet and supportive",
  },
];

function computeScores(answers) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };
  for (const a of answers) {
    if (!a) continue;
    scores[a] += 1;
  }
  return scores;
}

function computeDominant(scores) {
  const entries = Object.entries(scores);
  const max = Math.max(...entries.map(([, v]) => v));
  const tied = entries.filter(([, v]) => v === max).map(([k]) => k);
  return { max, tied };
}

const Quiz = () => {
  const total = QUESTIONS.length;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState(() => Array(total).fill(null));

  const isDone = currentIdx >= total;
  const answeredCount = useMemo(
    () => answers.filter(Boolean).length,
    [answers],
  );
  const progress = useMemo(() => (answeredCount / total) * 100, [answeredCount, total]);

  const scores = useMemo(() => computeScores(answers), [answers]);
  const dominant = useMemo(() => computeDominant(scores), [scores]);

  const reset = () => {
    setAnswers(Array(total).fill(null));
    setCurrentIdx(0);
  };

  const onSelect = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = value;
      return next;
    });
  };

  const next = () => setCurrentIdx((i) => Math.min(i + 1, total));
  const back = () => setCurrentIdx((i) => Math.max(i - 1, 0));

  const currentAnswer = answers[currentIdx] || "";

  if (isDone) {
    const primaryLabel = dominant.tied.map((k) => DOSHA[k]).join(" - ");

    return (
      <div className="min-h-dvh bg-background">
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/90 backdrop-blur-lg sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/" aria-label="Back to chat">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="font-display text-2xl font-semibold text-foreground tracking-tight">
              Prakriti Quiz
            </h1>
          </div>

          <Button variant="outline" size="sm" onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Restart
          </Button>
        </header>

        <main className="px-6 py-8">
          <div className="max-w-[800px] mx-auto">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Your prakriti is: {primaryLabel}</CardTitle>
                <CardDescription>
                  Based on your answers, your dominant dosha score is{" "}
                  <span className="font-medium text-foreground">{dominant.max}</span>{" "}
                  out of {total}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vata</span>
                    <span className="font-medium text-foreground">{scores.vata}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pitta</span>
                    <span className="font-medium text-foreground">{scores.pitta}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Kapha</span>
                    <span className="font-medium text-foreground">{scores.kapha}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <Button asChild variant="outline">
                  <Link to="/">Back to chat</Link>
                </Button>
                <Button onClick={reset}>Take quiz again</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const q = QUESTIONS[currentIdx];
  const canGoNext = Boolean(answers[currentIdx]);
  const isLast = currentIdx === total - 1;

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/90 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/" aria-label="Back to chat">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h1 className="font-display text-xl md:text-2xl font-semibold text-foreground tracking-tight">
              Prakriti Quiz
            </h1>
            <span className="text-xs text-muted-foreground">
              Question {currentIdx + 1} of {total}
            </span>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-[800px] mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{answeredCount}/{total} answered</span>
            </div>
            <Progress value={progress} />
          </div>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle className="text-xl">{q.title}</CardTitle>
              <CardDescription>
                Choose one option (A = Vata, B = Pitta, C = Kapha)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup value={currentAnswer} onValueChange={onSelect} className="gap-3">
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-gold transition-colors cursor-pointer">
                  <RadioGroupItem value="vata" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">A — Vata</div>
                    <div className="text-sm text-muted-foreground">{q.a}</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-gold transition-colors cursor-pointer">
                  <RadioGroupItem value="pitta" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">B — Pitta</div>
                    <div className="text-sm text-muted-foreground">{q.b}</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 hover:border-gold transition-colors cursor-pointer">
                  <RadioGroupItem value="kapha" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">C — Kapha</div>
                    <div className="text-sm text-muted-foreground">{q.c}</div>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
            <CardFooter className="justify-between gap-3">
              <Button variant="outline" onClick={back} disabled={currentIdx === 0}>
                Back
              </Button>
              <Button onClick={next} disabled={!canGoNext}>
                {isLast ? "Finish" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Quiz;


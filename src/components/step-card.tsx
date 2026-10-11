"use client";

import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type StepCardProps = {
  id: string;
  step: number;
  title: string;
  description?: string;
  icon: ReactNode;
  complete: boolean;
  completionLabel: string;
  nextStepId?: string;
  onComplete: (value: boolean) => void;
  children: ReactNode;
};

export function StepCard({
  id,
  step,
  title,
  description,
  icon,
  complete,
  completionLabel,
  nextStepId,
  onComplete,
  children,
}: StepCardProps) {
  const reduceMotion = useReducedMotion();

  const goToNext = () => {
    if (!nextStepId) return;
    document.getElementById(nextStepId)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <motion.article
      id={id}
      className={`step-card ${complete ? "step-card--complete" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="step-card__marker" aria-hidden="true">
        {complete ? <Check size={21} strokeWidth={2.5} /> : step}
      </div>

      <div className="step-card__header">
        <div className="step-card__icon" aria-hidden="true">
          {icon}
        </div>
        <div>
          <p className="step-card__kicker">Bước {step}</p>
          <h2>{title}</h2>
          {description ? <p className="step-card__description">{description}</p> : null}
        </div>
      </div>

      <div className="step-card__body">{children}</div>

      <div className="step-card__footer">
        <label className="completion-toggle">
          <input
            type="checkbox"
            checked={complete}
            onChange={(event) => onComplete(event.currentTarget.checked)}
          />
          <span className="completion-toggle__box" aria-hidden="true">
            <Check size={17} strokeWidth={3} />
          </span>
          <span>{completionLabel}</span>
        </label>

        {complete && nextStepId ? (
          <motion.button
            type="button"
            className="next-button"
            onClick={goToNext}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Bước tiếp theo
            <ChevronRight size={18} />
          </motion.button>
        ) : null}
      </div>
    </motion.article>
  );
}

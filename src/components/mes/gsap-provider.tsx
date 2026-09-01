"use client";

import * as React from "react";
import { gsap } from "gsap";

// Hook for animating elements on mount
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      // Stagger reveal children with class "gsap-reveal"
      gsap.fromTo(
        el.querySelectorAll(".gsap-reveal"),
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return ref;
}

// Hook for number counter animation
export function useGsapCounter(target: number, duration = 0.8) {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<number>(0);

  React.useEffect(() => {
    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        ref.current = obj.val;
        setValue(obj.val);
      },
    });
    return () => { tween.kill(); };
  }, [target, duration]);

  return value;
}

// Component wrapper for page/module transitions
export function PageTransition({ children, moduleKey }: { children: React.ReactNode; moduleKey: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, x: 8 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }
      );
      // Stagger reveal cards
      gsap.fromTo(
        ref.current?.querySelectorAll("[data-card]") || [],
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.out",
          delay: 0.05,
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [moduleKey]);

  return <div ref={ref}>{children}</div>;
}

// Animated KPI value - counts up
export function AnimatedValue({ value, decimals = 0, suffix = "", prefix = "" }: {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const animated = useGsapCounter(value);
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated).toString();
  return <span className="tabular-nums">{prefix}{display}{suffix}</span>;
}

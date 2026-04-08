import { SquareRecord } from "@/lib/types";
import { useScroll } from "framer-motion";

export function cn(...values: Array<string | undefined | null | false>) {
  return values.filter(Boolean).join(" ");
}

export function positionToRowCol(position: number) {
  const row = Math.floor((position - 1) / 100) + 1;
  const col = ((position - 1) % 100) + 1;
  return { row, col };
}

export function formatCouple(square: Pick<SquareRecord, "name1" | "name2">) {
  return `${square.name1} & ${square.name2}`;
}

export function formatStartDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(date));
}

export function getDurationLabel(date: string) {
  const start = new Date(date);
  const now = new Date();
  let months =
    (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) {
    months -= 1;
  }
  const years = Math.max(0, Math.floor(months / 12));
  const remainingMonths = Math.max(0, months % 12);
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? "" : "s"}`;
  }
  return `${years} year${years === 1 ? "" : "s"}, ${remainingMonths} month${
    remainingMonths === 1 ? "" : "s"
  }`;
}

export function buildImageFallback(names: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    names
  )}&background=17171e&color=f0c040&size=512`;
}

export function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  return scrollYProgress;
}

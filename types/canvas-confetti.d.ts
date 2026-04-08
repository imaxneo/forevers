declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
  }

  export default function confetti(options?: Options): Promise<null>;
}

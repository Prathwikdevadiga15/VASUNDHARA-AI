import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({ className, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={clsx("rounded-full bg-forest px-5 py-2 font-semibold text-beige hover:bg-emerald disabled:opacity-50", className)} />;
}

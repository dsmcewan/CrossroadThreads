// design-sync preview shim for `next/link`.
// The real next/link drags in the Next.js router runtime, which reads
// process.env.__NEXT_* at module top level and throws in a plain browser
// IIFE. For static preview cards a plain anchor is the faithful render.
import * as React from "react";

type LinkProps = {
  href?: string | { pathname?: string };
  children?: React.ReactNode;
  className?: string;
} & Record<string, unknown>;

export default function Link({ href, children, ...rest }: LinkProps) {
  const to =
    typeof href === "string" ? href : href?.pathname ?? "#";
  return React.createElement("a", { href: to, ...rest }, children);
}

import type { ReactNode } from "react";

type SimpleCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export function SimpleCard({ title, children, className, footer }: SimpleCardProps) {
  return (
    <article
      className={`rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/15 dark:bg-zinc-900 ${className ?? ""}`}
    >
      {title ? <h3 className="mb-2 text-base font-semibold">{title}</h3> : null}
      <div>{children}</div>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </article>
  );
}

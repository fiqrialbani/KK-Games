export default function Section({ id, eyebrow, title, subtitle, action, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 ${className}`}>
      {(title || eyebrow) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="mt-2 font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-2 max-w-xl text-sm text-[var(--color-muted)]">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

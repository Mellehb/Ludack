type Props = {
  className?: string;
  invert?: boolean;
  height?: number;
};

/**
 * Logo — gebruikt /public/logo.png. Tot logo.png in de public-map wordt geplaatst,
 * tonen we een tekstuele fallback in de display-font zodat de UI niet breekt.
 */
export function Logo({ className = '', invert = false, height = 32 }: Props) {
  return (
    <a
      href="#top"
      aria-label="Ludack home"
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <img
        src="/logo.png"
        alt="Ludack"
        height={height}
        style={{ height }}
        className={`w-auto select-none transition-opacity ${invert ? 'invert' : ''} group-hover:opacity-80`}
        onError={(e) => {
          // Fallback wanneer logo.png nog niet bestaat
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          (e.currentTarget.nextElementSibling as HTMLElement | null)?.classList.remove('hidden');
        }}
      />
      <span
        className={`hidden font-display text-2xl tracking-widest ${invert ? 'text-bone' : 'text-ink'}`}
      >
        LUDACK
      </span>
    </a>
  );
}

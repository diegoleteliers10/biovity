export function BlogHeader() {
  return (
    <header className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-12 md:items-end md:gap-10 md:px-8 md:pb-16 md:pt-12">
      <div className="md:col-span-8">
        <h1 className="text-4xl font-semibold leading-[0.98] tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Ideas para una carrera <span className="text-secondary">científica.</span>
        </h1>
      </div>
      <div className="md:col-span-4 md:pb-1">
        <p className="max-w-md text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          Lecturas sobre biotecnología, trabajo y desarrollo profesional en Chile.
        </p>
      </div>
      <div className="col-span-full flex items-center gap-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-secondary" />
        <span className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Blog Biovity
        </span>
      </div>
    </header>
  )
}

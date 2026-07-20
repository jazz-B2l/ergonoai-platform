import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-background text-foreground">
      <div className="max-w-md p-8 rounded-2xl border border-border bg-card shadow-xl">
        <h1 className="font-sora text-6xl font-extrabold text-brand mb-2">404</h1>
        <h2 className="font-sora text-xl font-bold mb-2">Page Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          The page or workspace location you are looking for does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-brand text-brand-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Back to Safety Overview
        </Link>
      </div>
    </div>
  )
}

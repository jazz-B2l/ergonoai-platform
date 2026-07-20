export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-12 h-12 rounded-full border-4 border-brand/20 border-t-brand animate-spin mb-4" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading ErgonoAI workspace...
      </p>
    </div>
  )
}

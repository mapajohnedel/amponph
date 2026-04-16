export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-9rem)] bg-[linear-gradient(180deg,#fff8f2_0%,#eef7ff_50%,#fffaf6_100%)] py-12">
      <div className="site-container">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] border border-white/70 bg-white/85 p-10 text-center shadow-[0_30px_80px_-35px_rgba(20,44,90,0.35)] backdrop-blur">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#dce9f8] border-t-primary animate-spin" />
          <h1 className="mt-6 text-2xl font-bold text-foreground">Loading next page...</h1>
          <p className="mt-3 text-muted-foreground">
            Please wait while we prepare the latest content for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = { title: "You're offline" };

export default function OfflinePage() {
  return (
    <section className="container-page grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-coral">Connection lost</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          You're offline
        </h1>
        <p className="mt-3 max-w-md text-sm text-brand-ink/70">
          Looks like your network slipped away. We've kept your last visit in cache —
          reconnect and we'll bloom right back.
        </p>
      </div>
    </section>
  );
}

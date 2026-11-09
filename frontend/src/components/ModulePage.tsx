export function ModulePage({ title, summary, status }: { title: string; summary: string; status: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl font-semibold">{title}</h1>
      <p className="mt-3 text-lg">{summary}</p>
      <p className="mt-6 rounded-xl border border-gold/50 p-4"><b>Status:</b> {status}</p>
    </main>
  );
}

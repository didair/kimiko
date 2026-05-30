export function JsonBlock({ value }: { value: string | null | undefined }) {
  if (!value) {
    return <span className="text-slate-400">n/a</span>;
  }

  return <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{value}</pre>;
}

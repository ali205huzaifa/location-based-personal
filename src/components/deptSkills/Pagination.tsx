import type { PageMeta } from "../../types/user";

export default function Pagination({
  meta,
  onChange,
}: {
  meta: PageMeta;
  onChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  const canPrev = meta.page > 1;
  const canNext = meta.page < totalPages;

  const btn = "px-3 py-1 rounded-md border text-sm";

  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <div className="text-sm text-gray-600">
        Page <strong>{meta.page}</strong> of <strong>{totalPages}</strong> •
        Showing{" "}
        <strong>{Math.min(meta.page * meta.pageSize, meta.total)}</strong>/
        {meta.total}
      </div>
      <div className="flex items-center gap-2">
        <button
          className={`${btn} ${canPrev ? "bg-white" : "opacity-50"}`}
          disabled={!canPrev}
          onClick={() => onChange(meta.page - 1)}
        >
          Prev
        </button>
        <button
          className={`${btn} ${canNext ? "bg-white" : "opacity-50"}`}
          disabled={!canNext}
          onClick={() => onChange(meta.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

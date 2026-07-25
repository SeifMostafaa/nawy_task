export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

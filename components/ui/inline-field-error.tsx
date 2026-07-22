export function InlineFieldError({
  id,
  message,
}: {
  id: string;
  message?: string;
}) {
  return message ? (
    <p className="mt-1.5 text-xs font-bold text-red-700" id={id} role="alert">
      {message}
    </p>
  ) : null;
}

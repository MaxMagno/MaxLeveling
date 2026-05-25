export function AvatarQuote({ message, className = "" }: { message: string; className?: string }) {
  return (
    <p className={`text-sm italic text-violet/90 leading-snug ${className}`}>
      &ldquo;{message}&rdquo;
    </p>
  );
}

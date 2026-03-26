export default function SectionBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full border border-border bg-white px-4 py-1 text-base text-muted-foreground">
      {text}
    </span>
  );
}

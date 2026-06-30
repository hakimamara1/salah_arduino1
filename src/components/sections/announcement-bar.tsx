export function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-ink px-4 py-2 text-center text-sm font-bold text-white">
      {text}
    </div>
  );
}

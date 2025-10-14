export function NotificationBell({ count }: { count: number }) {
  return (
    <button className="relative rounded-full bg-gray-100 p-3">
      <span role="img" aria-label="notifications">
        🔔
      </span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
          {count}
        </span>
      )}
    </button>
  );
}

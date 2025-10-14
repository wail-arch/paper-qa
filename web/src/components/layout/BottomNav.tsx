import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "../ui/utils";

const tabs = [
  { to: "/b/home", labelKey: "welcome", icon: "🏠" },
  { to: "/b/request", labelKey: "request", icon: "💌" },
  { to: "/b/pay", labelKey: "pay", icon: "💳" },
  { to: "/b/nearby", labelKey: "nearby", icon: "📍" },
  { to: "/b/history", labelKey: "activity", icon: "🗂️" },
];

export default function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 py-2">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition",
                isActive ? "text-primary" : "text-gray-500"
              )
            }
          >
            <span className="text-lg" aria-hidden>
              {tab.icon}
            </span>
            <span>{t(tab.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

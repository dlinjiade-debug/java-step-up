import { AppIcon, type IconName } from "./AppIcon.tsx";

export type PageKey = "learn" | "practice" | "wrong" | "me";
const items: { id: PageKey; label: string; icon: IconName }[] = [
  { id: "learn", label: "学习", icon: "learn" },
  { id: "practice", label: "练习", icon: "practice" },
  { id: "wrong", label: "错题", icon: "wrong" },
  { id: "me", label: "我的", icon: "profile" },
];

export function BottomNav({ active, onNavigate }: { active: PageKey; onNavigate: (page: PageKey) => void }) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map((item) => (
        <button
          className={`bottom-nav__item${active === item.id ? " is-active" : ""}`}
          type="button"
          aria-current={active === item.id ? "page" : undefined}
          key={item.id}
          onClick={() => onNavigate(item.id)}
        >
          <span className="bottom-nav__icon"><AppIcon name={item.icon} size={19} /></span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

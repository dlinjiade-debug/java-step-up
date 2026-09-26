import type { ReactNode, SVGProps } from "react";

export type IconName = "learn" | "practice" | "wrong" | "profile" | "bookmark" | "back" | "arrow" | "check" | "close" | "upload" | "download" | "copy" | "spark" | "wifi";

const paths: Record<IconName, ReactNode> = {
  learn: <><path d="m3 10.5 9-7.5 9 7.5" /><path d="M5.5 9v11h13V9M9.5 20v-6h5v6" /></>,
  practice: <><rect x="4" y="3.5" width="16" height="17" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  wrong: <><path d="M6 4.5h12a1 1 0 0 1 1 1v15l-7-4-7 4v-15a1 1 0 0 1 1-1Z" /><path d="m9 9 6 6m0-6-6 6" /></>,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.7-3.6 3.3-5.5 7.5-5.5s6.8 1.9 7.5 5.5" /></>,
  bookmark: <><path d="M6 4.5h12a1 1 0 0 1 1 1v15l-7-4-7 4v-15a1 1 0 0 1 1-1Z" /></>,
  back: <><path d="m14.5 5-7 7 7 7" /></>,
  arrow: <><path d="M5 12h14M13 5l7 7-7 7" /></>,
  check: <><path d="m5 12 4.5 4.5L19 7" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  upload: <><path d="M12 16V4m-4 4 4-4 4 4" /><path d="M5 14v5h14v-5" /></>,
  download: <><path d="M12 4v12m-4-4 4 4 4-4" /><path d="M5 17v2h14v-2" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></>,
  spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
  wifi: <><path d="M3 9a14 14 0 0 1 18 0M6 12a9 9 0 0 1 12 0m-9 3a4.5 4.5 0 0 1 6 0" /><path d="M12 19h.01" /></>,
};

export function AppIcon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}

const PATHS = {
  chat: (
    <>
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  twins: (
    <>
      <rect x="3" y="6" width="7" height="12" rx="1.5" />
      <rect x="14" y="6" width="7" height="12" rx="1.5" />
      <path d="M10 12h4M12.5 10.5 14 12l-1.5 1.5" />
    </>
  ),
  check: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  gavel: (
    <>
      <path d="m14 4 6 6M11 7l6 6M12.5 5.5l-4 4M18.5 11.5l-4 4" />
      <path d="M9.5 11.5 3 18l3 3 6.5-6.5" />
    </>
  ),
  heal: (
    <>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  shield: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" />
      <rect x="9" y="10.5" width="6" height="5" rx="1" />
      <path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5" />
    </>
  ),
  coins: (
    <>
      <ellipse cx="9" cy="7" rx="5" ry="2.5" />
      <path d="M4 7v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V7" />
      <path d="M10 15.4c.8.7 2.4 1.1 4 1.1 2.8 0 5-1.1 5-2.5v-4c0-1.2-1.6-2.2-3.9-2.4" />
      <path d="M4 11v4c0 1.4 2.2 2.5 5 2.5 1 0 2-.1 2.8-.4" />
    </>
  ),
  code: (
    <>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 15c4-3 6-7 6-12-5 0-9 2-12 6l-3 1 2 3 3 3 3 2z" />
      <circle cx="13.5" cy="8.5" r="1.5" />
      <path d="M6 15c-1.5.5-2.5 2-3 5 3-.5 4.5-1.5 5-3" />
    </>
  ),
  cpu: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12.5h18" />
    </>
  ),
  cap: (
    <>
      <path d="m2 9 10-5 10 5-10 5z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13c0-1.7 1-2.6 2.3-2.6 1.4 0 2.2.9 2.2 2.6v3" />
    </>
  ),
  x: <path d="M4 4h4.5L20 20h-4.5zM20 4l-6.6 6.9M4 20l6.6-6.9" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5v.01" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
}

export default function Icon({ name, size = 22, stroke = 1.6, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}

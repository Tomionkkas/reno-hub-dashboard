interface BlogMobileButtonProps {
  onClick: () => void;
}

export default function BlogMobileButton({ onClick }: BlogMobileButtonProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'fixed bottom-6 right-5 z-50',
        'flex items-center gap-2',
        'px-4 py-2.5 rounded-full',
        'text-white text-xs font-semibold',
        'shadow-[0_4px_20px_rgba(127,103,255,0.45)]',
        'transition-transform duration-150 active:scale-95',
        'lg:hidden',
      ].join(' ')}
      style={{ background: 'linear-gradient(135deg, #7F67FF, #FF0080)' }}
      aria-label="Pokaż wszystkie posty"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="1" width="14" height="1.5" rx="0.75" fill="white"/>
        <rect y="6.25" width="10" height="1.5" rx="0.75" fill="white"/>
        <rect y="11.5" width="12" height="1.5" rx="0.75" fill="white"/>
      </svg>
      Posty
    </button>
  );
}

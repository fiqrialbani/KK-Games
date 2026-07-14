const LOGO_MAP = {
  'DANA': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/dana.svg',
  'OVO': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/ovo.svg',
  'GoPay': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/gopay.svg',
  'ShopeePay': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/shopee-pay.svg',
  'QRIS': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/qris.svg',
  'Bank BCA': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/bca.svg',
  'Bank Mandiri': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/mandiri.svg',
};

export default function PaymentCard({ method, selected, onSelect }) {
  const logoUrl = LOGO_MAP[method.name];

  return (
    <button
      type="button"
      onClick={() => onSelect(method)}
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition w-full ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-md shadow-[var(--color-accent)]/5'
          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/40'
      }`}
    >
      <div className="flex h-8 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1 border border-[var(--color-border)]/20 shadow-sm">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={method.name}
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              const fallbackSpan = e.target.nextSibling;
              if (fallbackSpan) fallbackSpan.style.display = 'inline';
            }}
          />
        ) : null}
        <span className="text-xl" style={{ display: logoUrl ? 'none' : 'inline' }}>{method.logo}</span>
      </div>
      <span className="text-sm font-medium text-[var(--color-text)] truncate">{method.name}</span>
    </button>
  );
}

export function formatIDR(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateInvoiceNumber() {
  const rand = Math.floor(100000 + Math.random() * 900000);
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `KK-${ymd}-${rand}`;
}

// Charge level (1-5) untuk visual "charge-bar" berdasarkan besar harga paket
export function chargeLevel(price, maxPrice) {
  const ratio = price / maxPrice;
  return Math.max(1, Math.min(5, Math.ceil(ratio * 5)));
}

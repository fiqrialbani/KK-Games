import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../../context/DataContext';

const STATUS_STYLE = {
  ACTIVE:   'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  INACTIVE: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
};

const LOGO_MAP = {
  'DANA': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/dana.svg',
  'OVO': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/ovo.svg',
  'GoPay': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/gopay.svg',
  'ShopeePay': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/shopee-pay.svg',
  'QRIS': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/qris.svg',
  'Bank BCA': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/bca.svg',
  'Bank Mandiri': 'https://cdn.jsdelivr.net/gh/hafidznoor/idn-finlogos@main/icons/mandiri.svg',
};

const getLogoElement = (name, logo) => {
  const logoUrl = LOGO_MAP[name] || (logo && (logo.startsWith('http') || logo.startsWith('/')) ? logo : null);
  
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="h-full w-full object-contain p-1"
        onError={(e) => {
          e.target.style.display = 'none';
          const fallbackSpan = e.target.nextSibling;
          if (fallbackSpan) fallbackSpan.style.display = 'inline';
        }}
      />
    );
  }
  return <span className="text-xl">{logo || '💳'}</span>;
};

const EMPTY_FORM = { name: '', logo: '', status: 'ACTIVE' };

export default function AdminPayments() {
  const { paymentMethods: methods, setPaymentMethods: setMethods } = useData();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: 'add' }); };
  const openEdit = (m) => {
    setForm({ name: m.name, logo: m.logo, status: m.status });
    setModal({ mode: 'edit', id: m.id });
  };
  const closeModal = () => setModal(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Nama metode wajib diisi!'); return; }
    if (modal.mode === 'add') {
      setMethods((prev) => [...prev, { id: Date.now(), name: form.name, logo: form.logo || '💳', status: form.status, type: 'other' }]);
      toast.success('Metode pembayaran ditambahkan!');
    } else {
      setMethods((prev) => prev.map((m) => m.id === modal.id ? { ...m, ...form } : m));
      toast.success('Metode pembayaran diperbarui!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success('Metode pembayaran dihapus!');
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    setMethods((prev) =>
      prev.map((m) => m.id === id ? { ...m, status: m.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : m)
    );
    toast.success('Status diperbarui!');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Metode Pembayaran</h1>
          <p className="text-sm text-[var(--color-muted)]">{methods.length} metode terdaftar</p>
        </div>
        <button onClick={openAdd} id="add-payment-btn" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90">
          <Plus size={16} /> Tambah Metode
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {methods.map((m) => (
          <div key={m.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-2xl" aria-label={`${m.name} logo`}>
                  {getLogoElement(m.name, m.logo)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text)]">{m.name}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[m.status]}`}>{m.status}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => toggleStatus(m.id)}
                className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all ${
                  m.status === 'ACTIVE'
                    ? 'border-[var(--color-danger)]/40 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10'
                    : 'border-[var(--color-success)]/40 text-[var(--color-success)] hover:bg-[var(--color-success)]/10'
                }`}
              >
                {m.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
              <button onClick={() => openEdit(m)} className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"><Pencil size={14} /></button>
              <button onClick={() => setDeleteId(m.id)} className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-semibold text-[var(--color-text)]">{modal.mode === 'add' ? 'Tambah Metode' : 'Edit Metode'}</h2>
              <button onClick={closeModal} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Logo preview */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-3xl">
                  {getLogoElement(form.name, form.logo)}
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Logo (emoji atau URL)</label>
                  <input name="logo" value={form.logo} onChange={handleFormChange} placeholder="e.g. 💙 atau https://..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Nama Metode</label>
                <input name="name" value={form.name} onChange={handleFormChange} placeholder="e.g. DANA" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Status</label>
                <select name="status" value={form.status} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] px-6 py-4">
              <button onClick={closeModal} className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Batal</button>
              <button onClick={handleSave} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
                <Check size={14} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger)]/15"><Trash2 size={24} className="text-[var(--color-danger)]" /></div>
            <h3 className="font-semibold text-[var(--color-text)]">Hapus Metode?</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Metode pembayaran ini akan dihapus permanen.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm text-[var(--color-muted)]">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-xl bg-[var(--color-danger)] py-2.5 text-sm font-semibold text-white hover:opacity-90">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

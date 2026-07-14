import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, X, Check, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../../context/DataContext';

const getPromoStatus = (promo) => {
  const now = new Date();
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);
  if (promo.status === 'INACTIVE') return 'INACTIVE';
  if (now < start) return 'UPCOMING';
  if (now > end) return 'EXPIRED';
  return 'ACTIVE';
};

const STATUS_STYLE = {
  ACTIVE:   'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  INACTIVE: 'bg-[var(--color-muted)]/15 text-[var(--color-muted)]',
  UPCOMING: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]',
  EXPIRED:  'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
};

const EMPTY_FORM = { title: '', discount: '', startDate: '', endDate: '', status: 'ACTIVE' };

export default function AdminPromotions() {
  const { promotions: promos, setPromotions: setPromos } = useData();
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const promosWithStatus = useMemo(() => promos.map((p) => ({ ...p, computedStatus: getPromoStatus(p) })), [promos]);

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: 'add' }); };
  const openEdit = (p) => {
    setForm({ title: p.title, discount: String(p.discount), startDate: p.startDate, endDate: p.endDate, status: p.status });
    setModal({ mode: 'edit', id: p.id });
  };
  const closeModal = () => setModal(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.discount || !form.startDate || !form.endDate) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error('Tanggal akhir harus setelah tanggal mulai!');
      return;
    }
    const disc = Number(form.discount);
    if (disc < 0 || disc > 100) { toast.error('Diskon harus antara 0-100%'); return; }

    if (modal.mode === 'add') {
      setPromos((prev) => [
        ...prev,
        { id: Date.now(), title: form.title.toUpperCase(), discount: disc, startDate: form.startDate, endDate: form.endDate, status: form.status, code: form.title.toUpperCase().replace(/\s+/g, '') },
      ]);
      toast.success('Promo kupon ditambahkan!');
    } else {
      setPromos((prev) => prev.map((p) => p.id === modal.id ? { ...p, title: form.title.toUpperCase(), discount: disc, startDate: form.startDate, endDate: form.endDate, status: form.status } : p));
      toast.success('Promo kupon diperbarui!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
    toast.success('Promo dihapus!');
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Promo Kupon</h1>
          <p className="text-sm text-[var(--color-muted)]">{promos.length} kupon terdaftar</p>
        </div>
        <button onClick={openAdd} id="add-promo-btn" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90">
          <Plus size={16} /> Tambah Kupon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {promosWithStatus.map((p) => (
          <div key={p.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-[var(--font-mono)] text-lg font-bold tracking-wider text-[var(--color-accent)]">{p.title}</p>
                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[p.computedStatus]}`}>
                  {p.computedStatus}
                </span>
              </div>
              <div className="text-right">
                <p className="font-[var(--font-display)] text-3xl font-bold text-[var(--color-text)]">{p.discount}%</p>
                <p className="text-xs text-[var(--color-muted)]">Diskon</p>
              </div>
            </div>
            {/* Dates */}
            <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <Calendar size={12} />
              <span>{new Date(p.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>—</span>
              <span>{new Date(p.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(p)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-1.5 text-xs text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"><Pencil size={12} /> Edit</button>
              <button onClick={() => setDeleteId(p.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] py-1.5 text-xs text-[var(--color-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"><Trash2 size={12} /> Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-semibold text-[var(--color-text)]">{modal.mode === 'add' ? 'Tambah Kupon' : 'Edit Kupon'}</h2>
              <button onClick={closeModal} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Kode Kupon</label>
                <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. KKGAMESUNTUNG" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-sm uppercase text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Diskon (%)</label>
                <input type="number" name="discount" value={form.discount} onChange={handleFormChange} min="0" max="100" placeholder="e.g. 10" className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Tanggal Mulai</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Tanggal Akhir</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
                </div>
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
            <h3 className="font-semibold text-[var(--color-text)]">Hapus Kupon?</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Kupon promo ini akan dihapus permanen.</p>
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

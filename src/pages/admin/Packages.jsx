import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { categories } from '../../data/games';
import { useData } from '../../context/DataContext';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const EMPTY_FORM = { gameId: '', name: '', amount: '', price: '' };

export default function AdminPackages() {
  const { games, packages: packagesMap, setPackages: setPackagesMap } = useData();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const gameMap = useMemo(() => Object.fromEntries(games.map((g) => [g.id, g.name])), [games]);

  const filtered = useMemo(
    () =>
      packagesMap.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (gameMap[p.gameId] || '').toLowerCase().includes(search.toLowerCase())
      ),
    [packagesMap, search, gameMap]
  );

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: 'add' }); };
  const openEdit = (p) => {
    setForm({ gameId: String(p.gameId), name: p.name, amount: String(p.amount), price: String(p.price) });
    setModal({ mode: 'edit', id: p.id });
  };
  const closeModal = () => setModal(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = () => {
    if (!form.gameId || !form.name.trim() || !form.amount || !form.price) {
      toast.error('Semua field wajib diisi!');
      return;
    }
    if (modal.mode === 'add') {
      setPackagesMap((prev) => [
        ...prev,
        { id: Date.now(), gameId: Number(form.gameId), name: form.name, amount: Number(form.amount), price: Number(form.price) },
      ]);
      toast.success('Paket berhasil ditambahkan!');
    } else {
      setPackagesMap((prev) =>
        prev.map((p) => p.id === modal.id ? { ...p, gameId: Number(form.gameId), name: form.name, amount: Number(form.amount), price: Number(form.price) } : p)
      );
      toast.success('Paket berhasil diperbarui!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setPackagesMap((prev) => prev.filter((p) => p.id !== id));
    toast.success('Paket dihapus!');
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Kelola Paket</h1>
          <p className="text-sm text-[var(--color-muted)]">{packagesMap.length} paket top-up terdaftar</p>
        </div>
        <button onClick={openAdd} id="add-package-btn" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90">
          <Plus size={16} /> Tambah Paket
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text" placeholder="Cari nama paket atau game..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
        />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
              <tr>
                {['Game', 'Nama Paket', 'Jumlah', 'Harga', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-[var(--color-muted)]">Tidak ada paket ditemukan.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--color-bg)]/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-[var(--color-text)]">{gameMap[p.gameId] || '-'}</td>
                  <td className="px-5 py-3.5 text-[var(--color-muted)]">{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-[var(--color-accent)]">{p.amount}</td>
                  <td className="px-5 py-3.5 font-semibold text-[var(--color-text)]">{formatRupiah(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"><Pencil size={12} /> Edit</button>
                      <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]"><Trash2 size={12} /> Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-semibold text-[var(--color-text)]">{modal.mode === 'add' ? 'Tambah Paket' : 'Edit Paket'}</h2>
              <button onClick={closeModal} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Game</label>
                <select name="gameId" value={form.gameId} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40">
                  <option value="">— Pilih Game —</option>
                  {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              {[
                { label: 'Nama Paket', name: 'name', placeholder: 'e.g. 325 UC', type: 'text' },
                { label: 'Amount', name: 'amount', placeholder: 'e.g. 325', type: 'number' },
                { label: 'Harga (Rp)', name: 'price', placeholder: 'e.g. 75000', type: 'number' },
              ].map(({ label, name, placeholder, type }) => (
                <div key={name}>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">{label}</label>
                  <input type={type} name={name} value={form[name]} onChange={handleFormChange} placeholder={placeholder} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
                </div>
              ))}
              {form.price && (
                <p className="text-xs text-[var(--color-muted)]">Preview harga: <span className="font-semibold text-[var(--color-accent)]">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(form.price))}</span></p>
              )}
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
            <h3 className="font-semibold text-[var(--color-text)]">Hapus Paket?</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Paket ini akan dihapus secara permanen.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-[var(--color-border)] py-2.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 rounded-xl bg-[var(--color-danger)] py-2.5 text-sm font-semibold text-white hover:opacity-90">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

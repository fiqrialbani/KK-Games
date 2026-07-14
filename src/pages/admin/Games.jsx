import { useState, useMemo, useRef } from 'react';
import { Plus, Search, Pencil, Trash2, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { categories } from '../../data/games';
import { useData } from '../../context/DataContext';

const STATUS_STYLE = {
  ACTIVE:   'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  INACTIVE: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
};

const EMPTY_FORM = { name: '', publisher: '', categoryId: '', image: '', status: 'ACTIVE' };

export default function AdminGames() {
  const { games, setGames } = useData();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', id?: number }
  const [form, setForm] = useState(EMPTY_FORM);
  const [imgPreview, setImgPreview] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = useMemo(
    () => games.filter((g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.publisher.toLowerCase().includes(search.toLowerCase())
    ),
    [games, search]
  );

  const openAdd = () => { setForm(EMPTY_FORM); setImgPreview(''); setModal({ mode: 'add' }); };
  const openEdit = (g) => {
    setForm({ name: g.name, publisher: g.publisher, categoryId: String(g.categoryId), image: g.image || '', status: g.status || 'ACTIVE' });
    setImgPreview(g.image || '');
    setModal({ mode: 'edit', id: g.id });
  };
  const closeModal = () => setModal(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal adalah 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setForm((f) => ({ ...f, image: base64String }));
      setImgPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.publisher.trim() || !form.categoryId) {
      toast.error('Nama, publisher, dan kategori wajib diisi!');
      return;
    }
    if (modal.mode === 'add') {
      const newGame = {
        id: Date.now(),
        slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        name: form.name,
        publisher: form.publisher,
        categoryId: Number(form.categoryId),
        image: form.image || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
        status: form.status,
        popular: false,
        currency: 'Diamonds',
        idLabel: 'User ID',
        serverRequired: false,
        description: 'Top up game instan dengan KK Games.',
      };
      setGames((prev) => [newGame, ...prev]);
      toast.success('Game berhasil ditambahkan!');
    } else {
      setGames((prev) => prev.map((g) => g.id === modal.id ? { ...g, ...form, categoryId: Number(form.categoryId) } : g));
      toast.success('Game berhasil diperbarui!');
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    toast.success('Game berhasil dihapus!');
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Kelola Game</h1>
          <p className="text-sm text-[var(--color-muted)]">{games.length} game terdaftar</p>
        </div>
        <button onClick={openAdd} id="add-game-btn" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90">
          <Plus size={16} /> Tambah Game
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input
          type="text" placeholder="Cari nama game atau publisher..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
              <tr>
                {['Game', 'Publisher', 'Kategori', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-[var(--color-muted)]">Tidak ada game ditemukan.</td></tr>
              ) : filtered.map((g) => {
                const cat = categories.find((c) => c.id === g.categoryId);
                const gameStatus = g.status === 'active' || g.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';
                return (
                  <tr key={g.id} className="hover:bg-[var(--color-bg)]/30 transition-colors">
                    <td className="flex items-center gap-3 px-5 py-3.5">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-[var(--color-border)]">
                        <img src={g.image} alt={g.name} className="h-full w-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&q=60'; }} />
                      </div>
                      <span className="font-medium text-[var(--color-text)]">{g.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--color-muted)]">{g.publisher}</td>
                    <td className="px-5 py-3.5 text-[var(--color-muted)]">{cat?.name || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[gameStatus]}`}>{gameStatus}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(g)} className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                          <Pencil size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(g.id)} className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-[var(--color-muted)] transition-all hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]">
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="font-semibold text-[var(--color-text)]">{modal.mode === 'add' ? 'Tambah Game Baru' : 'Edit Game'}</h2>
              <button onClick={closeModal} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Input/Upload */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Gambar/Banner Game</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center">
                    {imgPreview ? <img src={imgPreview} alt="preview" className="h-full w-full object-cover" onError={() => setImgPreview('')} /> : <ImageIcon size={24} className="text-[var(--color-muted)]" />}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-xs text-[var(--color-text)] font-semibold transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    >
                      <Upload size={14} /> Pilih Gambar Game
                    </button>
                    <p className="text-[10px] text-[var(--color-muted)] mt-1.5">Mendukung format PNG, JPG, JPEG atau GIF. Max 2MB.</p>
                  </div>
                </div>
              </div>

              {[
                { label: 'Nama Game', name: 'name', placeholder: 'e.g. Mobile Legends' },
                { label: 'Publisher', name: 'publisher', placeholder: 'e.g. Moonton' },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">{label}</label>
                  <input name={name} value={form[name]} onChange={handleFormChange} placeholder={placeholder} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Kategori</label>
                  <select name="categoryId" value={form.categoryId} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40">
                    <option value="">— Pilih —</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Status</label>
                  <select name="status" value={form.status} onChange={handleFormChange} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
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

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger)]/15">
              <Trash2 size={24} className="text-[var(--color-danger)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-text)]">Hapus Game?</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Seluruh paket top-up yang terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
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

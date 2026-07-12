import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ distributions }) {
    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().split('T')[0],
        total_stock: '',
        alpha_capping: 1.0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('distributions.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 leading-tight">Dashboard & Alokasi</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Welcome Banner */}
                    <div className="glass overflow-hidden rounded-2xl p-8 relative isolate">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10" />
                        <h2 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Selamat Datang di Command Center SPK</h2>
                        <p className="text-slate-600 max-w-2xl text-lg font-medium">Sistem Pendukung Keputusan Alokasi Distribusi LPG 3 Kg dengan pendekatan Hybrid ROC-TOPSIS. Silakan buat siklus manifes harian baru di bawah ini.</p>
                    </div>

                    {/* Buat Manifes Baru */}
                    <div className="glass overflow-hidden rounded-2xl p-8 border border-white">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Buat Manifes Distribusi Baru</h3>
                        </div>

                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end bg-white/40 p-6 rounded-xl border border-white/60">
                            <div>
                                <InputLabel htmlFor="date" value="Tanggal Distribusi" className="font-semibold text-slate-700" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    className="mt-2 block w-full bg-white/80 focus:bg-white"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="total_stock" value="Total Stok Agen (S)" className="font-semibold text-slate-700" />
                                <TextInput
                                    id="total_stock"
                                    type="number"
                                    className="mt-2 block w-full bg-white/80 focus:bg-white"
                                    value={data.total_stock}
                                    onChange={(e) => setData('total_stock', e.target.value)}
                                    required
                                    min="1"
                                    placeholder="Contoh: 560"
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="alpha_capping" value="Alpha Capping (α)" className="font-semibold text-slate-700" />
                                <TextInput
                                    id="alpha_capping"
                                    type="number"
                                    step="0.1"
                                    className="mt-2 block w-full bg-white/80 focus:bg-white"
                                    value={data.alpha_capping}
                                    onChange={(e) => setData('alpha_capping', e.target.value)}
                                    required
                                    min="0.1"
                                    max="1.0"
                                />
                            </div>
                            <div>
                                <PrimaryButton disabled={processing} className="w-full justify-center h-[42px] text-base">Buat Siklus Alokasi</PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Analytics Chart & Export Bar */}
                    <div className="glass overflow-hidden rounded-2xl p-6 border border-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Analitik Pasokan</h3>
                            <a href={route('reports.excel')} className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-200 transition-colors border border-emerald-200">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>
                                Export Semua (Excel)
                            </a>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[...distributions.data].reverse()}>
                                    <defs>
                                        <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                                    <Area type="monotone" dataKey="total_stock" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" name="Stok Agen (Tabung)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* History Manifes */}
                    <div className="glass overflow-hidden rounded-2xl">
                        <div className="p-6 border-b border-gray-100 bg-white/40 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-800 rounded-lg text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">Riwayat Distribusi</h3>
                            </div>
                        </div>
                        
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-600 whitespace-nowrap">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Tanggal</th>
                                        <th className="px-6 py-4 font-bold">Total Stok</th>
                                        <th className="px-6 py-4 font-bold">Alpha</th>
                                        <th className="px-6 py-4 font-bold">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {distributions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-400 italic">Belum ada riwayat distribusi.</td>
                                        </tr>
                                    ) : (
                                        distributions.data.map((dist) => (
                                            <tr key={dist.id} className="border-b border-slate-100 bg-white/30 hover:bg-white/60 transition-colors">
                                                <td className="px-6 py-4 font-semibold text-slate-800">{new Date(dist.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                <td className="px-6 py-4 font-medium">{dist.total_stock} Tabung</td>
                                                <td className="px-6 py-4 font-medium">{dist.alpha_capping}</td>
                                                <td className="px-6 py-4">
                                                    {dist.status === 'draft' && <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Draft SPK</span>}
                                                    {dist.status === 'locked' && <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Terkunci (Otw)</span>}
                                                    {dist.status === 'completed' && <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">Selesai</span>}
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-4">
                                                    {dist.status === 'locked' || dist.status === 'completed' ? (
                                                        <a href={route('distributions.pdf', dist.id)} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-rose-600 hover:text-rose-800 transition-colors">
                                                            Cetak PDF
                                                        </a>
                                                    ) : null}
                                                    <Link href={route('distributions.edit', dist.id)} className="inline-flex items-center text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors group">
                                                        {dist.status === 'draft' ? 'Buka Workspace' : 'Lihat Detail'}
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                                                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

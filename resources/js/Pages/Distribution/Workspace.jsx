import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Workspace({ distribution }) {
    const formSpk = useForm({
        details: distribution.details.map(d => ({
            id: d.id,
            requested_qty: d.requested_qty
        }))
    });

    const formOverride = useForm({
        details: distribution.details.map(d => ({
            id: d.id,
            final_qty: d.final_qty
        }))
    });

    const lockForm = useForm();
    const isDraft = distribution.status === 'draft';

    const handleCalculate = (e) => {
        e.preventDefault();
        formSpk.post(route('distributions.calculate', distribution.id), {
            onSuccess: () => window.location.reload()
        });
    };

    const handleOverride = (e) => {
        e.preventDefault();
        formOverride.post(route('distributions.override', distribution.id));
    };

    const handleLock = () => {
        if(confirm('Kunci manifes ini? Anda tidak akan bisa mengubah angka alokasi lagi.')) {
            lockForm.post(route('distributions.lock', distribution.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 leading-tight">
                        Workspace SPK: {new Date(distribution.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h2>
                    <Link href={route('dashboard')} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                        &larr; Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="SPK Workspace" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                {/* Info Bar */}
                <div className="glass rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border border-white">
                    <div className="flex gap-12">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Stok Pangkalan (S)</p>
                            <p className="text-3xl font-black text-slate-800">{distribution.total_stock} <span className="text-lg font-medium text-slate-500">Tbg</span></p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Alpha Capping (α)</p>
                            <p className="text-3xl font-black text-slate-800">{distribution.alpha_capping}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Status Manifes</p>
                            <p className={`text-2xl font-black uppercase ${isDraft ? 'text-amber-500' : 'text-emerald-600'}`}>{distribution.status}</p>
                        </div>
                    </div>
                    {isDraft && (
                        <div>
                            <DangerButton onClick={handleLock} disabled={lockForm.processing} className="h-12 px-6 shadow-red-500/40">
                                Kunci Manifes Final &rarr;
                            </DangerButton>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* PANEL 1: Input Permintaan */}
                    <div className="glass rounded-2xl overflow-hidden border border-white flex flex-col">
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-5 flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">1. Input Permintaan Harian</h3>
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-white/40">
                            <form onSubmit={handleCalculate} className="flex-1 flex flex-col">
                                <div className="flex-1 overflow-y-auto pr-2 max-h-[500px]">
                                    {distribution.details.map((detail, index) => (
                                        <div key={detail.id} className="flex items-center justify-between mb-4 bg-white/60 p-3 rounded-xl border border-white">
                                            <div>
                                                <p className="font-bold text-slate-800">{detail.warung.name}</p>
                                                <p className="text-xs font-semibold text-slate-500 uppercase">MG: {detail.warung.mg_normal} | MGA: {detail.warung.mg_absolut}</p>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    disabled={!isDraft}
                                                    className="w-full border-gray-200 focus:ring-brand-500 focus:border-brand-500 rounded-lg p-2 text-center font-bold shadow-sm"
                                                    value={formSpk.data.details[index].requested_qty}
                                                    onChange={e => {
                                                        const newDetails = [...formSpk.data.details];
                                                        newDetails[index].requested_qty = e.target.value;
                                                        formSpk.setData('details', newDetails);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {isDraft && (
                                    <PrimaryButton disabled={formSpk.processing} className="w-full mt-6 justify-center h-12 text-base shadow-indigo-500/40">
                                        Jalankan Engine Hybrid ROC-TOPSIS
                                    </PrimaryButton>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* PANEL 2: Hasil Alokasi */}
                    <div className="glass rounded-2xl overflow-hidden border border-brand-200 flex flex-col shadow-2xl shadow-brand-500/10">
                        <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-5 flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight">2. Rekomendasi SPK & Final</h3>
                        </div>
                        <div className="p-6 flex-1 flex flex-col bg-white/60">
                            <form onSubmit={handleOverride} className="flex-1 flex flex-col">
                                <div className="flex-1 overflow-y-auto pr-2 max-h-[500px]">
                                    <div className="grid grid-cols-12 gap-2 mb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <div className="col-span-6">Nama Warung</div>
                                        <div className="col-span-3 text-center">Rek. SPK</div>
                                        <div className="col-span-3 text-center">Override</div>
                                    </div>
                                    {distribution.details.map((detail, index) => (
                                        <div key={detail.id} className="grid grid-cols-12 gap-2 items-center mb-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="col-span-6 pl-2">
                                                <p className="font-bold text-slate-800 line-clamp-1" title={detail.warung.name}>{detail.warung.name}</p>
                                            </div>
                                            <div className="col-span-3 text-center">
                                                <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 font-black rounded-lg w-12 h-10 border border-indigo-100">
                                                    {detail.recommended_qty}
                                                </span>
                                            </div>
                                            <div className="col-span-3">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    disabled={!isDraft}
                                                    className="w-full border-brand-200 focus:ring-brand-500 focus:border-brand-500 rounded-lg p-2 text-center font-black text-brand-700 bg-brand-50"
                                                    value={formOverride.data.details[index].final_qty}
                                                    onChange={e => {
                                                        const newDetails = [...formOverride.data.details];
                                                        newDetails[index].final_qty = e.target.value;
                                                        formOverride.setData('details', newDetails);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Alokasi Final</div>
                                    <div className="text-3xl font-black text-brand-600">
                                        {formOverride.data.details.reduce((sum, item) => sum + Number(item.final_qty), 0)} <span className="text-lg font-bold text-slate-400">Tbg</span>
                                    </div>
                                </div>

                                {isDraft && (
                                    <button 
                                        type="submit" 
                                        disabled={formOverride.processing} 
                                        className="mt-6 w-full flex justify-center items-center rounded-xl border border-transparent bg-slate-800 px-4 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-slate-900 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:scale-95"
                                    >
                                        Simpan Override Manual
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

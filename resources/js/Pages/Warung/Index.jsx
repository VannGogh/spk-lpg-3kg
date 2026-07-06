import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ warungs }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus warung ini?')) {
            destroy(route('warungs.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Warung</h2>}
        >
            <Head title="Mitra Warung" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Daftar Mitra Warung</h3>
                                <Link href={route('warungs.create')}>
                                    <PrimaryButton>Tambah Warung</PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Nama Warung</th>
                                            <th className="px-6 py-3">Alamat</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Kategori (Margin)</th>
                                            <th className="px-6 py-3">Pembayaran</th>
                                            <th className="px-6 py-3">MG / MGA</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {warungs.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-4 text-center">Belum ada data warung.</td>
                                            </tr>
                                        ) : (
                                            warungs.data.map((warung) => (
                                                <tr key={warung.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        {warung.name}
                                                    </td>
                                                    <td className="px-6 py-4">{warung.address || '-'}</td>
                                                    <td className="px-6 py-4">
                                                        {warung.is_active ? (
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Aktif</span>
                                                        ) : (
                                                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Tidak Aktif</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {warung.margin_category === 3 ? 'Kecil (Margin Tinggi)' : 'Besar (Margin Rendah)'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {warung.payment_status === 3 ? 'Lancar' : warung.payment_status === 2 ? 'Kurang Lancar' : 'Tidak Lancar'}
                                                    </td>
                                                    <td className="px-6 py-4">{warung.mg_normal} / {warung.mg_absolut}</td>
                                                    <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                                        <Link href={route('warungs.edit', warung.id)} className="text-blue-600 hover:underline px-2 py-1">Edit</Link>
                                                        <button 
                                                            onClick={() => handleDelete(warung.id)}
                                                            className="text-red-600 hover:underline px-2 py-1"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Simple Pagination */}
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Showing {warungs.from || 0} to {warungs.to || 0} of {warungs.total} entries
                                </span>
                                <div className="flex space-x-1">
                                    {warungs.links.map((link, index) => (
                                        <Link 
                                            key={index} 
                                            href={link.url || '#'}
                                            className={`px-3 py-1 border rounded text-sm ${link.active ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white hover:bg-gray-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

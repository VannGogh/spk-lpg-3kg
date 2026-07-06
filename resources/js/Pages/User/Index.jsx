import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ users }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus pengguna ini?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Pengguna (User)</h2>}
        >
            <Head title="Manajemen User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">Daftar Pengguna</h3>
                                <Link href={route('users.create')}>
                                    <PrimaryButton>Tambah User</PrimaryButton>
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Dibuat Pada</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">Belum ada data user.</td>
                                            </tr>
                                        ) : (
                                            users.data.map((user) => (
                                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        {user.role === 'owner' ? (
                                                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded uppercase">Owner</span>
                                                        ) : (
                                                            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded uppercase">Supir</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                                        <Link href={route('users.edit', user.id)} className="text-blue-600 hover:underline px-2 py-1">Edit</Link>
                                                        <button 
                                                            onClick={() => handleDelete(user.id)}
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
                                    Showing {users.from || 0} to {users.to || 0} of {users.total} entries
                                </span>
                                <div className="flex space-x-1">
                                    {users.links.map((link, index) => (
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

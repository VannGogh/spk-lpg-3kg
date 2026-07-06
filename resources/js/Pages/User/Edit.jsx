import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pengguna</h2>}
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email (Username)" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password (Kosongkan jika tidak ingin mengubah)" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role Pengguna" />
                                <select
                                    id="role"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="owner">Owner (Administrator)</option>
                                    <option value="supir">Supir (Kurir Lapangan)</option>
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Perbarui Data</PrimaryButton>
                                <Link href={route('users.index')} className="text-gray-600 hover:text-gray-900 underline text-sm">
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

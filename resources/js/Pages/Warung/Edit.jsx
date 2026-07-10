import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Edit({ warung }) {
    const { data, setData, put, processing, errors } = useForm({
        name: warung.name,
        address: warung.address || '',
        phone: warung.phone || '',
        hari_distribusi: warung.hari_distribusi || '',
        is_active: warung.is_active,
        payment_status: warung.payment_status,
        margin_category: warung.margin_category,
        mg_normal: warung.mg_normal,
        mg_absolut: warung.mg_absolut,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('warungs.update', warung.id));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Mitra Warung</h2>}
        >
            <Head title="Edit Warung" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            
                            <div>
                                <InputLabel htmlFor="name" value="Nama Warung" />
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
                                <InputLabel htmlFor="address" value="Alamat" />
                                <TextInput
                                    id="address"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="No. Telepon / HP" />
                                <TextInput
                                    id="phone"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="hari_distribusi" value="Hari Distribusi" />
                                <select
                                    id="hari_distribusi"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.hari_distribusi}
                                    onChange={(e) => setData('hari_distribusi', e.target.value)}
                                >
                                    <option value="">Pilih Hari (Opsional)</option>
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                    <option value="Sabtu">Sabtu</option>
                                    <option value="Minggu">Minggu</option>
                                </select>
                                <InputError message={errors.hari_distribusi} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="payment_status" value="Kedisiplinan Pembayaran" />
                                    <select
                                        id="payment_status"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.payment_status}
                                        onChange={(e) => setData('payment_status', parseInt(e.target.value))}
                                    >
                                        <option value={3}>Lancar</option>
                                        <option value={2}>Kurang Lancar</option>
                                        <option value={1}>Tidak Lancar</option>
                                    </select>
                                    <InputError message={errors.payment_status} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="margin_category" value="Kategori Margin Profit" />
                                    <select
                                        id="margin_category"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.margin_category}
                                        onChange={(e) => setData('margin_category', parseInt(e.target.value))}
                                    >
                                        <option value={3}>Kecil (Margin Tinggi)</option>
                                        <option value={1}>Besar (Margin Rendah)</option>
                                    </select>
                                    <InputError message={errors.margin_category} className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="mg_normal" value="Minimum Guarantee (MG)" />
                                    <TextInput
                                        id="mg_normal"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.mg_normal}
                                        onChange={(e) => setData('mg_normal', parseInt(e.target.value))}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.mg_normal} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="mg_absolut" value="Minimum Guarantee Absolut (MGA)" />
                                    <TextInput
                                        id="mg_absolut"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.mg_absolut}
                                        onChange={(e) => setData('mg_absolut', parseInt(e.target.value))}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.mg_absolut} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Status Warung Aktif</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Perbarui Data</PrimaryButton>
                                <Link href={route('warungs.index')} className="text-gray-600 hover:text-gray-900 underline text-sm">
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

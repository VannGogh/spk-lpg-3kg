<?php

namespace App\Http\Controllers;

use App\Models\Warung;
use App\Http\Requests\StoreWarungRequest;
use App\Http\Requests\UpdateWarungRequest;
use Inertia\Inertia;

class WarungController extends Controller
{
    public function index()
    {
        $query = Warung::latest();

        if (request('search')) {
            $query->where('name', 'like', '%' . request('search') . '%');
        }

        if (request('hari_distribusi')) {
            $query->where('hari_distribusi', request('hari_distribusi'));
        }

        return Inertia::render('Warung/Index', [
            'warungs' => $query->paginate(10)->withQueryString(),
            'filters' => request()->only(['search', 'hari_distribusi'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Warung/Create');
    }

    public function store(StoreWarungRequest $request)
    {
        Warung::create($request->validated());
        return redirect()->route('warungs.index')->with('message', 'Data Warung berhasil ditambahkan.');
    }

    public function edit(Warung $warung)
    {
        return Inertia::render('Warung/Edit', [
            'warung' => $warung
        ]);
    }

    public function update(UpdateWarungRequest $request, Warung $warung)
    {
        $warung->update($request->validated());
        return redirect()->route('warungs.index')->with('message', 'Data Warung berhasil diperbarui.');
    }

    public function destroy(Warung $warung)
    {
        $warung->delete();
        return redirect()->route('warungs.index')->with('message', 'Data Warung berhasil dihapus.');
    }
}

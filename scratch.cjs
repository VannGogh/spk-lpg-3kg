const fs = require('fs');

function processFile(path, stateInjection, buttonInjection, buttonTarget) {
    let code = fs.readFileSync(path, 'utf8');
    
    // 1. Inject state
    if (!code.includes('const [showAllCols, setShowAllCols] = useState(false);')) {
        code = code.replace(stateInjection.target, stateInjection.replacement);
    }
    
    // 2. Inject button
    if (!code.includes('setShowAllCols(!showAllCols)')) {
        code = code.replace(buttonTarget, buttonInjection);
    }
    
    // 3. Replace static classes with dynamic template literals
    // Find all className="..." that contain 'hidden md:table-cell'
    code = code.replace(/className="([^"]*)hidden md:table-cell([^"]*)"/g, 'className={`$1${showAllCols ? \'\' : \'hidden md:table-cell\'}$2`}');
    
    fs.writeFileSync(path, code);
}

// 1. Warung Index
processFile(
    'c:/Users/Ivan/Documents/SPK LPG 3KG/App_SPK LPG/core-app/resources/js/Pages/Warung/Index.jsx',
    {
        target: "const [hariDistribusi, setHariDistribusi] = useState(filters?.hari_distribusi || '');",
        replacement: "const [hariDistribusi, setHariDistribusi] = useState(filters?.hari_distribusi || '');\n    const [showAllCols, setShowAllCols] = useState(false);"
    },
    `{/* Table */}\n                        <div className="flex justify-end md:hidden mb-2">\n                            <button onClick={() => setShowAllCols(!showAllCols)} className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">{showAllCols ? 'Ringkas Tabel' : 'Buka Semua Kolom'}</button>\n                        </div>`,
    '{/* Table */}'
);

// 2. Dashboard
let dPath = 'c:/Users/Ivan/Documents/SPK LPG 3KG/App_SPK LPG/core-app/resources/js/Pages/Dashboard.jsx';
let dCode = fs.readFileSync(dPath, 'utf8');
if (!dCode.includes('import { useState }')) {
    dCode = dCode.replace("import { Head, Link, useForm } from '@inertiajs/react';", "import { Head, Link, useForm } from '@inertiajs/react';\nimport { useState } from 'react';");
    fs.writeFileSync(dPath, dCode);
}

processFile(
    dPath,
    {
        target: "export default function Dashboard({ distributions }) {\n    const { data, setData, post, processing, errors } = useForm({",
        replacement: "export default function Dashboard({ distributions }) {\n    const [showAllCols, setShowAllCols] = useState(false);\n    const { data, setData, post, processing, errors } = useForm({"
    },
    `<h3 className="text-xl font-bold text-slate-800">Riwayat Distribusi</h3>\n                            </div>\n                            <button onClick={() => setShowAllCols(!showAllCols)} className="md:hidden text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">{showAllCols ? 'Ringkas' : 'Buka Semua Kolom'}</button>\n                        </div>`,
    `<h3 className="text-xl font-bold text-slate-800">Riwayat Distribusi</h3>\n                            </div>\n                        </div>`
);

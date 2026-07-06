export default function ApplicationLogo(props) {
    return (
        <div {...props} className={`flex items-center gap-2 font-black tracking-tighter ${props.className}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25zM3.265 14.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25z" />
                </svg>
            </div>
            <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                SPK<span className="text-orange-500">LPG</span>
            </span>
        </div>
    );
}

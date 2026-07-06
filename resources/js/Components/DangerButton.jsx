export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-red-500/30 transition-all duration-300 ease-out hover:from-red-600 hover:to-rose-700 hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95 ${
                    disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

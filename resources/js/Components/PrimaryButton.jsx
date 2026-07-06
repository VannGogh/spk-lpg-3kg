export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-md shadow-blue-500/30 transition-all duration-300 ease-out hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-95 ${
                    disabled && 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

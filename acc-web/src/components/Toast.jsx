import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2`}>
            <span className="material-symbols-outlined text-sm">
                {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
            </span>
            {message}
        </div>
    )
}

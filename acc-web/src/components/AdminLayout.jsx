import { useState } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/acc-login" replace />
    }

    return children
}

export default function AdminLayout({ children }) {
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const menuItems = [
        { path: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
        { path: '/admin/trabajos', icon: 'construction', label: 'Trabajos' },
        { path: '/admin/promociones', icon: 'home', label: 'Promociones' },
        { path: '/admin/mensajes', icon: 'mail', label: 'Mensajes' },
    ]

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path
        return location.pathname.startsWith(item.path)
    }

    return (
        <div className="min-h-screen bg-dark font-body">
            <Header isAdmin={true} />
            <div className="flex pt-[80px]">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-dark border-r border-gray-800 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item)
                                    ? 'bg-primary text-white font-bold shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden fixed bottom-4 left-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
                >
                    <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                </button>

                {/* Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-30"
                        style={{ top: '65px' }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-65px)]">
                    {children}
                </main>
            </div>
        </div>
    )
}

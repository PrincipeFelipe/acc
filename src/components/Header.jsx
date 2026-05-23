import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Quiénes Somos", path: "/quienes-somos" },
    { name: "Servicios", path: "/servicios" },
    { name: "Obra Civil", path: "/obra-civil" },
    { name: "Obras", path: "/trabajos" },
    { name: "Promociones", path: "/promociones" },
    { name: "Contacto", path: "/contacto" },
]

export default function Header({ isAdmin = false }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, signOut } = useAuth()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location])

    const isHome = location.pathname === '/'

    // Header styling logic
    const headerBg = isAdmin
        ? "bg-surface-dark border-b border-gray-800"
        : (scrolled || !isHome || mobileMenuOpen)
            ? "bg-white/95 backdrop-blur-md shadow-sm dark:bg-surface-dark/95 dark:border-b dark:border-gray-800"
            : "bg-transparent"

    const textColor = isAdmin
        ? "text-white"
        : (scrolled || !isHome || mobileMenuOpen)
            ? "text-dark dark:text-white"
            : "text-white"

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${headerBg}`}>
            <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className={`flex items-center justify-center rounded-lg transition-all duration-500 ${isAdmin || scrolled || !isHome
                        ? 'size-10 bg-primary'
                        : 'size-12 bg-white/10 backdrop-blur border border-white/20'
                        }`}>
                        <span className={`material-symbols-outlined transition-colors duration-300 ${isAdmin || scrolled || !isHome ? 'text-white' : 'text-white'
                            }`}>foundation</span>
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-bold font-display tracking-tight transition-colors duration-300 ${textColor}`}>
                            ACC Construcción
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {!isAdmin && NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium tracking-wide transition-all duration-300 hover:text-primary relative group ${textColor}`}
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200/20">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className={`text-sm opacity-70 ${textColor}`}>
                                    Hola, Admin
                                </span>
                                {isAdmin ? (
                                    <Link to="/" className="text-sm text-primary hover:text-white transition-colors">Ver Web</Link>
                                ) : (
                                    <Link to="/admin" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30">
                                        Panel Admin
                                    </Link>
                                )}
                                <button
                                    onClick={signOut}
                                    className={`p-2 rounded-full transition-colors ${isAdmin || scrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'}`}
                                    title="Cerrar sesión"
                                >
                                    <span className={`material-symbols-outlined ${textColor}`}>logout</span>
                                </button>
                            </div>
                        ) : (
                            isAdmin && <span className={`text-sm ${textColor}`}>Modo Admin</span>
                        )}

                        {!user && !isAdmin && location.pathname !== '/acc-login' && (
                            <Link
                                to="/contacto"
                                className={`hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 ${scrolled || !isHome
                                    ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/20'
                                    : 'bg-white text-dark hover:bg-gray-100 shadow-black/10'
                                    }`}
                            >
                                <span>Solicitar Presupuesto</span>
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 transition-colors duration-300 ${textColor}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="material-symbols-outlined text-3xl">
                        {mobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-surface-dark transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`} style={{ top: '80px', height: 'calc(100vh - 80px)' }}>
                <nav className="flex flex-col p-8 gap-6 h-full overflow-y-auto">
                    {NAV_LINKS.map((link, i) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-2xl font-bold font-display text-dark dark:text-white hover:text-primary transition-colors border-b border-gray-100 dark:border-gray-800 pb-4"
                            style={{ transitionDelay: `${i * 100}ms` }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <>
                            <Link to="/admin" className="text-xl font-bold text-primary pt-4">Panel Admin</Link>
                            <button onClick={() => { signOut(); setMobileMenuOpen(false) }} className="text-xl font-medium text-red-500 text-left">Cerrar Sesión</button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}

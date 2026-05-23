import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/AdminLayout'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ trabajos: 0, promociones: 0, mensajes: 0, noLeidos: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const [trabajosRes, promocionesRes, mensajesRes, noLeidosRes] = await Promise.all([
            supabase.from('trabajos').select('id', { count: 'exact', head: true }),
            supabase.from('promociones').select('id', { count: 'exact', head: true }).eq('activa', true),
            supabase.from('mensajes_contacto').select('id', { count: 'exact', head: true }),
            supabase.from('mensajes_contacto').select('id', { count: 'exact', head: true }).eq('leido', false)
        ])

        setStats({
            trabajos: trabajosRes.count || 0,
            promociones: promocionesRes.count || 0,
            mensajes: mensajesRes.count || 0,
            noLeidos: noLeidosRes.count || 0
        })
        setLoading(false)
    }

    const statCards = [
        { label: 'Trabajos Publicados', value: stats.trabajos, icon: 'construction', color: 'bg-blue-500' },
        { label: 'Promociones Activas', value: stats.promociones, icon: 'home', color: 'bg-green-500' },
        { label: 'Total Mensajes', value: stats.mensajes, icon: 'mail', color: 'bg-purple-500' },
        { label: 'Mensajes Sin Leer', value: stats.noLeidos, icon: 'mark_email_unread', color: 'bg-orange-500' },
    ]

    return (
        <AdminLayout>
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-display font-bold text-white mb-2">Panel de Administración</h1>
                <p className="text-gray-400 font-light">Bienvenido al panel de control de ACC Construcción</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-surface-dark rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors shadow-lg"
                            data-aos="fade-up"
                            data-aos-delay={i * 100}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`size-12 ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                                    <span className="material-symbols-outlined text-white text-2xl">{card.icon}</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-white mb-1">{card.value}</h3>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Link to="/admin/trabajos" className="bg-surface-dark rounded-xl p-6 border border-gray-800 hover:border-primary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">add_circle</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Nuevo Trabajo</h3>
                            <p className="text-gray-400 text-sm">Añadir un proyecto u obra nueva</p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/promociones" className="bg-surface-dark rounded-xl p-6 border border-gray-800 hover:border-primary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <span className="material-symbols-outlined text-green-500 group-hover:text-white text-3xl transition-colors">add_home</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Nueva Promoción</h3>
                            <p className="text-gray-400 text-sm">Publicar una promoción inmobiliaria</p>
                        </div>
                    </div>
                </Link>
            </div>
        </AdminLayout>
    )
}

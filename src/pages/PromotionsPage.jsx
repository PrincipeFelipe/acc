import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import PromotionCard from '../components/PromotionCard'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function PromotionsPage() {
    const [promociones, setPromociones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('promociones')
            .select('*')
            .eq('activa', true)
            .order('destacada', { ascending: false })

        if (data) setPromociones(data)
        setLoading(false)
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <PageHeader
                title="Promociones"
                subtitle="Encuentra tu próximo hogar. Calidad constructiva y diseño vanguardista."
                image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653"
            />

            <main className="flex-grow py-20 px-6 md:px-12 bg-gray-50">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : promociones.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <span className="material-symbols-outlined text-6xl mb-4 block opacity-50">home_work</span>
                            <p className="text-xl">No hay promociones activas actualmente.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {promociones.map((promo, i) => (
                                <PromotionCard key={promo.id} promo={promo} delay={i * 100} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

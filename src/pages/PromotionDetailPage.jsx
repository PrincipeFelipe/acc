import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import PromotionCard from '../components/PromotionCard'
import Toast from '../components/Toast'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function PromotionDetailPage() {
    const { id } = useParams()
    const [promo, setPromo] = useState(null)
    const [relatedPromos, setRelatedPromos] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({ nombre: '', email: '', mensaje: '' })
    const [sending, setSending] = useState(false)
    const [toast, setToast] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        const finalMensaje = `[Consulta Promoción: ${promo.titulo}] ${formData.mensaje}`
        const { error } = await supabase.from('mensajes_contacto').insert([{
            nombre: formData.nombre,
            email: formData.email,
            telefono: '',
            mensaje: finalMensaje
        }])

        if (error) {
            setToast({ message: 'Error al enviar. Inténtalo de nuevo.', type: 'error' })
        } else {
            setToast({ message: 'Mensaje enviado correctamente.', type: 'success' })
            setFormData({ nombre: '', email: '', mensaje: '' })
        }
        setSending(false)
    }

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
        loadPromo()
    }, [id])

    const loadPromo = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('promociones')
            .select('*')
            .eq('id', id)
            .single()

        if (data) {
            setPromo(data)
            // Fetch related promotions
            const { data: related } = await supabase
                .from('promociones')
                .select('*')
                .eq('activa', true)
                .neq('id', id)
                .limit(3)

            if (related) setRelatedPromos(related)
        }
        setLoading(false)
    }

    const getTagColor = (color) => {
        const colors = {
            blue: 'bg-primary text-white',
            green: 'bg-green-500 text-white',
            red: 'bg-red-500 text-white',
            gray: 'bg-gray-500 text-white',
            yellow: 'bg-yellow-500 text-white',
        }
        return colors[color] || colors.blue
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!promo) {
        return (
            <div className="min-h-screen bg-white text-center pt-32">
                <Header />
                <h2 className="text-2xl font-bold">Promoción no encontrada</h2>
                <Link to="/promociones" className="text-primary hover:underline mt-4 inline-block">Volver a promociones</Link>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <Header />
            <PageHeader
                title={promo.titulo}
                subtitle={promo.ubicacion}
                image={promo.imagen_url}
            />

            <main className="flex-grow py-20 px-6 md:px-12 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Gallery/Main Area */}
                        <div className="lg:w-2/3" data-aos="fade-right">
                            <div className="relative mb-12 aspect-video overflow-hidden rounded-sm shadow-xl">
                                <img src={promo.imagen_url} alt={promo.titulo} className="w-full h-full object-cover" />
                                {promo.etiqueta && (
                                    <div className={`absolute top-6 left-6 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded shadow-lg ${getTagColor(promo.etiqueta_color)}`}>
                                        {promo.etiqueta}
                                    </div>
                                )}
                            </div>

                            <h2 className="font-display text-4xl font-bold text-dark mb-6">Descripción</h2>
                            <div className="prose prose-lg text-gray-500 max-w-none leading-relaxed whitespace-pre-wrap">
                                {promo.descripcion}
                            </div>

                            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 py-10 border-y border-gray-100">
                                {promo.habitaciones && (
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-primary mb-2">bed</span>
                                        <p className="text-dark font-bold text-xl">{promo.habitaciones}</p>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest">Habitaciones</p>
                                    </div>
                                )}
                                {promo.banos && (
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-primary mb-2">shower</span>
                                        <p className="text-dark font-bold text-xl">{promo.banos}</p>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest">Baños</p>
                                    </div>
                                )}
                                {promo.metros_cuadrados && (
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-3xl text-primary mb-2">square_foot</span>
                                        <p className="text-dark font-bold text-xl">{promo.metros_cuadrados}</p>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest">Superficie</p>
                                    </div>
                                )}
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-3xl text-primary mb-2">location_on</span>
                                    <p className="text-dark font-bold text-xl">{promo.ubicacion?.split(',')[0]}</p>
                                    <p className="text-gray-400 text-xs uppercase tracking-widest">Ubicación</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="lg:w-1/3" data-aos="fade-left">
                            <div className="bg-gray-50 p-8 md:p-10 sticky top-28 border border-gray-100">
                                <div className="mb-8">
                                    <span className="text-gray-400 text-xs uppercase tracking-widest block mb-1">Precio desde</span>
                                    <p className="text-primary font-display text-4xl font-bold">{promo.precio || 'Consultar'}</p>
                                </div>

                                <h4 className="text-dark font-display font-bold text-xl mb-6">Solicitar más información</h4>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Nombre completo" 
                                        required
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        className="w-full p-4 bg-white border border-gray-200 outline-none focus:border-primary transition-colors" 
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Correo electrónico" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 bg-white border border-gray-200 outline-none focus:border-primary transition-colors" 
                                    />
                                    <textarea 
                                        placeholder="Mensaje" 
                                        rows="4" 
                                        required
                                        value={formData.mensaje}
                                        onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                                        className="w-full p-4 bg-white border border-gray-200 outline-none focus:border-primary transition-colors resize-none"
                                    ></textarea>
                                    <button 
                                        type="submit"
                                        disabled={sending}
                                        className="w-full bg-primary text-white font-bold py-4 uppercase tracking-widest hover:bg-dark transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
                                    >
                                        {sending ? 'Enviando...' : 'Enviar Consulta'}
                                    </button>
                                </form>

                                <p className="text-gray-400 text-xs mt-6 text-center leading-relaxed">
                                    Al enviar este formulario, aceptas nuestra política de privacidad y tratamiento de datos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Map Section */}
            {promo.ubicacion && (
                <section className="py-20 bg-gray-50 overflow-hidden" data-aos="fade-up">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Explora el entorno" subtitle={promo.ubicacion} />
                        <div className="mt-12 h-[450px] w-full rounded-xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                title="Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(promo.ubicacion)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Promotions Section */}
            {relatedPromos.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Promociones Similares" subtitle="Otras oportunidades inmobiliarias que podrían interesarte." />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {relatedPromos.map((relatedPromo, idx) => (
                                <PromotionCard key={relatedPromo.id} promo={relatedPromo} delay={idx * 150} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    )
}

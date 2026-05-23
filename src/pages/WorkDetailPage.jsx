import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import ProjectCard from '../components/ProjectCard'
import SectionTitle from '../components/SectionTitle'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function WorkDetailPage() {
    const { id } = useParams()
    const [work, setWork] = useState(null)
    const [relatedWorks, setRelatedWorks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
        loadWork()
    }, [id])

    const loadWork = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('trabajos')
            .select('*, categorias(nombre), trabajo_imagenes(*)')
            .eq('id', id)
            .single()

        if (data) {
            setWork(data)
            // Fetch related projects in the same category
            const { data: related } = await supabase
                .from('trabajos')
                .select('*, categorias(nombre), trabajo_imagenes(*)')
                .eq('categoria_id', data.categoria_id)
                .neq('id', id)
                .limit(3)

            if (related) setRelatedWorks(related)
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!work) {
        return (
            <div className="min-h-screen bg-white">
                <Header />
                <div className="pt-32 text-center">
                    <h2 className="text-2xl font-bold">Obra no encontrada</h2>
                    <Link to="/trabajos" className="text-primary hover:underline mt-4 inline-block">Volver al portafolio</Link>
                </div>
            </div>
        )
    }

    const mainImage = work.trabajo_imagenes?.find(img => img.es_principal)?.url || work.trabajo_imagenes?.[0]?.url

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <PageHeader
                title={work.titulo}
                subtitle={work.categorias?.nombre}
                image={mainImage}
            />

            <main className="flex-grow py-20 px-6 md:px-12 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Info Column */}
                        <div className="lg:w-1/3" data-aos="fade-right">
                            <div className="sticky top-28">
                                <div className="mb-10">
                                    <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Categoría</span>
                                    <p className="text-dark font-display text-xl font-bold">{work.categorias?.nombre}</p>
                                </div>

                                {work.ubicacion && (
                                    <div className="mb-10">
                                        <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Ubicación</span>
                                        <p className="text-dark font-display text-xl font-bold">{work.ubicacion}</p>
                                    </div>
                                )}

                                <div className="mb-10">
                                    <span className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Fecha del Proyecto</span>
                                    <p className="text-dark font-display text-xl font-bold">
                                        {new Date(work.created_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-10">
                                    <Link
                                        to="/contacto"
                                        className="inline-block bg-dark text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-primary transition-all duration-300 w-full text-center"
                                    >
                                        Consultar sobre esta obra
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:w-2/3" data-aos="fade-left">
                            <h2 className="font-display text-3xl font-bold text-dark mb-8">Descripción del Proyecto</h2>
                            <div className="prose prose-lg text-gray-500 max-w-none mb-16">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {work.descripcion || 'Sin descripción detallada disponible.'}
                                </p>
                            </div>

                            {/* Gallery */}
                            {work.trabajo_imagenes?.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                                    {work.trabajo_imagenes.map((img, idx) => (
                                        <div
                                            key={img.id}
                                            className="overflow-hidden aspect-[4/3] group cursor-pointer"
                                            data-aos="fade-up"
                                            data-aos-delay={idx * 100}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`${work.titulo} ${idx + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Map Section */}
            {work.ubicacion && (
                <section className="py-20 bg-gray-50 overflow-hidden" data-aos="fade-up">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Ubicación del Proyecto" subtitle={work.ubicacion} />
                        <div className="mt-12 h-[450px] w-full rounded-xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
                            <iframe
                                title="Map"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(work.ubicacion)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            ></iframe>
                        </div>
                    </div>
                </section>
            )}

            {/* Related Projects Section */}
            {relatedWorks.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Proyectos Relacionados" subtitle="Otras obras en la categoría de edificación y reformas." />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {relatedWorks.map((relatedWork, idx) => (
                                <ProjectCard key={relatedWork.id} project={relatedWork} delay={idx * 150} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Navigation Footer */}
            <section className="py-12 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link to="/trabajos" className="flex items-center gap-2 text-gray-400 hover:text-dark transition-colors font-bold uppercase tracking-widest text-sm">
                        <span className="material-symbols-outlined">west</span>
                        Volver a Obras
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

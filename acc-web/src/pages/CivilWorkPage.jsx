import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import ProjectCard from '../components/ProjectCard'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function CivilWorkPage() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
        loadCivilProjects()
    }, [])

    const loadCivilProjects = async () => {
        setLoading(true)
        // 1. Get the category ID for "Obra Civil"
        const { data: catData } = await supabase
            .from('categorias')
            .select('id')
            .eq('nombre', 'Obra Civil')
            .single()

        if (catData) {
            // 2. Fetch projects of that category
            const { data } = await supabase
                .from('trabajos')
                .select('*, categorias(nombre), trabajo_imagenes(*)')
                .eq('categoria_id', catData.id)
                .order('created_at', { ascending: false })

            if (data) setProjects(data)
        }
        setLoading(false)
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <PageHeader
                title="Obra Civil"
                subtitle="Infraestructuras que transforman territorios y mejoran la movilidad."
                image="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
            />

            <main className="flex-grow">
                {/* Introduction */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div data-aos="fade-right">
                                <SectionTitle title="Ingeniería de vanguardia" subtitle="Diseñamos y ejecutamos proyectos de alta complejidad técnica." />
                                <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                    <p>
                                        La obra civil es el corazón de nuestra capacidad técnica. Contamos con un departamento de ingeniería especializado en soluciones complejas para infraestructuras públicas y privadas.
                                    </p>
                                    <p>
                                        Nuestra experiencia abarca desde la construcción de viaductos y puentes hasta la urbanización integral de nuevos sectores residenciales e industriales, incluyendo todos los servicios de saneamiento y pavimentación.
                                    </p>
                                    <ul className="space-y-4 mt-8">
                                        {[
                                            'Carreteras y accesos',
                                            'Puentes y estructuras de hormigón',
                                            'Urbanizaciones completas',
                                            'Canalizaciones y redes de abastecimiento'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-dark font-bold font-display">
                                                <span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="relative" data-aos="fade-left">
                                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" alt="Civil work" className="rounded-sm shadow-2xl" />
                                <div className="absolute -bottom-10 -right-10 bg-white p-10 shadow-2xl hidden lg:block border border-gray-100">
                                    <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Compromiso</p>
                                    <p className="text-dark font-display text-2xl font-bold">Resiliencia y <br /><span className="text-primary italic">Seguridad</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Nuestro Portafolio de Obra Civil" subtitle="Proyectos que demuestran nuestra solvencia técnica en el terreno." />

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : projects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                                {projects.map((project, i) => (
                                    <ProjectCard key={project.id} project={project} delay={i * 100} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-400 italic">
                                No se han encontrado proyectos registrados en esta categoría.
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 bg-dark text-white text-center">
                    <div className="container mx-auto px-6 max-w-3xl" data-aos="zoom-in">
                        <h2 className="font-display text-4xl font-bold mb-6">¿Tienes un proyecto de infraestructura?</h2>
                        <p className="text-gray-400 text-lg mb-10">Nuestro equipo técnico está preparado para analizar la viabilidad y ejecución de tu próxima obra civil.</p>
                        <a href="/contacto" className="inline-block bg-primary text-white px-10 py-5 font-bold uppercase tracking-widest hover:bg-white hover:text-dark transition-all duration-300">
                            Consultar con Ingeniería
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

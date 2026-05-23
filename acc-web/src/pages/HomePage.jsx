import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import HeroSlider from '../components/HeroSlider'
import SectionTitle from '../components/SectionTitle'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import AOS from 'aos'
import 'aos/dist/aos.css'

const SERVICES = [
    { icon: "apartment", title: "Edificación", desc: "Construcción de edificios residenciales y comerciales de alta calidad." },
    { icon: "home_repair_service", title: "Mantenimientos", desc: "Servicios preventivos y correctivos para infraestructuras." },
    { icon: "water_drop", title: "Saneamiento", desc: "Gestión de aguas, alcantarillado y plantas de tratamiento." },
    { icon: "engineering", title: "Obras Públicas", desc: "Desarrollo de carreteras, puentes y espacios públicos." },
    { icon: "park", title: "Medioambientales", desc: "Proyectos de recuperación de paisajes y sostenibilidad." },
    { icon: "construction", title: "Reformas", desc: "Rehabilitación integral de espacios interiores y fachadas." },
]

export default function HomePage() {
    const [stats, setStats] = useState({ years: 30, projects: 500, team: 50 })
    const [recentProjects, setRecentProjects] = useState([])

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 50 })
        loadRecentProjects()
    }, [])

    const loadRecentProjects = async () => {
        const { data } = await supabase
            .from('trabajos')
            .select('*, categorias(nombre), trabajo_imagenes(url)')
            .eq('destacado', true)
            .limit(3)
            .order('created_at', { ascending: false })

        if (data && data.length > 0) {
            setRecentProjects(data)
        }
    }

    return (
        <div className="bg-white overflow-x-hidden">
            <HeroSlider />

            {/* About Section - Arch Pro Style */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <div className="lg:w-1/2 relative" data-aos="fade-right">
                            <div className="relative z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2670&auto=format&fit=crop"
                                    alt="About ACC"
                                    className="rounded-sm shadow-2xl w-full max-w-lg mx-auto lg:mx-0"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gray-100 rounded-full z-0 hidden lg:block" />
                            <div className="absolute -top-10 -left-10 w-32 h-32 border-4 border-primary/20 z-20 hidden lg:block" />
                        </div>

                        <div className="lg:w-1/2" data-aos="fade-left">
                            <h4 className="font-display font-bold text-primary uppercase tracking-widest text-sm mb-4">Sobre Nosotros</h4>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-dark mb-8 leading-tight">
                                Construimos tus sueños con <span className="text-primary italic">Excelencia</span>
                            </h2>
                            <p className="font-body text-lg text-gray-500 mb-6 leading-relaxed">
                                En ACC Construcción, combinamos más de 30 años de experiencia con las técnicas más innovadoras del sector. Nos especializamos en crear espacios que no solo cumplen una función, sino que inspiran.
                            </p>
                            <p className="font-body text-lg text-gray-500 mb-10 leading-relaxed">
                                Nuestro compromiso con la calidad y la sostenibilidad nos ha convertido en un referente en la edificación y obra civil.
                            </p>

                            <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-8">
                                <div>
                                    <span className="font-display text-4xl font-bold text-dark block mb-1">30+</span>
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Años</span>
                                </div>
                                <div>
                                    <span className="font-display text-4xl font-bold text-dark block mb-1">500+</span>
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Proyectos</span>
                                </div>
                                <div>
                                    <span className="font-display text-4xl font-bold text-dark block mb-1">100%</span>
                                    <span className="text-sm text-gray-400 font-medium uppercase tracking-wide">Calidad</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 md:py-32 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12">
                    <SectionTitle
                        title="Nuestros Servicios"
                        subtitle="Soluciones integrales para cada etapa de tu proyecto, desde el diseño hasta la ejecución final."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {SERVICES.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.desc}
                                delay={index * 100}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects with Parallax Background */}
            <section className="py-20 md:py-32 relative">
                <div className="absolute inset-0 bg-dark z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2670&auto=format&fit=crop')] bg-fixed bg-cover bg-center opacity-10"></div>
                </div>

                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <SectionTitle
                        title="Proyectos Destacados"
                        subtitle="Una selección de nuestras obras más emblemáticas que definen nuestro estándar de calidad."
                        dark={true}
                    />

                    {recentProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                            {recentProjects.map((project, i) => (
                                <ProjectCard key={project.id} project={project} delay={i * 150} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400">Cargando proyectos destacados...</p>
                        </div>
                    )}

                    <div className="text-center mt-16" data-aos="fade-up">
                        <Link to="/trabajos" className="inline-flex items-center gap-2 px-8 py-4 border border-white text-white hover:bg-white hover:text-dark transition-all duration-300 font-bold uppercase tracking-widest">
                            Ver Todos los Proyectos
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center" data-aos="zoom-in">
                    <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">¿Listo para construir tu visión?</h2>
                    <p className="font-body text-xl text-white/90 max-w-2xl mx-auto mb-10">
                        Hablemos sobre tu próximo proyecto. Nuestro equipo de expertos está listo para asesorarte.
                    </p>
                    <Link to="/contacto" className="inline-block bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:bg-gray-100 transition-all transform hover:-translate-y-1">
                        Contáctanos Hoy
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

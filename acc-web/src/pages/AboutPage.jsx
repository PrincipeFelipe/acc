import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AboutPage() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true })
    }, [])

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <PageHeader
                title="Quiénes Somos"
                subtitle="Más de tres décadas construyendo el futuro de nuestra comunidad."
                image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
            />

            <main className="flex-grow">
                {/* Historia Section */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/2" data-aos="fade-right">
                                <SectionTitle title="Nuestra Trayectoria" subtitle="Desde 1994, ACC Construcción ha sido sinónimo de fiabilidad y excelencia técnica." />
                                <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                    <p>
                                        Lo que comenzó como una pequeña empresa familiar se ha convertido en una de las constructoras de referencia en la región. Nuestra filosofía se basa en el compromiso absoluto con el cliente y el respeto por los estándares más exigentes de calidad.
                                    </p>
                                    <p>
                                        A lo largo de los años, hemos diversificado nuestras áreas de actuación, abarcando desde la edificación residencial de lujo hasta grandes proyectos de infraestructura y obra pública, manteniendo siempre el mismo nivel de detalle y pasión en cada ladrillo puesto.
                                    </p>
                                </div>
                            </div>
                            <div className="lg:w-1/2" data-aos="fade-left">
                                <div className="grid grid-cols-2 gap-4">
                                    <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" alt="Obra" className="rounded-sm shadow-xl" />
                                    <img src="https://images.unsplash.com/photo-1504307651254-35680f3366d4?q=80&w=2070" alt="Equipo" className="rounded-sm shadow-xl mt-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Valores Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 md:px-12">
                        <SectionTitle title="Nuestros Valores" subtitle="Los pilares que sostienen cada proyecto que emprendemos." center={true} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                            {[
                                { icon: 'verified', title: 'Calidad Impecable', desc: 'No aceptamos menos que la perfección en los acabados y la estructura de nuestras obras.' },
                                { icon: 'schedule', title: 'Cumplimiento', desc: 'Respetamos los plazos acordados. Tu tiempo es tan valioso como nuestra reputación.' },
                                { icon: 'eco', title: 'Sostenibilidad', desc: 'Incorparamos materiales y procesos que minimizan el impacto ambiental de nuestras construcciones.' }
                            ].map((valor, i) => (
                                <div key={i} className="bg-white p-10 text-center shadow-sm hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay={i * 100}>
                                    <span className="material-symbols-outlined text-5xl text-primary mb-6">{valor.icon}</span>
                                    <h3 className="font-display text-xl font-bold text-dark mb-4">{valor.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{valor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team / Stats */}
                <section className="py-20 md:py-32">
                    <div className="container mx-auto px-6 md:px-12 text-center">
                        <SectionTitle title="En Cifras" subtitle="Nuestra experiencia se traduce en resultados tangibles." center={true} />

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                            {[
                                { val: '25+', label: 'Años de Experiencia' },
                                { val: '150+', label: 'Obras Civil' },
                                { val: '400+', label: 'Viviendas' },
                                { val: '50+', label: 'Premios y Menciones' }
                            ].map((stat, i) => (
                                <div key={i} className="" data-aos="zoom-in" data-aos-delay={i * 100}>
                                    <p className="text-5xl md:text-6xl font-display font-bold text-primary mb-2">{stat.val}</p>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

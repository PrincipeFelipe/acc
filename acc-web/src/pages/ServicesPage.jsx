import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import SectionTitle from '../components/SectionTitle'
import ServiceCard from '../components/ServiceCard'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

const DETAILED_SERVICES = [
    {
        icon: "apartment",
        title: "Edificación Residencial",
        desc: "Construimos hogares que combinan diseño contemporáneo con eficiencia energética. Desde chalets exclusivos hasta complejos residenciales de alta densidad.",
        features: ["Diseño personalizado", "Acabados de lujo", "Aislamiento premium", "Llave en mano"]
    },
    {
        icon: "engineering",
        title: "Obra Civil e Infraestructura",
        desc: "Expertos en la ejecución de proyectos a gran escala que conectan y mejoran la vida de las personas: carreteras, puentes y urbanizaciones.",
        features: ["Gestión integral", "Maquinaria propia", "Seguridad laboral", "Ingeniería avanzada"]
    },
    {
        icon: "construction",
        title: "Reformas e Interiorismo",
        desc: "Transformamos espacios existentes para adaptarlos a las nuevas necesidades. Especialistas en rehabilitación de fachadas y renovación total de interiores.",
        features: ["Optimización de espacios", "Materiales modernos", "Rapidez de ejecución", "Garantía post-obra"]
    },
    {
        icon: "home_repair_service",
        title: "Mantenimiento Industrial",
        desc: "Servicios preventivos y correctivos para naves, plantas industriales y edificios públicos, garantizando su pleno funcionamiento y seguridad.",
        features: ["Atención inmediata", "Mantenimiento preventivo", "Sustitución de cubiertas", "Refuerzos estructurales"]
    },
    {
        icon: "park",
        title: "Medio Ambiente y Paisajismo",
        desc: "Proyectos centrados en la recuperación de entornos naturales y la creación de espacios urbanos sostenibles y zonas verdes.",
        features: ["Riego eficiente", "Especies autóctonas", "Drenajes sostenibles", "Restauración de taludes"]
    },
    {
        icon: "water_drop",
        title: "Saneamiento y Aguas",
        desc: "Infraestructuras críticas para el ciclo del agua: desde tuberías de gran diámetro hasta plantas de tratamiento y sistemas de depuración.",
        features: ["Detección de fugas", "Equipos especializados", "Certificaciones oficiales", "Mobiliario urbano"]
    }
]

export default function ServicesPage() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true })
    }, [])

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <PageHeader
                title="Servicios"
                subtitle="Capacidad técnica y compromiso para llevar a cabo cualquier desafío constructivo."
                image="https://images.unsplash.com/photo-1504307651254-35680f3366d4?q=80&w=2670"
            />

            <main className="flex-grow">
                {/* Intro Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
                        <SectionTitle title="Nuestra Especialización" subtitle="Ofrecemos un abanico completo de soluciones constructivas bajo un mismo estándar de excelencia." center={true} />
                        <p className="text-gray-500 text-lg mt-8 leading-relaxed">
                            Gracias a nuestro equipo multidisciplinar y a una flota propia de maquinaria de última generación, podemos abordar proyectos de diversa complejidad técnica, manteniendo siempre el control total sobre la calidad y los plazos.
                        </p>
                    </div>
                </section>

                {/* Detailed Services Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {DETAILED_SERVICES.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 md:p-12 flex flex-col md:flex-row gap-8 shadow-sm hover:shadow-2xl transition-all duration-500 group border-b-4 border-transparent hover:border-primary"
                                    data-aos="fade-up"
                                    data-aos-delay={idx * 50}
                                >
                                    <div className="md:w-16">
                                        <span className="material-symbols-outlined text-6xl text-primary/30 group-hover:text-primary transition-colors duration-500">{s.icon}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-display text-2xl font-bold text-dark mb-4">{s.title}</h3>
                                        <p className="text-gray-500 leading-relaxed mb-6">
                                            {s.desc}
                                        </p>
                                        <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                                            {s.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-dark font-medium uppercase tracking-tight">
                                                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Method Section */}
                <section className="py-20 md:py-32 bg-dark text-white overflow-hidden">
                    <div className="container mx-auto px-6 md:px-12">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2" data-aos="fade-right">
                                <span className="text-primary font-bold uppercase tracking-widest text-sm block mb-4">Metodología ACC</span>
                                <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">¿Cómo trabajamos?</h2>
                                <div className="space-y-8">
                                    {[
                                        { n: '01', t: 'Planificación Estratégica', d: 'Analizamos cada detalle antes de mover la primera piedra para evitar imprevistos.' },
                                        { n: '02', t: 'Ejecución Rigurosa', d: 'Supervisión constante por ingenieros y arquitectos en pie de obra.' },
                                        { n: '03', t: 'Entrega y Garantía', d: 'Seguimiento exhaustivo tras la finalización para asegurar la satisfacción total.' }
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-6">
                                            <span className="font-display text-3xl font-bold text-primary/50">{step.n}</span>
                                            <div>
                                                <h4 className="font-bold text-xl mb-2">{step.t}</h4>
                                                <p className="text-gray-400">{step.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 relative" data-aos="fade-left">
                                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" alt="Obra" className="rounded-sm shadow-2xl brightness-75" />
                                <div className="absolute -bottom-10 -left-10 bg-primary p-12 hidden md:block">
                                    <p className="text-white font-display text-4xl font-bold italic">ISO 9001</p>
                                    <p className="text-white/80 text-sm uppercase font-bold tracking-widest">Calidad Certificada</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

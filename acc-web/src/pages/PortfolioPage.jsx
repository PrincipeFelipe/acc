import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import PageHeader from '../components/PageHeader'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function PortfolioPage() {
    const [trabajos, setTrabajos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [filter, setFilter] = useState('Todos')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [trabajosRes, catRes] = await Promise.all([
            supabase.from('trabajos').select('*, categorias(nombre), trabajo_imagenes(url)').order('created_at', { ascending: false }),
            supabase.from('categorias').select('nombre').order('nombre')
        ])

        if (trabajosRes.data) setTrabajos(trabajosRes.data)
        if (catRes.data) setCategorias(['Todos', ...catRes.data.map(c => c.nombre)])
        setLoading(false)
    }

    const filteredProjects = filter === 'Todos'
        ? trabajos
        : trabajos.filter(t => t.categorias?.nombre === filter)

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <PageHeader
                title="Nuestra Obra"
                subtitle="Explora nuestra colección de proyectos realizados con pasión y precisión técnica."
                image="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2670"
            />

            <main className="flex-grow py-20 px-6 md:px-12 bg-gray-50">
                <div className="container mx-auto">
                    {/* Filter List */}
                    <div className="flex flex-wrap justify-center gap-4 mb-16" data-aos="fade-up">
                        {categorias.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${filter === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 transform -translate-y-1'
                                        : 'bg-white text-gray-500 hover:bg-white hover:text-dark hover:shadow-md'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, i) => (
                                <ProjectCard key={project.id} project={project} delay={i * 100} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No hay proyectos en esta categoría.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

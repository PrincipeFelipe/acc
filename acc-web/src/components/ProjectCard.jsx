import { Link } from 'react-router-dom'

export default function ProjectCard({ project, delay = 0 }) {
    // Handle both local "const" data and Supabase data structure
    const image = project.image || project.imagen_url || (project.trabajo_imagenes && project.trabajo_imagenes[0]?.url)
    const category = project.category || (project.categorias && project.categorias.nombre) || 'General'

    return (
        <Link
            to={`/trabajos/${project.id}`}
            className="group relative block aspect-[4/5] overflow-hidden bg-gray-200 cursor-pointer"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <img
                src={image}
                alt={project.titulo || project.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-primary">
                    {category}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                    {project.titulo || project.title}
                </h3>
                <p className="font-body text-sm text-gray-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 line-clamp-2">
                    {project.descripcion || project.description}
                </p>
            </div>
        </Link>
    )
}

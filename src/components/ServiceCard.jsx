export default function ServiceCard({ icon, title, description, delay = 0 }) {
    return (
        <div
            className="bg-white p-8 group hover:-translate-y-2 transition-transform duration-300 border border-gray-100 hover:shadow-2xl"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-gray-50 text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <span className="material-symbols-outlined text-3xl font-light">{icon}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="font-body text-gray-500 leading-relaxed">
                {description}
            </p>
        </div>
    )
}

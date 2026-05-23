export default function PageHeader({ title, subtitle, image }) {
    const bgImage = image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop'

    return (
        <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center animate-ken-burns"
                style={{ backgroundImage: `url("${bgImage}")` }}
            />
            <div className="absolute inset-0 bg-dark/60" />

            <div className="relative z-10 text-center px-6 max-w-4xl" data-aos="fade-up">
                <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="font-body text-lg md:text-xl text-gray-200/90 font-light max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}

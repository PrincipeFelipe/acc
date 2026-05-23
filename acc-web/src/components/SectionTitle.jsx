export default function SectionTitle({ title, subtitle, centered = true, dark = false }) {
    return (
        <div className={`mb-16 ${centered ? 'text-center' : 'text-left'}`} data-aos="fade-up">
            <h2 className={`font-display text-4xl md:text-5xl font-bold mb-4 ${dark ? 'text-white' : 'text-dark'}`}>
                {title}
            </h2>
            <div className={`h-1 w-20 bg-primary mb-6 ${centered ? 'mx-auto' : ''}`} />
            {subtitle && (
                <p className={`font-body text-lg md:text-xl max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}

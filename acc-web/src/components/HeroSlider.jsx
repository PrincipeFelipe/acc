import { useState, useEffect } from 'react'

const SLIDES = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop',
        title: 'Arquitectura que Inspira',
        subtitle: 'Diseñamos y construimos espacios que transforman la forma de vivir.',
        link: '/trabajos'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop',
        title: 'Calidad Sin Compromisos',
        subtitle: 'Materiales premium y acabados perfectos en cada detalle.',
        link: '/promociones'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2670&auto=format&fit=crop',
        title: 'Construyendo el Futuro',
        subtitle: 'Más de 30 años de experiencia en edificación y obra civil.',
        link: '/contacto'
    }
]

export default function HeroSlider() {
    const [current, setCurrent] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 6000)
        return () => clearInterval(timer)
    }, [current])

    const nextSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrent(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1))
        setTimeout(() => setIsAnimating(false), 800)
    }

    const prevSlide = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))
        setTimeout(() => setIsAnimating(false), 800)
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-dark">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Image with Ken Burns effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className={`h-full w-full object-cover transition-transform duration-[20000ms] ease-out ${index === current ? 'scale-110' : 'scale-100'
                                }`}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <div className="max-w-4xl px-6">
                            <h1
                                className={`font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight text-shadow-lg transform transition-all duration-1000 delay-300 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                            >
                                {slide.title}
                            </h1>
                            <p
                                className={`font-body text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light transform transition-all duration-1000 delay-500 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                            >
                                {slide.subtitle}
                            </p>
                            <a
                                href={slide.link}
                                className={`inline-block px-8 py-4 bg-primary hover:bg-white hover:text-dark text-white font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-1 ${index === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '700ms' }}
                            >
                                Descubrir Más
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-4 hidden md:block"
            >
                <span className="material-symbols-outlined text-5xl font-thin">chevron_left</span>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-white transition-colors p-4 hidden md:block"
            >
                <span className="material-symbols-outlined text-5xl font-thin">chevron_right</span>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`transition-all duration-500 rounded-full ${idx === current ? 'w-12 h-1 bg-primary' : 'w-2 h-2 bg-white/50 hover:bg-white'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

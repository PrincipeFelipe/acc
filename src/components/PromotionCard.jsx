import { Link } from 'react-router-dom'

export default function PromotionCard({ promo, delay = 0 }) {
    const getTagColor = (color) => {
        const colors = {
            blue: 'bg-primary text-white',
            green: 'bg-green-500 text-white',
            red: 'bg-red-500 text-white',
            gray: 'bg-gray-500 text-white',
            yellow: 'bg-yellow-500 text-white',
        }
        return colors[color] || colors.blue
    }

    return (
        <Link
            to={`/promociones/${promo.id}`}
            className="bg-white group overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 block"
            data-aos="fade-up"
            data-aos-delay={delay}
        >
            <article>
                <div className="relative aspect-[4/3] overflow-hidden">
                    <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url("${promo.imagen_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}")` }}
                    />
                    {promo.etiqueta && (
                        <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded ${getTagColor(promo.etiqueta_color)}`}>
                            {promo.etiqueta}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        {promo.ubicacion && (
                            <div className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                <span className="material-symbols-outlined text-[16px]">location_on</span>
                                {promo.ubicacion}
                            </div>
                        )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                        {promo.titulo}
                    </h3>

                    <div className="flex items-center gap-6 border-t border-gray-100 pt-4 mb-4 text-gray-500 text-sm">
                        {promo.habitaciones && (
                            <div className="flex items-center gap-2" title="Habitaciones">
                                <span className="material-symbols-outlined text-[18px]">bed</span>
                                <span className="font-bold">{promo.habitaciones}</span>
                            </div>
                        )}
                        {promo.banos && (
                            <div className="flex items-center gap-2" title="Baños">
                                <span className="material-symbols-outlined text-[18px]">shower</span>
                                <span className="font-bold">{promo.banos}</span>
                            </div>
                        )}
                        {promo.metros_cuadrados && (
                            <div className="flex items-center gap-2" title="Superficie">
                                <span className="material-symbols-outlined text-[18px]">square_foot</span>
                                <span className="font-bold">{promo.metros_cuadrados}</span>
                            </div>
                        )}
                    </div>

                    {promo.precio && (
                        <div className="flex items-end justify-between">
                            <span className="text-xs text-gray-400">Precio desde</span>
                            <span className="font-display text-2xl font-bold text-primary">{promo.precio}</span>
                        </div>
                    )}
                </div>
            </article>
        </Link>
    )
}

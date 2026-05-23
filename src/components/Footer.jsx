import { Link } from 'react-router-dom'

export default function Footer({ theme = 'dark' }) {
    const isLight = theme === 'light'
    const bgClass = isLight ? 'bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800' : 'bg-[#111418] text-white border-t border-gray-800'
    const textClass = isLight ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'
    const titleClass = isLight ? 'text-[#111418] dark:text-white' : 'text-white'

    return (
        <footer className={`${bgClass} py-12`}>
            <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className={`flex items-center gap-2 mb-4 ${titleClass}`}>
                            <div className="size-6 rounded bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm">foundation</span>
                            </div>
                            <h2 className="text-lg font-bold">ACC</h2>
                        </div>
                        <p className={`${textClass} text-sm`}>Construyendo futuro con solidez y compromiso desde 1990.</p>
                    </div>
                    <div>
                        <h3 className={`${titleClass} font-bold mb-4`}>Empresa</h3>
                        <ul className={`flex flex-col gap-2 ${textClass} text-sm`}>
                            <li><Link to="/" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
                            <li><Link to="/trabajos" className="hover:text-primary transition-colors">Proyectos</Link></li>
                            <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={`${titleClass} font-bold mb-4`}>Servicios</h3>
                        <ul className={`flex flex-col gap-2 ${textClass} text-sm`}>
                            <li><Link to="/trabajos" className="hover:text-primary transition-colors">Edificación</Link></li>
                            <li><Link to="/trabajos" className="hover:text-primary transition-colors">Obra Civil</Link></li>
                            <li><Link to="/trabajos" className="hover:text-primary transition-colors">Reformas</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={`${titleClass} font-bold mb-4`}>Síguenos</h3>
                        <div className="flex gap-4">
                            <a href="#" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <span className="font-bold text-xs">FB</span>
                            </a>
                            <a href="#" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <span className="font-bold text-xs">IG</span>
                            </a>
                            <a href="#" className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors text-white">
                                <span className="font-bold text-xs">LI</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className={`border-t ${isLight ? 'border-gray-100 dark:border-gray-800' : 'border-gray-800'} pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs ${textClass}`}>
                    <p>© 2024 ACC Construcción S.L. Todos los derechos reservados.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-primary" href="#">Política de Privacidad</a>
                        <a className="hover:text-primary" href="#">Aviso Legal</a>
                        <a className="hover:text-primary" href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

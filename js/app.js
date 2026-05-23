// ==========================================
// ACC Construcción - Aplicación Principal
// ==========================================

// Supabase Mock
window.supabase = {
    auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ data: {}, error: null }),
        signOut: async () => {}
    },
    from: (table) => {
        return {
            select: (fields) => ({
                order: () => ({
                    limit: (limit) => {
                        let result = window.LOCAL_DATA?.[table] || [];
                        return Promise.resolve({ data: result.slice(0, limit) });
                    },
                    then: (resolve) => resolve({ data: window.LOCAL_DATA?.[table] || [] })
                }),
                eq: (field, value) => {
                    let result = (window.LOCAL_DATA?.[table] || []).filter(item => item[field] === value);
                    return {
                        order: (orderBy, {ascending = true} = {}) => {
                            result.sort((a,b) => {
                                if (a[orderBy] === b[orderBy]) return 0;
                                if (ascending) return a[orderBy] > b[orderBy] ? 1 : -1;
                                return a[orderBy] < b[orderBy] ? 1 : -1;
                            });
                            return {
                                order: () => ({
                                    limit: (limit) => Promise.resolve({ data: result.slice(0, limit) }),
                                    then: (resolve) => resolve({ data: result })
                                }),
                                limit: (limit) => Promise.resolve({ data: result.slice(0, limit) }),
                                then: (resolve) => resolve({ data: result })
                            };
                        },
                        then: (resolve) => resolve({ data: result })
                    };
                },
                then: (resolve) => resolve({ data: window.LOCAL_DATA?.[table] || [] })
            }),
            insert: async () => ({ error: null })
        };
    }
};

const supabase = window.supabase;

// React Destructuring
const { useState, useEffect, useCallback, createContext, useContext } = window.React;
const { createRoot } = window.ReactDOM;
const { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } = window.ReactRouterDOM;

// ==========================================
// Context - Auth
// ==========================================
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

// ==========================================
// Navigation Links
// ==========================================
const NAV_LINKS = [
    { name: "Inicio", path: "/" },
    { name: "Obras", path: "/trabajos" },
    { name: "Promociones", path: "/promociones" },
    { name: "Contacto", path: "/contacto" },
];

const SERVICES = [
    { icon: "apartment", title: "Edificación", desc: "Construcción de edificios residenciales y comerciales de alta calidad." },
    { icon: "home_repair_service", title: "Mantenimientos", desc: "Servicios preventivos y correctivos para infraestructuras." },
    { icon: "water_drop", title: "Saneamiento", desc: "Gestión de aguas, alcantarillado y plantas de tratamiento." },
    { icon: "engineering", title: "Obras Públicas", desc: "Desarrollo de carreteras, puentes y espacios públicos." },
    { icon: "park", title: "Medioambientales", desc: "Proyectos de recuperación de paisajes y sostenibilidad." },
    { icon: "construction", title: "Reformas", desc: "Rehabilitación integral de espacios interiores y fachadas." },
];

// ==========================================
// Toast Notification Component
// ==========================================
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2`}>
            <span className="material-symbols-outlined text-sm">
                {type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
            </span>
            {message}
        </div>
    );
};

// ==========================================
// Header Component
// ==========================================
const Header = ({ isAdmin = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (isAdmin) {
        return (
            <header className="sticky top-0 z-50 w-full bg-surface-dark border-b border-gray-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 text-white">
                            <div className="size-8 rounded bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl text-white">foundation</span>
                            </div>
                            <span className="font-bold text-lg">ACC Admin</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm hidden md:block">{user?.email}</span>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">logout</span>
                            <span className="hidden md:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#111418]/95 backdrop-blur-sm border-b border-[#f0f2f4] dark:border-[#293038]">
            <div className="layout-container flex justify-center w-full">
                <div className="flex items-center justify-between w-full max-w-[1280px] px-5 py-4 lg:px-10">
                    <Link to="/" className="flex items-center gap-3 text-primary group">
                        <div className="size-8 rounded bg-primary flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">foundation</span>
                        </div>
                        <h2 className="text-[#111418] dark:text-white text-xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">ACC</h2>
                    </Link>

                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <nav className="flex items-center gap-8">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors ${location.pathname === link.path
                                        ? 'text-primary'
                                        : 'text-[#111418] dark:text-gray-200 hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <button onClick={() => navigate('/contacto')} className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
                            <span className="truncate">Presupuesto</span>
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#111418] dark:text-white">
                            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#1a2632] border-b border-[#f0f2f4] dark:border-[#293038] py-4 px-5 flex flex-col gap-4 shadow-lg">
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-base font-medium py-2 ${location.pathname === link.path
                                ? 'text-primary'
                                : 'text-[#111418] dark:text-gray-200'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};

// ==========================================
// Footer Component
// ==========================================
const Footer = ({ theme = 'dark' }) => {
    const isLight = theme === 'light';
    const bgClass = isLight ? 'bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800' : 'bg-[#111418] text-white border-t border-gray-800';
    const textClass = isLight ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400';
    const titleClass = isLight ? 'text-[#111418] dark:text-white' : 'text-white';

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
    );
};

// ==========================================
// HomePage
// ==========================================
const HomePage = () => {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [promociones, setPromociones] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        loadData();
    }, []);

    const loadData = async () => {
        const { data: trabajosData } = await supabase
            .from('trabajos')
            .select('*, categorias(nombre), trabajo_imagenes(*)')
            .order('created_at', { ascending: false })
            .limit(3);
        if (trabajosData) setTrabajos(trabajosData);

        const { data: promocionesData } = await supabase
            .from('promociones')
            .select('*')
            .eq('activa', true)
            .order('destacada', { ascending: false })
            .limit(3);
        if (promocionesData) setPromociones(promocionesData);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative w-full min-h-[600px] flex items-center justify-center">
                <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920")' }}></div>
                <div className="relative z-10 w-full max-w-[1280px] px-5 lg:px-10 flex flex-col items-center text-center gap-6">
                    <h1 data-aos="fade-up" className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight max-w-4xl drop-shadow-sm">
                        Bienvenido a ACC
                    </h1>
                    <p data-aos="fade-up" data-aos-delay="100" className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed max-w-2xl drop-shadow-sm">
                        Cumplimos sueños con proyectos sólidos y accesibles. Construimos el futuro con precisión y compromiso.
                    </p>
                    <div data-aos="fade-up" data-aos-delay="200" className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button onClick={() => navigate('/contacto')} className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold shadow-lg hover:bg-blue-600 transition-all hover:scale-105">
                            Contacta con nosotros
                        </button>
                        <button onClick={() => navigate('/trabajos')} className="flex items-center justify-center rounded-lg h-12 px-8 bg-white/10 backdrop-blur-md border border-white/30 text-white text-base font-bold hover:bg-white/20 transition-colors">
                            Ver nuestros trabajos
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 md:py-24 w-full bg-[#f6f7f8] dark:bg-[#1a222d]">
                <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
                    <div className="text-center mb-16 max-w-2xl mx-auto" data-aos="fade-up">
                        <h2 className="text-[#111418] dark:text-white text-3xl font-bold leading-tight tracking-tight mb-4">Nuestros Servicios</h2>
                        <p className="text-gray-500 dark:text-gray-400">Ofrecemos soluciones integrales adaptadas a las necesidades de cada cliente.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                        {SERVICES.map((svc, i) => (
                            <div key={i} data-aos="fade-up" data-aos-delay={i * 50} className="bg-white dark:bg-[#111418] p-8 rounded-xl shadow-sm card-hover flex flex-col items-center text-center gap-4 group">
                                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-3xl">{svc.icon}</span>
                                </div>
                                <h3 className="text-[#111418] dark:text-white text-lg font-bold">{svc.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{svc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Works */}
            {trabajos.length > 0 && (
                <section className="py-16 md:py-24 w-full bg-white dark:bg-background-dark">
                    <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
                        <div className="flex justify-between items-end mb-10" data-aos="fade-up">
                            <div>
                                <h2 className="text-[#111418] dark:text-white text-3xl font-bold">Últimos Proyectos</h2>
                                <p className="text-gray-500 mt-2">Conoce nuestros trabajos más recientes.</p>
                            </div>
                            <Link to="/trabajos" className="hidden sm:block text-primary font-bold hover:underline">Ver todos</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trabajos.map((trabajo, i) => {
                                const mainImage = trabajo.trabajo_imagenes?.find(img => img.es_principal) || trabajo.trabajo_imagenes?.[0];
                                return (
                                    <div key={trabajo.id} data-aos="fade-up" data-aos-delay={i * 100} className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm card-hover">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                            {mainImage && <img src={mainImage.url} alt={trabajo.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                {trabajo.categorias?.nombre || 'Proyecto'}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-1">{trabajo.titulo}</h3>
                                            {trabajo.ubicacion && (
                                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    <span>{trabajo.ubicacion}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="w-full bg-primary text-white py-16" data-aos="fade-up">
                <div className="max-w-[1280px] mx-auto px-5 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold mb-3">¿Tienes un proyecto en mente?</h2>
                        <p className="text-blue-100 text-lg">Cuéntanos tu idea y nuestro equipo de expertos te asesorará sin compromiso.</p>
                    </div>
                    <button onClick={() => navigate('/contacto')} className="whitespace-nowrap bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition-all hover:scale-105 text-lg">
                        Hablemos
                    </button>
                </div>
            </section>

            <Footer theme="dark" />
        </div>
    );
};

// ==========================================
// PortfolioPage (Trabajos)
// ==========================================
const PortfolioPage = () => {
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filter, setFilter] = useState("Todos");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data: catData } = await supabase.from('categorias').select('*').order('nombre');
        if (catData) setCategorias(catData);

        const { data: trabajosData } = await supabase
            .from('trabajos')
            .select('*, categorias(nombre), trabajo_imagenes(*)')
            .order('fecha', { ascending: false });
        if (trabajosData) setTrabajos(trabajosData);
        setLoading(false);
    };

    const filteredProjects = filter === "Todos"
        ? trabajos
        : trabajos.filter(t => t.categorias?.nombre === filter);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <section className="relative bg-surface-light dark:bg-surface-dark py-12 md:py-20">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
                    <div className="relative overflow-hidden rounded-2xl min-h-[320px] flex flex-col items-center justify-center text-center p-8 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920")' }}>
                        <h1 data-aos="fade-up" className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4 max-w-3xl">
                            Nuestras Obras
                        </h1>
                        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-200 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                            Explora nuestra trayectoria en edificación, obras públicas y grandes reformas.
                        </p>
                    </div>
                </div>
            </section>

            <section className="pb-20 pt-10">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-10">
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10" data-aos="fade-up">
                        <button
                            onClick={() => setFilter("Todos")}
                            className={`h-10 px-5 rounded-full font-bold text-sm transition-all ${filter === "Todos" ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary'}`}
                        >
                            Todos
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.nombre)}
                                className={`h-10 px-5 rounded-full font-bold text-sm transition-all ${filter === cat.nombre ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary'}`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <span className="material-symbols-outlined text-6xl mb-4 block">construction</span>
                            <p className="text-xl">No hay proyectos disponibles todavía.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project, i) => {
                                const mainImage = project.trabajo_imagenes?.find(img => img.es_principal) || project.trabajo_imagenes?.[0];
                                return (
                                    <article key={project.id} data-aos="fade-up" data-aos-delay={i * 50} className="group flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm card-hover">
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                            {mainImage && <img alt={project.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={mainImage.url} />}
                                            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                {project.categorias?.nombre}
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-1 p-6">
                                            <h3 className="text-xl font-bold text-[#111418] dark:text-white leading-tight mb-2">{project.titulo}</h3>
                                            {project.ubicacion && (
                                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
                                                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                    <span>{project.ubicacion}</span>
                                                </div>
                                            )}
                                            {project.descripcion && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{project.descripcion}</p>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
            <Footer theme="light" />
        </div>
    );
};

// ==========================================
// PromotionsPage
// ==========================================
const PromotionsPage = () => {
    const [promociones, setPromociones] = useState([]);
    const [destacada, setDestacada] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('promociones')
            .select('*')
            .eq('activa', true)
            .order('destacada', { ascending: false })
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            const dest = data.find(p => p.destacada);
            if (dest) {
                setDestacada(dest);
                setPromociones(data.filter(p => p.id !== dest.id));
            } else {
                setPromociones(data);
            }
        }
        setLoading(false);
    };

    const getTagColor = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-700',
            green: 'bg-green-100 text-green-700',
            red: 'bg-red-100 text-red-700',
            gray: 'bg-gray-100 text-gray-700',
            yellow: 'bg-yellow-100 text-yellow-700',
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <div className="bg-white dark:bg-surface-dark px-4 pb-8 pt-10 md:px-40 md:pt-16 border-b border-gray-200 dark:border-gray-800">
                <div className="mx-auto flex max-w-[1200px] flex-col gap-6" data-aos="fade-up">
                    <h1 className="text-[#111418] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">Nuestras Promociones</h1>
                    <p className="text-[#617589] dark:text-gray-400 text-lg font-normal leading-normal max-w-2xl">Encuentra tu próximo hogar. Calidad constructiva y diseño vanguardista.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            ) : (!destacada && promociones.length === 0) ? (
                <div className="text-center py-20 text-gray-500">
                    <span className="material-symbols-outlined text-6xl mb-4 block">home</span>
                    <p className="text-xl">No hay promociones disponibles actualmente.</p>
                </div>
            ) : (
                <>
                    {destacada && (
                        <section className="px-4 py-8 md:px-40" data-aos="fade-up">
                            <div className="mx-auto max-w-[1200px]">
                                <h3 className="mb-6 text-xl font-bold text-[#111418] dark:text-white">Promoción Destacada</h3>
                                <div className="flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-white dark:bg-surface-dark shadow-lg card-hover">
                                    <div className="relative w-full lg:w-3/5 h-64 lg:h-auto bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url("${destacada.imagen_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}")` }}>
                                        {destacada.etiqueta && (
                                            <div className={`absolute top-4 left-4 rounded-md px-3 py-1 text-xs font-bold ${getTagColor(destacada.etiqueta_color)}`}>{destacada.etiqueta}</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between p-6 lg:w-2/5 lg:p-8">
                                        <div>
                                            {destacada.ubicacion && (
                                                <div className="flex items-center gap-1 text-sm text-[#617589] mb-2">
                                                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                                                    <span>{destacada.ubicacion}</span>
                                                </div>
                                            )}
                                            <h2 className="text-2xl font-black text-[#111418] dark:text-white md:text-3xl">{destacada.titulo}</h2>
                                            {destacada.descripcion && <p className="mt-2 text-[#617589]">{destacada.descripcion}</p>}
                                        </div>
                                        <div className="mt-6 flex flex-col gap-6">
                                            <div className="flex gap-6 border-b border-dashed border-gray-200 pb-6">
                                                {destacada.habitaciones && <div className="flex flex-col gap-1"><span className="material-symbols-outlined text-[#617589]">bed</span><span className="text-sm font-bold">{destacada.habitaciones} Hab</span></div>}
                                                {destacada.banos && <div className="flex flex-col gap-1"><span className="material-symbols-outlined text-[#617589]">shower</span><span className="text-sm font-bold">{destacada.banos} Baños</span></div>}
                                                {destacada.metros_cuadrados && <div className="flex flex-col gap-1"><span className="material-symbols-outlined text-[#617589]">square_foot</span><span className="text-sm font-bold">{destacada.metros_cuadrados}</span></div>}
                                            </div>
                                            <div className="flex items-end justify-between">
                                                {destacada.precio && <div><span className="text-sm text-[#617589]">Precio desde</span><br /><span className="text-2xl font-black text-primary">{destacada.precio}</span></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {promociones.length > 0 && (
                        <section className="px-4 py-8 pb-20 md:px-40">
                            <div className="mx-auto max-w-[1200px]">
                                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {promociones.map((promo, i) => (
                                        <article key={promo.id} data-aos="fade-up" data-aos-delay={i * 100} className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-surface-dark shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 card-hover">
                                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                                                <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${promo.imagen_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'}")` }}></div>
                                                {promo.etiqueta && (
                                                    <div className={`absolute left-3 top-3 rounded px-2 py-1 text-xs font-bold ${getTagColor(promo.etiqueta_color)}`}>{promo.etiqueta}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col p-5">
                                                {promo.ubicacion && (
                                                    <div className="mb-2 flex items-center gap-1 text-xs font-medium text-[#617589]">
                                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                        {promo.ubicacion}
                                                    </div>
                                                )}
                                                <h3 className="mb-1 text-lg font-bold text-[#111418] dark:text-white">{promo.titulo}</h3>
                                                <div className="mb-4 mt-auto flex items-center gap-4 text-sm text-[#617589]">
                                                    {promo.habitaciones && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">bed</span> {promo.habitaciones}</div>}
                                                    {promo.banos && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">shower</span> {promo.banos}</div>}
                                                    {promo.metros_cuadrados && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">square_foot</span> {promo.metros_cuadrados}</div>}
                                                </div>
                                                {promo.precio && (
                                                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                                                        <div>
                                                            <p className="text-xs text-[#617589]">Desde</p>
                                                            <p className="text-xl font-bold text-primary">{promo.precio}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}
            <Footer theme="light" />
        </div>
    );
};

// ==========================================
// ContactPage
// ==========================================
const ContactPage = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const { error } = await supabase.from('mensajes_contacto').insert([formData]);

        if (error) {
            setToast({ message: 'Error al enviar el mensaje. Inténtalo de nuevo.', type: 'error' });
        } else {
            setToast({ message: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', type: 'success' });
            setFormData({ nombre: '', email: '', telefono: '', mensaje: '' });
        }
        setSending(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <main className="flex-grow">
                <div className="px-4 md:px-10 lg:px-40 py-10">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col gap-4 mb-8" data-aos="fade-up">
                            <h1 className="text-4xl md:text-5xl font-black leading-tight text-[#111418] dark:text-white">Ponte en Contacto</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">Estamos listos para iniciar tu próximo proyecto. Cuéntanos tus ideas.</p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                            <div className="flex-1 w-full lg:max-w-3xl" data-aos="fade-up" data-aos-delay="100">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white dark:bg-[#1a2632] p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold mb-2 text-[#111418] dark:text-white">Envíanos un mensaje</h3>
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-[#111418] dark:text-white">Nombre Completo *</p>
                                        <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-14 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-[#111418] dark:text-white" placeholder="Juan Pérez" type="text" />
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <label className="flex flex-col flex-1">
                                            <p className="text-base font-medium pb-2 text-[#111418] dark:text-white">Teléfono</p>
                                            <input value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-14 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-[#111418] dark:text-white" placeholder="+34 600 000 000" type="tel" />
                                        </label>
                                        <label className="flex flex-col flex-1">
                                            <p className="text-base font-medium pb-2 text-[#111418] dark:text-white">Correo Electrónico *</p>
                                            <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 h-14 px-4 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none text-[#111418] dark:text-white" placeholder="contacto@email.com" type="email" />
                                        </label>
                                    </div>
                                    <label className="flex flex-col flex-1">
                                        <p className="text-base font-medium pb-2 text-[#111418] dark:text-white">Tu Mensaje *</p>
                                        <textarea required value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 min-h-[160px] p-4 text-base focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-y text-[#111418] dark:text-white" placeholder="Escribe los detalles de tu proyecto aquí..."></textarea>
                                    </label>
                                    <div className="mt-2">
                                        <button disabled={sending} className="w-full md:w-auto min-w-[180px] bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2" type="submit">
                                            {sending ? 'Enviando...' : 'Enviar Mensaje'}
                                            <span className="material-symbols-outlined text-lg">send</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="lg:w-[360px] flex flex-col gap-8" data-aos="fade-up" data-aos-delay="200">
                                <h3 className="text-xl font-bold text-[#111418] dark:text-white">Información de Contacto</h3>
                                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-[#1a2632] transition-colors">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Dirección</span>
                                        <p className="text-lg font-medium mt-1 text-[#111418] dark:text-white">Calle Principal 123,<br />Madrid, España</p>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-[#1a2632] transition-colors">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Teléfono</span>
                                        <p className="text-lg font-medium mt-1 text-[#111418] dark:text-white">+34 900 000 000</p>
                                    </div>
                                </div>
                                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-[#1a2632] transition-colors">
                                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Email</span>
                                        <p className="text-lg font-medium mt-1 text-[#111418] dark:text-white">info@acc-construccion.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer theme="light" />
        </div>
    );
};

// Public components exported for use in admin.js
window.AuthProvider = AuthProvider;
window.useAuth = useAuth;
window.Header = Header;
window.Footer = Footer;
window.HomePage = HomePage;
window.PortfolioPage = PortfolioPage;
window.PromotionsPage = PromotionsPage;
window.ContactPage = ContactPage;

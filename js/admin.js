// Dependencies from global scope
const { useState, useEffect, useCallback, createContext, useContext } = window.React;
const { createRoot } = window.ReactDOM;
const { HashRouter, Routes, Route, Link, useNavigate, useLocation, Navigate } = window.ReactRouterDOM;
const supabase = window.supabase;
const useAuth = window.useAuth;
const AuthProvider = window.AuthProvider;
const Header = window.Header;
const Footer = window.Footer;
const HomePage = window.HomePage;
const PortfolioPage = window.PortfolioPage;
const PromotionsPage = window.PromotionsPage;
const ContactPage = window.ContactPage;

// ==========================================
// Login Page (Acceso Secreto)
// ==========================================
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/admin');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="size-12 rounded-lg bg-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl text-white">foundation</span>
                        </div>
                        <h1 className="text-white text-2xl font-bold">ACC Admin</h1>
                    </div>
                    <p className="text-gray-400">Acceso al panel de administración</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface-dark p-8 rounded-2xl shadow-xl border border-gray-800">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Correo electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="admin@acc-construccion.com"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <span className="material-symbols-outlined">login</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                        ← Volver a la web pública
                    </Link>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Protected Route Component
// ==========================================
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/acc-login" replace />;
    }

    return children;
};

// ==========================================
// Admin Layout with Sidebar
// ==========================================
const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
        { path: '/admin/trabajos', icon: 'construction', label: 'Trabajos' },
        { path: '/admin/promociones', icon: 'home', label: 'Promociones' },
        { path: '/admin/mensajes', icon: 'mail', label: 'Mensajes' },
    ];

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    return (
        <div className="min-h-screen bg-background-dark">
            <Header isAdmin={true} />
            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface-dark border-r border-gray-800 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ top: '65px' }}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item)
                                    ? 'bg-primary text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Mobile sidebar toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden fixed bottom-4 left-4 z-50 bg-primary text-white p-3 rounded-full shadow-lg"
                >
                    <span className="material-symbols-outlined">{sidebarOpen ? 'close' : 'menu'}</span>
                </button>

                {/* Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/50 z-30"
                        style={{ top: '65px' }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-65px)]">
                    {children}
                </main>
            </div>
        </div>
    );
};

// ==========================================
// Admin Dashboard
// ==========================================
const AdminDashboard = () => {
    const [stats, setStats] = useState({ trabajos: 0, promociones: 0, mensajes: 0, noLeidos: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const [trabajosRes, promocionesRes, mensajesRes, noLeidosRes] = await Promise.all([
            supabase.from('trabajos').select('id', { count: 'exact', head: true }),
            supabase.from('promociones').select('id', { count: 'exact', head: true }).eq('activa', true),
            supabase.from('mensajes_contacto').select('id', { count: 'exact', head: true }),
            supabase.from('mensajes_contacto').select('id', { count: 'exact', head: true }).eq('leido', false)
        ]);

        setStats({
            trabajos: trabajosRes.count || 0,
            promociones: promocionesRes.count || 0,
            mensajes: mensajesRes.count || 0,
            noLeidos: noLeidosRes.count || 0
        });
        setLoading(false);
    };

    const statCards = [
        { label: 'Trabajos Publicados', value: stats.trabajos, icon: 'construction', color: 'bg-blue-500' },
        { label: 'Promociones Activas', value: stats.promociones, icon: 'home', color: 'bg-green-500' },
        { label: 'Total Mensajes', value: stats.mensajes, icon: 'mail', color: 'bg-purple-500' },
        { label: 'Mensajes Sin Leer', value: stats.noLeidos, icon: 'mark_email_unread', color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Panel de Administración</h1>
                <p className="text-gray-400">Bienvenido al panel de control de ACC Construcción</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-surface-dark rounded-xl p-6 border border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`size-12 ${card.color} rounded-lg flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-white text-2xl">{card.icon}</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{card.value}</h3>
                            <p className="text-gray-400 text-sm">{card.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Link to="/admin/trabajos" className="bg-surface-dark rounded-xl p-6 border border-gray-800 hover:border-primary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors">add_circle</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Nuevo Trabajo</h3>
                            <p className="text-gray-400 text-sm">Añadir un proyecto u obra nueva</p>
                        </div>
                    </div>
                </Link>
                <Link to="/admin/promociones" className="bg-surface-dark rounded-xl p-6 border border-gray-800 hover:border-primary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                            <span className="material-symbols-outlined text-green-500 group-hover:text-white text-3xl transition-colors">add_home</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Nueva Promoción</h3>
                            <p className="text-gray-400 text-sm">Publicar una promoción inmobiliaria</p>
                        </div>
                    </div>
                </Link>
            </div>
        </AdminLayout>
    );
};

// ==========================================
// Admin - Trabajos CRUD
// ==========================================
const AdminTrabajos = () => {
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [trabajosRes, catRes] = await Promise.all([
            supabase.from('trabajos').select('*, categorias(nombre), trabajo_imagenes(*)').order('created_at', { ascending: false }),
            supabase.from('categorias').select('*').order('nombre')
        ]);
        if (trabajosRes.data) setTrabajos(trabajosRes.data);
        if (catRes.data) setCategorias(catRes.data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este trabajo?')) return;
        const { error } = await supabase.from('trabajos').delete().eq('id', id);
        if (error) {
            setToast({ message: 'Error al eliminar', type: 'error' });
        } else {
            setToast({ message: 'Trabajo eliminado correctamente', type: 'success' });
            loadData();
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleFormClose = (saved) => {
        setShowForm(false);
        setEditingItem(null);
        if (saved) loadData();
    };

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Gestión de Trabajos</h1>
                    <p className="text-gray-400">Administra los proyectos y obras de ACC</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    <span className="hidden sm:inline">Nuevo Trabajo</span>
                </button>
            </div>

            {showForm && (
                <TrabajoForm
                    item={editingItem}
                    categorias={categorias}
                    onClose={handleFormClose}
                    setToast={setToast}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : trabajos.length === 0 ? (
                <div className="text-center py-16 bg-surface-dark rounded-xl border border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">construction</span>
                    <p className="text-gray-400 text-lg">No hay trabajos todavía</p>
                    <button onClick={() => setShowForm(true)} className="mt-4 text-primary hover:underline">Crear el primero</button>
                </div>
            ) : (
                <div className="bg-surface-dark rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-800/50">
                                <tr>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Imagen</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">Título</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">Categoría</th>
                                    <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden lg:table-cell">Ubicación</th>
                                    <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {trabajos.map(trabajo => {
                                    const mainImage = trabajo.trabajo_imagenes?.find(img => img.es_principal) || trabajo.trabajo_imagenes?.[0];
                                    return (
                                        <tr key={trabajo.id} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="size-14 rounded-lg bg-gray-700 overflow-hidden">
                                                    {mainImage && <img src={mainImage.url} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white font-medium">{trabajo.titulo}</p>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-gray-400">{trabajo.categorias?.nombre}</span>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <span className="text-gray-400">{trabajo.ubicacion || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(trabajo)} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(trabajo.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

// ==========================================
// Trabajo Form Component
// ==========================================
const TrabajoForm = ({ item, categorias, onClose, setToast }) => {
    const [formData, setFormData] = useState({
        titulo: item?.titulo || '',
        descripcion: item?.descripcion || '',
        categoria_id: item?.categoria_id || '',
        ubicacion: item?.ubicacion || '',
        fecha: item?.fecha || '',
        destacado: item?.destacado || false
    });
    const [imageUrl, setImageUrl] = useState(item?.trabajo_imagenes?.[0]?.url || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (item) {
                // Update
                const { error } = await supabase.from('trabajos').update(formData).eq('id', item.id);
                if (error) throw error;

                // Update image if changed
                if (imageUrl && imageUrl !== item?.trabajo_imagenes?.[0]?.url) {
                    await supabase.from('trabajo_imagenes').delete().eq('trabajo_id', item.id);
                    await supabase.from('trabajo_imagenes').insert({ trabajo_id: item.id, url: imageUrl, es_principal: true });
                }
                setToast({ message: 'Trabajo actualizado correctamente', type: 'success' });
            } else {
                // Create
                const { data, error } = await supabase.from('trabajos').insert([formData]).select().single();
                if (error) throw error;

                // Add image
                if (imageUrl) {
                    await supabase.from('trabajo_imagenes').insert({ trabajo_id: data.id, url: imageUrl, es_principal: true });
                }
                setToast({ message: 'Trabajo creado correctamente', type: 'success' });
            }
            onClose(true);
        } catch (err) {
            setToast({ message: 'Error al guardar: ' + err.message, type: 'error' });
        }
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">{item ? 'Editar Trabajo' : 'Nuevo Trabajo'}</h2>
                    <button onClick={() => onClose(false)} className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Título *</label>
                        <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Nombre del proyecto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Categoría *</label>
                            <select required value={formData.categoria_id} onChange={e => setFormData({ ...formData, categoria_id: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none">
                                <option value="">Seleccionar...</option>
                                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Ubicación</label>
                            <input type="text" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Ciudad, País" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Descripción</label>
                        <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} className="w-full min-h-[120px] p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none resize-y" placeholder="Descripción del proyecto..."></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">URL de Imagen</label>
                        <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="https://..." />
                        {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />}
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="destacado" checked={formData.destacado} onChange={e => setFormData({ ...formData, destacado: e.target.checked })} className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-primary focus:ring-primary" />
                        <label htmlFor="destacado" className="text-gray-300">Destacar en la página principal</label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                        <button type="button" onClick={() => onClose(false)} className="px-6 py-3 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-2">
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// Admin - Promociones CRUD
// ==========================================
const AdminPromociones = () => {
    const [promociones, setPromociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data } = await supabase.from('promociones').select('*').order('created_at', { ascending: false });
        if (data) setPromociones(data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta promoción?')) return;
        const { error } = await supabase.from('promociones').delete().eq('id', id);
        if (error) {
            setToast({ message: 'Error al eliminar', type: 'error' });
        } else {
            setToast({ message: 'Promoción eliminada correctamente', type: 'success' });
            loadData();
        }
    };

    const handleFormClose = (saved) => {
        setShowForm(false);
        setEditingItem(null);
        if (saved) loadData();
    };

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Gestión de Promociones</h1>
                    <p className="text-gray-400">Administra las promociones inmobiliarias</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-lg transition-colors">
                    <span className="material-symbols-outlined">add</span>
                    <span className="hidden sm:inline">Nueva Promoción</span>
                </button>
            </div>

            {showForm && (
                <PromocionForm
                    item={editingItem}
                    onClose={handleFormClose}
                    setToast={setToast}
                />
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : promociones.length === 0 ? (
                <div className="text-center py-16 bg-surface-dark rounded-xl border border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">home</span>
                    <p className="text-gray-400 text-lg">No hay promociones todavía</p>
                    <button onClick={() => setShowForm(true)} className="mt-4 text-primary hover:underline">Crear la primera</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promociones.map(promo => (
                        <div key={promo.id} className="bg-surface-dark rounded-xl border border-gray-800 overflow-hidden">
                            <div className="aspect-video bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url("${promo.imagen_url || ''}")` }}></div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-white">{promo.titulo}</h3>
                                    <span className={`text-xs px-2 py-1 rounded ${promo.activa ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                        {promo.activa ? 'Activa' : 'Inactiva'}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">{promo.ubicacion}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">{promo.precio || '-'}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingItem(promo); setShowForm(true); }} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(promo.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
};

// ==========================================
// Promocion Form Component
// ==========================================
const PromocionForm = ({ item, onClose, setToast }) => {
    const [formData, setFormData] = useState({
        titulo: item?.titulo || '',
        descripcion: item?.descripcion || '',
        imagen_url: item?.imagen_url || '',
        precio: item?.precio || '',
        ubicacion: item?.ubicacion || '',
        habitaciones: item?.habitaciones || '',
        banos: item?.banos || '',
        metros_cuadrados: item?.metros_cuadrados || '',
        etiqueta: item?.etiqueta || '',
        etiqueta_color: item?.etiqueta_color || 'blue',
        activa: item?.activa ?? true,
        destacada: item?.destacada || false
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const dataToSave = {
                ...formData,
                habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : null,
                banos: formData.banos ? parseInt(formData.banos) : null
            };

            if (item) {
                const { error } = await supabase.from('promociones').update(dataToSave).eq('id', item.id);
                if (error) throw error;
                setToast({ message: 'Promoción actualizada correctamente', type: 'success' });
            } else {
                const { error } = await supabase.from('promociones').insert([dataToSave]);
                if (error) throw error;
                setToast({ message: 'Promoción creada correctamente', type: 'success' });
            }
            onClose(true);
        } catch (err) {
            setToast({ message: 'Error al guardar: ' + err.message, type: 'error' });
        }
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-dark rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold text-white">{item ? 'Editar Promoción' : 'Nueva Promoción'}</h2>
                    <button onClick={() => onClose(false)} className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Título *</label>
                        <input type="text" required value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Ubicación</label>
                            <input type="text" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Precio</label>
                            <input type="text" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Ej: 250.000€" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Habitaciones</label>
                            <input type="number" value={formData.habitaciones} onChange={e => setFormData({ ...formData, habitaciones: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Baños</label>
                            <input type="number" value={formData.banos} onChange={e => setFormData({ ...formData, banos: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Metros²</label>
                            <input type="text" value={formData.metros_cuadrados} onChange={e => setFormData({ ...formData, metros_cuadrados: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Ej: 120 m²" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Descripción</label>
                        <textarea value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} className="w-full min-h-[100px] p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none resize-y"></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">URL de Imagen</label>
                        <input type="url" value={formData.imagen_url} onChange={e => setFormData({ ...formData, imagen_url: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Etiqueta</label>
                            <input type="text" value={formData.etiqueta} onChange={e => setFormData({ ...formData, etiqueta: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Ej: En Venta, Últimas Unidades" />
                        </div>
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Color Etiqueta</label>
                            <select value={formData.etiqueta_color} onChange={e => setFormData({ ...formData, etiqueta_color: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none">
                                <option value="blue">Azul</option>
                                <option value="green">Verde</option>
                                <option value="red">Rojo</option>
                                <option value="yellow">Amarillo</option>
                                <option value="gray">Gris</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.activa} onChange={e => setFormData({ ...formData, activa: e.target.checked })} className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-primary focus:ring-primary" />
                            <span className="text-gray-300">Activa</span>
                        </label>
                        <label className="flex items-center gap-3">
                            <input type="checkbox" checked={formData.destacada} onChange={e => setFormData({ ...formData, destacada: e.target.checked })} className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-primary focus:ring-primary" />
                            <span className="text-gray-300">Destacada</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                        <button type="button" onClick={() => onClose(false)} className="px-6 py-3 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors">
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ==========================================
// Admin - Mensajes
// ==========================================
const AdminMensajes = () => {
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data } = await supabase.from('mensajes_contacto').select('*').order('created_at', { ascending: false });
        if (data) setMensajes(data);
        setLoading(false);
    };

    const markAsRead = async (id) => {
        await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', id);
        loadData();
    };

    const deleteMessage = async (id) => {
        if (!confirm('¿Eliminar este mensaje?')) return;
        await supabase.from('mensajes_contacto').delete().eq('id', id);
        setSelectedMessage(null);
        loadData();
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Mensajes de Contacto</h1>
                <p className="text-gray-400">Mensajes recibidos desde el formulario de contacto</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : mensajes.length === 0 ? (
                <div className="text-center py-16 bg-surface-dark rounded-xl border border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">inbox</span>
                    <p className="text-gray-400 text-lg">No hay mensajes todavía</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Messages list */}
                    <div className="bg-surface-dark rounded-xl border border-gray-800 overflow-hidden">
                        <div className="divide-y divide-gray-800 max-h-[600px] overflow-y-auto">
                            {mensajes.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => { setSelectedMessage(msg); if (!msg.leido) markAsRead(msg.id); }}
                                    className={`p-4 cursor-pointer transition-colors ${selectedMessage?.id === msg.id ? 'bg-primary/10' : 'hover:bg-gray-800/50'} ${!msg.leido ? 'border-l-4 border-primary' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className={`font-medium ${!msg.leido ? 'text-white' : 'text-gray-300'}`}>{msg.nombre}</h4>
                                        <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">{msg.mensaje}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Message detail */}
                    {selectedMessage ? (
                        <div className="bg-surface-dark rounded-xl border border-gray-800 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{selectedMessage.nombre}</h3>
                                    <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
                                    {selectedMessage.telefono && <p className="text-gray-400 text-sm">{selectedMessage.telefono}</p>}
                                </div>
                                <button onClick={() => deleteMessage(selectedMessage.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                            <div className="bg-gray-800/50 rounded-lg p-4">
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.mensaje}</p>
                            </div>
                            <p className="text-gray-500 text-xs mt-4">Recibido: {new Date(selectedMessage.created_at).toLocaleString()}</p>
                        </div>
                    ) : (
                        <div className="bg-surface-dark rounded-xl border border-gray-800 p-6 flex items-center justify-center text-gray-500">
                            <p>Selecciona un mensaje para ver los detalles</p>
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};

// ==========================================
// Main App Component
// ==========================================
const App = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<React.Fragment><Header /><HomePage /></React.Fragment>} />
                    <Route path="/trabajos" element={<React.Fragment><Header /><PortfolioPage /></React.Fragment>} />
                    <Route path="/promociones" element={<React.Fragment><Header /><PromotionsPage /></React.Fragment>} />
                    <Route path="/contacto" element={<React.Fragment><Header /><ContactPage /></React.Fragment>} />

                    {/* Secret Login */}
                    <Route path="/acc-login" element={<LoginPage />} />

                    {/* Admin Routes (Protected) */}
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/trabajos" element={<ProtectedRoute><AdminTrabajos /></ProtectedRoute>} />
                    <Route path="/admin/promociones" element={<ProtectedRoute><AdminPromociones /></ProtectedRoute>} />
                    <Route path="/admin/mensajes" element={<ProtectedRoute><AdminMensajes /></ProtectedRoute>} />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

// Initialize AOS and render App
AOS.init({ duration: 800, once: true });
const root = createRoot(document.getElementById('root'));
root.render(<App />);

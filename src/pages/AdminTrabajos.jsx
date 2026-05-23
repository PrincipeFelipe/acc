import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/AdminLayout'
import Toast from '../components/Toast'

export default function AdminTrabajos() {
    const [trabajos, setTrabajos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const [trabajosRes, catRes] = await Promise.all([
            supabase.from('trabajos').select('*, categorias(nombre), trabajo_imagenes(*)').order('created_at', { ascending: false }),
            supabase.from('categorias').select('*').order('nombre')
        ])
        if (trabajosRes.data) setTrabajos(trabajosRes.data)
        if (catRes.data) setCategorias(catRes.data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este trabajo?')) return
        const { error } = await supabase.from('trabajos').delete().eq('id', id)
        if (error) {
            setToast({ message: 'Error al eliminar', type: 'error' })
        } else {
            setToast({ message: 'Trabajo eliminado correctamente', type: 'success' })
            loadData()
        }
    }

    const handleFormClose = (saved) => {
        setShowForm(false)
        setEditingItem(null)
        if (saved) loadData()
    }

    return (
        <AdminLayout>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="flex items-center justify-between mb-8" data-aos="fade-down">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Gestión de Trabajos</h1>
                    <p className="text-gray-400 font-light">Administra los proyectos y obras de ACC</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-white hover:text-primary text-white font-bold px-5 py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
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
                                    const mainImage = trabajo.trabajo_imagenes?.find(img => img.es_principal) || trabajo.trabajo_imagenes?.[0]
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
                                                    <button onClick={() => { setEditingItem(trabajo); setShowForm(true) }} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(trabajo.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded-lg transition-colors">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

function TrabajoForm({ item, categorias, onClose, setToast }) {
    const [formData, setFormData] = useState({
        titulo: item?.titulo || '',
        descripcion: item?.descripcion || '',
        categoria_id: item?.categoria_id || '',
        ubicacion: item?.ubicacion || '',
        destacado: item?.destacado || false
    })
    const [imageUrl, setImageUrl] = useState(item?.trabajo_imagenes?.[0]?.url || '')
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (item) {
                const { error } = await supabase.from('trabajos').update(formData).eq('id', item.id)
                if (error) throw error

                if (imageUrl && imageUrl !== item?.trabajo_imagenes?.[0]?.url) {
                    await supabase.from('trabajo_imagenes').delete().eq('trabajo_id', item.id)
                    await supabase.from('trabajo_imagenes').insert({ trabajo_id: item.id, url: imageUrl, es_principal: true })
                }
                setToast({ message: 'Trabajo actualizado correctamente', type: 'success' })
            } else {
                const { data, error } = await supabase.from('trabajos').insert([formData]).select().single()
                if (error) throw error

                if (imageUrl) {
                    await supabase.from('trabajo_imagenes').insert({ trabajo_id: data.id, url: imageUrl, es_principal: true })
                }
                setToast({ message: 'Trabajo creado correctamente', type: 'success' })
            }
            onClose(true)
        } catch (err) {
            setToast({ message: 'Error al guardar: ' + err.message, type: 'error' })
        }
        setSaving(false)
    }

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
    )
}

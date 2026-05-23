import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/AdminLayout'
import Toast from '../components/Toast'

export default function AdminPromociones() {
    const [promociones, setPromociones] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const { data } = await supabase.from('promociones').select('*').order('created_at', { ascending: false })
        if (data) setPromociones(data)
        setLoading(false)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta promoción?')) return
        const { error } = await supabase.from('promociones').delete().eq('id', id)
        if (error) {
            setToast({ message: 'Error al eliminar', type: 'error' })
        } else {
            setToast({ message: 'Promoción eliminada correctamente', type: 'success' })
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
                    <h1 className="text-3xl font-display font-bold text-white mb-1">Gestión de Promociones</h1>
                    <p className="text-gray-400 font-light">Administra las promociones inmobiliarias</p>
                </div>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary hover:bg-white hover:text-primary text-white font-bold px-5 py-3 rounded-lg transition-colors shadow-lg shadow-primary/20">
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
                                        <button onClick={() => { setEditingItem(promo); setShowForm(true) }} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-800 rounded-lg transition-colors">
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
    )
}

function PromocionForm({ item, onClose, setToast }) {
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
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const dataToSave = {
                ...formData,
                habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : null,
                banos: formData.banos ? parseInt(formData.banos) : null
            }

            if (item) {
                const { error } = await supabase.from('promociones').update(dataToSave).eq('id', item.id)
                if (error) throw error
                setToast({ message: 'Promoción actualizada correctamente', type: 'success' })
            } else {
                const { error } = await supabase.from('promociones').insert([dataToSave])
                if (error) throw error
                setToast({ message: 'Promoción creada correctamente', type: 'success' })
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
                            <input type="text" value={formData.etiqueta} onChange={e => setFormData({ ...formData, etiqueta: e.target.value })} className="w-full h-12 px-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary outline-none" placeholder="Ej: En Venta" />
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
    )
}

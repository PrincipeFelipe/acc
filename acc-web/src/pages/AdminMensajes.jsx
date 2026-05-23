import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import AdminLayout from '../components/AdminLayout'

export default function AdminMensajes() {
    const [mensajes, setMensajes] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedMessage, setSelectedMessage] = useState(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        const { data } = await supabase.from('mensajes_contacto').select('*').order('created_at', { ascending: false })
        if (data) setMensajes(data)
        setLoading(false)
    }

    const markAsRead = async (id) => {
        await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', id)
        loadData()
    }

    const deleteMessage = async (id) => {
        if (!confirm('¿Eliminar este mensaje?')) return
        await supabase.from('mensajes_contacto').delete().eq('id', id)
        setSelectedMessage(null)
        loadData()
    }

    return (
        <AdminLayout>
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-display font-bold text-white mb-1">Mensajes de Contacto</h1>
                <p className="text-gray-400 font-light">Mensajes recibidos desde el formulario de contacto</p>
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
                                    onClick={() => { setSelectedMessage(msg); if (!msg.leido) markAsRead(msg.id) }}
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
    )
}

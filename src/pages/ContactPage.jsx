import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function ContactPage() {
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
    const [sending, setSending] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        AOS.init({ duration: 800, once: true })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        const { error } = await supabase.from('mensajes_contacto').insert([formData])

        if (error) {
            setToast({ message: 'Error al enviar. Inténtalo de nuevo.', type: 'error' })
        } else {
            setToast({ message: 'Mensaje enviado correctamente.', type: 'success' })
            setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
        }
        setSending(false)
    }

    const InputField = ({ label, type = "text", value, onChange, placeholder, required }) => (
        <div className="relative z-0 w-full mb-8 group">
            <input
                type={type}
                name={label}
                className="block py-2.5 px-0 w-full text-base text-dark bg-transparent border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors"
                placeholder=" "
                required={required}
                value={value}
                onChange={onChange}
            />
            <label
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
                {label} {required && '*'}
            </label>
        </div>
    )

    return (
        <div className="bg-white min-h-screen flex flex-col">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <PageHeader
                title="Contacto"
                subtitle="Cuéntanos sobre tu proyecto. Estamos listos para escuchar."
                image="https://images.unsplash.com/photo-1517581177697-0005ec4a0041?q=80&w=2574"
            />

            <main className="flex-grow">
                <section className="py-20 px-6 md:px-12 container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Contact Info */}
                        <div className="lg:w-5/12" data-aos="fade-right">
                            <h2 className="font-display text-3xl font-bold mb-8 text-dark">Información</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="size-12 bg-gray-50 flex items-center justify-center rounded-full text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">location_on</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark uppercase tracking-wide text-sm mb-1">Visítanos</h4>
                                        <p className="text-gray-500 font-body text-lg">Calle Principal 123,<br />28001 Madrid, España</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="size-12 bg-gray-50 flex items-center justify-center rounded-full text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark uppercase tracking-wide text-sm mb-1">Llámanos</h4>
                                        <p className="text-gray-500 font-body text-lg">+34 900 000 000</p>
                                        <p className="text-gray-400 text-sm mt-1">Lunes a Viernes, 9am - 6pm</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="size-12 bg-gray-50 flex items-center justify-center rounded-full text-dark group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-dark uppercase tracking-wide text-sm mb-1">Escríbenos</h4>
                                        <p className="text-gray-500 font-body text-lg">info@acc-construccion.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-12 w-full h-64 bg-gray-200 rounded-lg overflow-hidden relative group">
                                <div className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674")' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="bg-white/90 px-4 py-2 rounded shadow-lg text-xs font-bold uppercase tracking-widest text-dark">Mapa</span>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:w-7/12" data-aos="fade-left" data-aos-delay="200">
                            <div className="bg-white p-8 md:p-12 shadow-2xl border-t-4 border-primary">
                                <h2 className="font-display text-3xl font-bold mb-2 text-dark">Envíanos un mensaje</h2>
                                <p className="text-gray-500 mb-10">Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Nombre Completo"
                                            value={formData.nombre}
                                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                            required
                                        />
                                        <InputField
                                            label="Teléfono"
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                        />
                                    </div>

                                    <InputField
                                        label="Correo Electrónico"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />

                                    <div className="relative z-0 w-full mb-8 group">
                                        <textarea
                                            name="mensaje"
                                            rows="4"
                                            className="block py-2.5 px-0 w-full text-base text-dark bg-transparent border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none"
                                            placeholder=" "
                                            required
                                            value={formData.mensaje}
                                            onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                                        ></textarea>
                                        <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                                            Tu Mensaje *
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="w-full bg-dark text-white font-display font-medium uppercase tracking-widest py-4 hover:bg-primary transition-colors duration-300 disabled:opacity-50"
                                    >
                                        {sending ? 'Enviando...' : 'Enviar Estilo Arch'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

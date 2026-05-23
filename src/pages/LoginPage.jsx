import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) navigate('/admin')
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/admin')
        } catch (err) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.')
        }
        setLoading(false)
    }

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
    )
}

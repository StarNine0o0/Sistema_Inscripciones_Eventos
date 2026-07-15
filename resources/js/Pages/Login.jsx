import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        correo_institucional: '',
        contrasena: '',
        remember: false,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Iniciar sesión" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 px-4">
                <div className="w-full max-w-md">
                    {/* Logo / título de la app */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-4">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            EventosU
                        </h1>
                        <p className="text-indigo-100 text-sm mt-1">
                            Deportes, cultura y más en tu universidad
                        </p>
                    </div>

                    {/* Card del formulario */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Iniciar sesión
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="correo_institucional"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Correo institucional
                                </label>
                                <input
                                    id="correo_institucional"
                                    type="email"
                                    value={data.correo_institucional}
                                    onChange={(e) => setData('correo_institucional', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="tucorreo@universidad.edu"
                                    autoFocus
                                />
                                {errors.correo_institucional && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.correo_institucional}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="contrasena"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contraseña
                                </label>
                                <input
                                    id="contrasena"
                                    type="password"
                                    value={data.contrasena}
                                    onChange={(e) => setData('contrasena', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                    placeholder="••••••••"
                                />
                                {errors.contrasena && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.contrasena}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Recordarme
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
                            >
                                {processing ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-indigo-100 text-xs mt-6">
                        Sistema de eventos universitarios © {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </>
    );
}


export const EditPasswordForm = () => {
    return (
        <div>
             <h2 className="text-xl font-semibold text-gray-800 mb-6">Cambio de Contraseña</h2>
           <form className="space-y-4">
            <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual
                </label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tu contraseña actual"
                />
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nueva Contraseña
                </label>
                <input
                    type="password"
                    id="newPassword"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingrese su nueva contraseña"
                />
            </div>
            <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Nueva Contraseña
                </label>
                <input
                    type="password"
                    id="confirmNewPassword"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Confirme su nueva contraseña"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cambiar Contraseña
                </button>
            </div>
        </form> 
        </div>
        
    );
};
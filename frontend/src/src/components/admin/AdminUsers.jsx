import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

export default function AdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Campos del formulario
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('client');

  // Estado para capturar los errores en tiempo real
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Función de validación en tiempo real
  const validateField = (field, value) => {
    let errorMsg = '';
    if (field === 'name') {
      if (!value.trim()) errorMsg = 'El nombre es obligatorio.';
      else if (value.trim().length < 3) errorMsg = 'Mínimo 3 caracteres.';
    }
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = 'El correo es obligatorio.';
      else if (!emailRegex.test(value)) errorMsg = 'Formato de correo inválido.';
    }
    if (field === 'password') {
      if (!value) errorMsg = 'La contraseña es obligatoria.';
      else if (value.length < 6) errorMsg = 'Mínimo 6 caracteres.';
    }
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const fetchUsuarios = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return; // Doble protección

    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await apiClient.post('/users', {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('¡Usuario creado correctamente!');
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewRole('client');
      fetchUsuarios();
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      setError(error.response?.data?.error || 'Error al crear el usuario.');
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Determinar si el botón debe estar deshabilitado
  const isFormInvalid = 
    errors.name || errors.email || errors.password || 
    !newName || !newEmail || !newPassword;

  return (
    <div className="animate-fadeIn grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tabla de Usuarios */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-black text-purple-950 mb-2">Usuarios Registrados 👥</h1>
        <p className="text-gray-500 mb-6 font-medium">Lista oficial de cuentas registradas en el sistema.</p>

        {error && <p className="bg-pink-100 text-pink-700 p-3 rounded-xl mb-4 text-xs font-bold">{error}</p>}

        {loading ? (
          <p className="text-purple-600 font-bold text-sm animate-pulse">Cargando base de datos...</p>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-purple-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-purple-50 text-purple-950 text-xs font-black uppercase tracking-wider border-b border-purple-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-medium divide-y divide-purple-50">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-purple-50/50 transition">
                    <td className="px-6 py-4 text-purple-500 font-bold">#{u.id}</td>
                    <td className="px-6 py-4 text-gray-900 font-bold">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black capitalize ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulario Lateral Unificado */}
      <div className="bg-white/70 backdrop-blur-md border p-6 rounded-3xl shadow-xl h-fit">
        <h3 className="text-lg font-black text-purple-950 mb-1">Agregar Usuario ✨</h3>
        <p className="text-xs font-medium text-gray-400 mb-4">Registra una nueva cuenta directamente.</p>
        {success && <p className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl mb-4 text-xs font-bold text-center">{success}</p>}
        
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-1">Nombre Completo</label>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => { setNewName(e.target.value); validateField('name', e.target.value); }} 
              className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.name ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
              placeholder="Ej: Juan Pérez" 
              required 
            />
            {errors.name && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              value={newEmail} 
              onChange={(e) => { setNewEmail(e.target.value); validateField('email', e.target.value); }} 
              className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.email ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
              placeholder="usuario@correo.com" 
              required 
            />
            {errors.email && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-1">Contraseña</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => { setNewPassword(e.target.value); validateField('password', e.target.value); }} 
              className={`w-full px-3 py-2 border rounded-xl text-sm transition-colors ${errors.password ? 'border-pink-500 bg-pink-50/30' : 'border-purple-100'}`} 
              placeholder="••••••••" 
              required 
            />
            {errors.password && <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-purple-950 text-xs font-bold mb-1">Rol Asignado</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full px-3 py-2 border border-purple-100 rounded-xl text-sm">
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isFormInvalid}
            className={`w-full font-bold py-2.5 rounded-full text-sm shadow-md mt-2 transition-all ${
              isFormInvalid 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
            }`}
          >
            Crear Cuenta 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
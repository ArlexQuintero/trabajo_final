import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-100 to-indigo-100 px-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

      <form onSubmit={handleSubmit} className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/60">
        <h2 className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Iniciar Sesión ✨
        </h2>
        
        {error && (
          <p className="bg-pink-100/80 border border-pink-200 text-pink-700 p-3 rounded-2xl mb-4 text-xs font-semibold text-center">
            {error}
          </p>
        )}
        
        <div className="mb-4">
          <label className="block text-purple-950 text-sm font-bold mb-2">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-4 py-2.5 bg-white/80 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 font-medium transition" 
            required 
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-purple-950 text-sm font-bold mb-2">Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-4 py-2.5 bg-white/80 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 font-medium transition" 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-full shadow-lg shadow-purple-200 transition transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Ingresar 🌸
        </button>
        
        <p className="mt-6 text-center text-sm font-medium text-gray-500">
          ¿No tienes cuenta? <Link to="/register" className="text-purple-600 hover:underline font-bold">Regístrate</Link>
        </p>
      </form>

      {/* Enlace separado para ir a la página principal */}
      <div className="relative mt-6 z-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-bold text-purple-950/60 hover:text-purple-700 transition"
        >
          <span>← Volver al inicio de DOG-GO</span>
        </Link>
      </div>
    </div>
  );
}
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-black text-purple-300 tracking-widest mb-2">404</h1>
      <h2 className="text-2xl font-bold text-purple-900 mb-4">¡Oops! Ruta perdida en el espacio pastel</h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        La página que estás buscando no existe o fue movida a otra dimensión.
      </p>
      <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition">
        Regresar a Inicio 🏠
      </Link>
    </div>
  );
}

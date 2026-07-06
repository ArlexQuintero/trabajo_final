import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex flex-col items-center justify-center p-6 overflow-hidden">
  

      {/* Círculos decorativos de fondo con desenfoque (Efecto Aura) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      {/* Tarjeta Principal con Glassmorphism */}
      <div className="relative max-w-2xl text-center bg-white/40 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/60 transform hover:scale-[1.01] transition-all duration-300">
        <span className="inline-block bg-pink-200/60 text-pink-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-pink-300/30">
          Nueva Experiencia ✨
        </span>
        
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          Tu Espacio <br />
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            Pastel Favorito
          </span>
        </h1>
        
        <p className="text-gray-600 text-lg mb-10 font-medium leading-relaxed max-w-md mx-auto">
          Explora una tienda diseñada con amor. Encuentra productos exclusivos envueltos en una atmósfera suave, mágica y segura.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/shop" className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-purple-300/50 transition transform hover:-translate-y-1 active:translate-y-0 text-center">
            Explorar Catálogo 🛍️
          </Link>
          <Link to="/login" className="w-full sm:w-auto bg-white/70 hover:bg-white/90 text-purple-700 font-bold px-10 py-4 rounded-full border border-purple-200/60 transition shadow-sm hover:shadow-md text-center">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

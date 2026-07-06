import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const validateField = (field, value) => {
    let errorMsg = "";

    if (field === "name") {
      if (!value.trim()) errorMsg = "El nombre completo es obligatorio.";
      else if (value.trim().length < 3) errorMsg = "El nombre debe tener al menos 3 caracteres.";
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) errorMsg = "El correo electrónico es obligatorio.";
      else if (!emailRegex.test(value)) errorMsg = "Formato de correo inválido.";
    }

    if (field === "password") {
      if (!value) errorMsg = "La contraseña es obligatoria.";
      else if (value.length < 6) errorMsg = "La contraseña debe tener mínimo 6 caracteres.";
    }

    if (field === "phone") {
      const phoneRegex = /^[0-9]+$/;
      if (!value.trim()) {
        errorMsg = "El teléfono es obligatorio.";
      } else if (!phoneRegex.test(value)) {
        errorMsg = "El teléfono solo debe contener números.";
      } else if (value.trim().length < 7) {
        errorMsg = "El teléfono debe tener al menos 7 dígitos.";
      }
    }

    if (field === "address" && !value.trim()) {
      errorMsg = "La dirección de entrega es obligatoria.";
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    try {
      await apiClient.post("/auth/register", formData);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Error en el registro");
    }
  };

  const isFormInvalid =
    Object.values(errors).some((err) => err !== "") ||
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.phone ||
    !formData.address;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-100 to-indigo-100 px-4 py-8 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/60"
      >
        <h2 className="text-3xl font-black text-center mb-1 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Crear Cuenta ✨
        </h2>
        <p className="text-center text-xs font-medium text-gray-500 mb-6">
          Únete y simula tus pedidos de forma rápida.
        </p>
        
        {error && (
          <p className="bg-pink-100/80 border border-pink-200 text-pink-700 p-3 rounded-2xl mb-4 text-xs font-semibold text-center">
            {error}
          </p>
        )}

        {["name", "email", "password", "phone", "address"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-purple-950 text-sm font-bold mb-1">
              {field === "name"
                ? "Nombre Completo"
                : field === "password"
                  ? "Contraseña"
                  : field === "phone"
                    ? "Teléfono"
                    : field === "address"
                      ? "Dirección de Entrega"
                      : field}
            </label>
            <input
              type={
                field === "password"
                  ? "password"
                  : field === "email"
                    ? "email"
                    : "text"
              }
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={
                field === "name"
                  ? "Ej: Juan Pérez"
                  : field === "email"
                    ? "usuario@correo.com"
                    : field === "password"
                      ? "••••••••"
                      : field === "phone"
                        ? "3001234567"
                        : "Ej: Calle 10 # 5-25"
              }
              className={`w-full px-4 py-2.5 bg-white/80 border rounded-xl focus:outline-none focus:ring-2 font-medium transition text-gray-700 ${
                errors[field]
                  ? "border-pink-500 bg-pink-50/40 focus:ring-pink-400"
                  : "border-purple-200 focus:ring-purple-400"
              }`}
            />
            {errors[field] && (
              <p className="text-pink-600 text-[11px] font-bold mt-1 pl-1">
                {errors[field]}
              </p>
            )}
          </div>
        ))}

        <p className="mt-4 text-center text-sm font-medium text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-purple-600 hover:underline font-bold">
            Iniciar sesión
          </Link>
        </p>

        <button
          type="submit"
          disabled={isFormInvalid}
          className={`w-full font-bold py-3 px-4 rounded-full shadow-lg transition transform mt-6 ${
            isFormInvalid
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          Registrarse 🚀
        </button>
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
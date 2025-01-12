"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import EyeIcon from "../assets/EyeIcon";
import EyeSlashIcon from "../assets/EyeSlashIcon";
import HelpIcon from "../assets/HelpIcon";

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const modalRef = useRef(null); // Referencia al modal
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/auth/login", data);

      if (response.status === 200) {
        const { role } = response.data;
        if (role.id === 1) {
          router.push("/admin/dashboard");
        } else if (role.id === 2) {
          router.push("/client/identify");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Usuario y/o contraseña incorrectos.");
    }
  };

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  // Manejar clics fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeHelpModal();
      }
    };

    if (isHelpModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHelpModalOpen]);

  return (
    <div className="container_login">
      <button onClick={openHelpModal} className="help-icon">
        <HelpIcon />
      </button>
      <br />

      {isHelpModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <button onClick={closeHelpModal} className="close-modal-2" aria-label="Cerrar">
              &times;
            </button>
            <br />

            <h2>Instrucciones para activar tu cuenta y poder iniciar sesión:</h2>
            <ol>
              <li>
                <p>Comunícate con el administrador:</p>
                <p className="normal">Proporciona tu nombre completo y la información solicitada para que registre y active tu cuenta.</p>
              </li>
              <li>
                <p>Accede a la plataforma:</p>
                <p className="normal">Una vez activada, recibirás tu usuario y una contraseña temporal. Usa estos datos para iniciar sesión y cambia tu contraseña al ingresar por primera vez.</p>
              </li>
              <li>
                <p>Restablece tu contraseña:</p>
                <p className="normal">Si olvidas tu contraseña temporal, contacta al administrador para restablecerla.</p>
              </li>
              <li>
                <p>Si tienes problemas:</p>
                <p className="normal">Ante cualquier problema, contacta al soporte técnico para asistencia.</p>
              </li>
            </ol>
          </div>
        </div>
      )}

      <div className="container_center">
        <figure className="container_img">
          <img src="/img/logo_original.png" alt="Universidad Modelo" />
        </figure>
        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <label htmlFor="us_usuario">Usuario:</label>
          <input type="text" id="us_usuario" className={`input-field ${errors.us_usuario ? "input-error" : ""}`} {...register("us_usuario", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres.", }, })} />
          {errors.us_usuario && (
            <span className="error">{errors.us_usuario.message}</span>
          )}
          <br /><br />

          <label htmlFor="us_contrasena">Contraseña:</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} id="us_contrasena" className={`input-field ${errors.us_contrasena ? "input-error" : ""}`} {...register("us_contrasena", { required: "Este campo es obligatorio.", maxLength: { value: 10, message: "El campo solo admite 10 caracteres.", }, })} />
            <span onClick={togglePasswordVisibility} className="toggle_password">
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </div>
          {errors.us_contrasena && (
            <span className="error">{errors.us_contrasena.message}</span>
          )}
          <br />

          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}

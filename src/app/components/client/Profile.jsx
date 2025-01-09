"use client";

import { useRouter, usePathname } from "next/navigation";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import EyeIcon from "../../assets/EyeIcon";
import EyeSlashIcon from "../../assets/EyeSlashIcon";

export default function Profile({ show, userData }) {
  const pathname = usePathname();
  const router = useRouter();

  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Configuración de react-hook-form
  const {
    register, handleSubmit, setValue, reset, formState: { errors },
  } = useForm({
    defaultValues: {
      us_nombres: "",
      us_apellido_paterno: "",
      us_apellido_materno: "",
      us_usuario: "",
      us_correo: "",
      us_contrasena: "",
    },
  });

  // Cargar los datos del usuario en el formulario cuando se abra el modal
  useEffect(() => {
    if (userData) {
      reset({
        us_nombres: userData.us_nombres || "",
        us_apellido_paterno: userData.us_apellido_paterno || "",
        us_apellido_materno: userData.us_apellido_materno || "",
        us_usuario: userData.us_usuario || "",
        us_correo: userData.us_correo || "",
        us_contrasena: "",
      });
    }
  }, [userData, reset]);

  // Manejar el envío del formulario para actualizar los datos
  const onSubmit = async (data) => {
    try {
      const updatedData = { ...data };
      // No enviar el campo de contraseña si está vacío
      if (!data.us_contrasena) {
        delete updatedData.us_contrasena;
      }

      await axios.put("/api/auth/profile", updatedData, { withCredentials: true });
      toast.success("Datos actualizados exitosamente.");
      router.push(pathname); // Redirigir a la misma ruta

      // Limpiar el campo de contraseña
      setValue("us_contrasena", "");
    } catch (error) {
      toast.error("No se pudo actualizar los datos.");
    }
  };

  const closeModal = () => {
    router.replace(pathname);
  };

  // Alternar la visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button>
        <br />

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            <label htmlFor="us_nombres">Nombre(s) *:</label><br />
            <input type="text" id="us_nombres" {...register("us_nombres", { required: "Este campo es obligatorio." })} />
            {errors.us_nombres && <span className="error">{errors.us_nombres.message}</span>}
            <br />

            <label htmlFor="us_apellido_paterno">Apellido paterno *:</label><br />
            <input type="text" id="us_apellido_paterno" {...register("us_apellido_paterno", { required: "Este campo es obligatorio." })} />
            {errors.us_apellido_paterno && <span className="error">{errors.us_apellido_paterno.message}</span>}
            <br />

            <label htmlFor="us_apellido_materno">Apellido materno *:</label><br />
            <input type="text" id="us_apellido_materno" {...register("us_apellido_materno", { required: "Este campo es obligatorio." })} />
            {errors.us_apellido_materno && <span className="error">{errors.us_apellido_materno.message}</span>}
            <br />

            <label htmlFor="us_usuario">Usuario *:</label><br />
            <input type="text" id="us_usuario" {...register("us_usuario", { required: "Este campo es obligatorio." })} />
            {errors.us_usuario && <span className="error">{errors.us_usuario.message}</span>}
            <br />

            <label htmlFor="us_contrasena">Contraseña:</label><br />
            <div className="relative_profile">
              <input type={showPassword ? "text" : "password"} id="us_contrasena" {...register("us_contrasena", { maxLength: { value: 10, message: "El campo solo admite 10 caracteres.", }, })} />
              <span onClick={togglePasswordVisibility} className="toggle_password_profile">
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </span>
            </div>
            {errors.us_contrasena && <span className="error">{errors.us_contrasena.message}</span>}

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

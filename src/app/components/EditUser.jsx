"use client";

import Modal from "./Modal";
import { useEffect, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

async function loadUser(userId) {
  try {
    const { data } = await axios.get(`/api/admin/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos del usuario.");
  }
}

export default function EditUser({ show }) {
  const pathname = usePathname();
  const { id } = useParams();
  const router = useRouter();
  const [originalData, setOriginalData] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    loadUser(id)
      .then((data) => {
        // Guardar los datos originales para restaurarlos cuando se cierre el modal
        setOriginalData({
          us_nombres: data.us_nombres,
          us_apellido_paterno: data.us_apellido_paterno,
          us_apellido_materno: data.us_apellido_materno,
          us_usuario: data.us_usuario,
          us_gen_id: data.gen_id,
          us_rol_id: data.rol_id,
          us_esc_id: data.esc_id,
          us_es_id: data.es_id,
        });
        // Usar reset para establecer los valores del formulario
        reset({
          us_nombres: data.us_nombres,
          us_apellido_paterno: data.us_apellido_paterno,
          us_apellido_materno: data.us_apellido_materno,
          us_usuario: data.us_usuario,
          us_gen_id: data.gen_id,
          us_rol_id: data.rol_id,
          us_esc_id: data.esc_id,
          us_es_id: data.es_id,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id, reset]);

  async function handleFormSubmit(data) {
    try {
      const res = await axios.put(`/api/admin/${id}`, data);

      if (res.status !== 200) {
        throw new Error(res.data.message || "Error al actualizar el usuario.");
      }

      toast.success(res.data.message || "Usuario actualizado exitosamente.");
      router.refresh();
      router.push("/admin/usuarios");
    } catch (error) {
      toast.error(error.message || "Error al actualizar el usuario.");
    }
  }

  const closeModal = () => {
    if (originalData) {
      reset(originalData); // Restaurar valores originales al cerrar
    }

    router.replace(pathname);
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
          <form onSubmit={handleSubmit(handleFormSubmit)} method="post">
            <label htmlFor="us_nombres">Nombre(s) *:</label><br />
            <input type="text" id="us_nombres" className={`input-field ${errors.us_nombres ? "input-error" : ""}`} {...register("us_nombres", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." }, })} />
            {errors.us_nombres && <span className="error">{errors.us_nombres.message}</span>}
            <br />

            <label htmlFor="us_apellido_paterno">Apellido paterno *:</label><br />
            <input type="text" id="us_apellido_paterno" className={`input-field ${errors.us_apellido_paterno ? "input-error" : ""}`} {...register("us_apellido_paterno", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." }, })} />
            {errors.us_apellido_paterno && <span className="error">{errors.us_apellido_paterno.message}</span>}
            <br />

            <label htmlFor="us_apellido_materno">Apellido materno *:</label><br />
            <input type="text" id="us_apellido_materno" className={`input-field ${errors.us_apellido_materno ? "input-error" : ""}`} {...register("us_apellido_materno", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." }, })} />
            {errors.us_apellido_materno && <span className="error">{errors.us_apellido_materno.message}</span>}
            <br />

            <label htmlFor="us_usuario">Usuario *:</label><br />
            <input type="text" id="us_usuario" className={`input-field ${errors.us_usuario ? "input-error" : ""}`} {...register("us_usuario", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." }, })} />
            {errors.us_usuario && <span className="error">{errors.us_usuario.message}</span>}
            <br />

            <label htmlFor="us_gen_id">Género *:</label><br />
            <select id="us_gen_id" className={`input-field ${errors.us_gen_id ? "input-error" : ""}`} {...register("us_gen_id", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="1">Masculino</option>
              <option value="2">Femenina</option>
            </select>
            {errors.us_gen_id && <span className="error">{errors.us_gen_id.message}</span>}
            <br />

            <label htmlFor="us_rol_id">Cargo *:</label><br />
            <select id="us_rol_id" className={`input-field ${errors.us_rol_id ? "input-error" : ""}`} {...register("us_rol_id", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="1">Administrador</option>
              <option value="2">Profesor</option>
            </select>
            {errors.us_rol_id && <span className="error">{errors.us_rol_id.message}</span>}
            <br />

            <label htmlFor="us_esc_id">Escuela *:</label><br />
            <select id="us_esc_id" className={`input-field ${errors.us_esc_id ? "input-error" : ""}`} {...register("us_esc_id", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="1">General</option>
              <option value="2">Arquitectura</option>
              <option value="3">Derecho</option>
              <option value="4">Diseño</option>
              <option value="5">Humanidades</option>
              <option value="6">Ingeniería</option>
              <option value="7">Negocios</option>
              <option value="8">Salud</option>
            </select>
            {errors.us_esc_id && <span className="error">{errors.us_esc_id.message}</span>}
            <br />

            <label htmlFor="us_es_id">Estado *:</label><br />
            <select id="us_es_id" className={`input-field ${errors.us_es_id ? "input-error" : ""}`} {...register("us_es_id", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="1">Alta</option>
              <option value="2">Baja</option>
            </select>
            {errors.us_es_id && <span className="error">{errors.us_es_id.message}</span>}
            <br />

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

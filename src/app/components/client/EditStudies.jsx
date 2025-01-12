"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";
import HelpIcon from "../../assets/HelpIcon";
import { useForm } from "react-hook-form";

async function loadData(est_id) {
  try {
    const { data } = await axios.get(`/api/client/studies/${est_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de estudio.");
  }
}

const formatDateForInput = (isoString) => {
  if (!isoString) return ""; // Si no hay fecha, devolver una cadena vacía
  try {
    const date = new Date(isoString); // Crear un objeto Date
    return date.toISOString().split("T")[0]; // Obtener solo la parte de la fecha en formato "YYYY-MM-DD"
  } catch {
    return ""; // Si ocurre un error, devolver una cadena vacía
  }
};

export default function EditStudies({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadData(id)
      .then((data) => {
        const formattedData = {
          ...data,
          est_fecha_obtencion_titulo: formatDateForInput(data.est_fecha_obtencion_titulo), // Formatear la fecha
        };
        setOriginalData(formattedData); // Guardar los valores originales
        reset(formattedData); // Inicializar el formulario con los valores formateados
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id, reset]);

  const closeModal = () => {
    if (originalData) {
      reset(originalData); // Restaurar los valores originales del formulario
    }

    router.replace(pathname);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`/api/client/studies/${id}`, data);
      toast.success(response.data.message || "Estudios actualizados correctamente.");
      router.refresh();
      router.push("/client/studies");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al actualizar el estudio.");
    }
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            <label htmlFor="est_nivel_estudios">Nivel de estudios *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nivel académico alcanzado."><HelpIcon /></span>
            </label><br />
            <select id="est_nivel_estudios" className={`input-field ${errors.est_nivel_estudios ? "input-error" : ""}`} {...register('est_nivel_estudios', { required: 'Este campo es obligatorio.' })}>
              <option value="">Selecciona una opción</option>
              <option value="Doctorado">Doctorado</option>
              <option value="Maestria">Maestría</option>
              <option value="Licenciatura">Licenciatura</option>
            </select>
            {errors.est_nivel_estudios && <span className="error">{errors.est_nivel_estudios.message}</span>}
            <br />

            <label htmlFor="est_area_estudio">Área *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Campo de estudio o disciplina principal."><HelpIcon /></span>
            </label><br />
            <select id="est_area_estudio" className={`input-field ${errors.est_area_estudio ? "input-error" : ""}`} {...register('est_area_estudio', { required: 'Este campo es obligatorio.' })}>
              <option value="">Selecciona una opción</option>
              <option value="Físico-matemáticas y ciencias de la tierra">I. Físico-matemáticas y ciencias de la tierra</option>
              <option value="Biología y química">II. Biología y química</option>
              <option value="Medicinas y ciencias de la salud">III. Medicinas y ciencias de la salud</option>
              <option value="Ciencias de la conducta y la educación">IV. Ciencias de la conducta y la educación</option>
              <option value="Humanidades">V. Humanidades</option>
              <option value="Ciencias sociales">VI. Ciencias sociales</option>
              <option value="Ciencias de agricultura, agropecuarias, forestales y de ecosistemas">VII. Ciencias de agricultura, agropecuarias, forestales y de ecosistemas</option>
              <option value="Ingenieria y desarrollo tecnológico">VIII. Ingenieria y desarrollo tecnológico</option>
              <option value="Interdisciplinaria">IX. Interdisciplinaria</option>
            </select>
            {errors.est_area_estudio && <span className="error">{errors.est_area_estudio.message}</span>}
            <br />

            <label htmlFor="est_disciplina_estudio">Disciplina *:</label><br />
            <input type="text" id="est_disciplina_estudio" className={`input-field ${errors.est_disciplina_estudio ? "input-error" : ""}`} {...register('est_disciplina_estudio', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' } })} />
            {errors.est_disciplina_estudio && <span className="error">{errors.est_disciplina_estudio.message}</span>}
            <br />

            <label htmlFor="est_fecha_obtencion_titulo">Fecha de obtención del título o grado *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Fecha en que se emitió el título o grado."><HelpIcon /></span>
            </label><br />
            <input type="date" id="est_fecha_obtencion_titulo" className={`input-field ${errors.est_fecha_obtencion_titulo ? "input-error" : ""}`} {...register('est_fecha_obtencion_titulo', { required: 'Este campo es obligatorio.' })} />
            {errors.est_fecha_obtencion_titulo && <span className="error">{errors.est_fecha_obtencion_titulo.message}</span>}
            <br />

            <label htmlFor="est_institucion_otorgante">Institución otorgante:</label><br />
            <input type="text" id="est_institucion_otorgante" className={`input-field ${errors.est_institucion_otorgante ? "input-error" : ""}`} {...register('est_institucion_otorgante', { maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' } })} />
            {errors.est_institucion_otorgante && <span className="error">{errors.est_institucion_otorgante.message}</span>}
            <br />

            <label htmlFor="est_pais_institucion">País *:</label><br />
            <input type="text" id="est_pais_institucion" className={`input-field ${errors.est_pais_institucion ? "input-error" : ""}`} {...register('est_pais_institucion', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' } })} />
            {errors.est_pais_institucion && <span className="error">{errors.est_pais_institucion.message}</span>}
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

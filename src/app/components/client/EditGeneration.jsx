"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";
import HelpIcon from "../../assets/HelpIcon";
import { useForm } from "react-hook-form";

async function loadData(lg_id) {
  try {
    const { data } = await axios.get(`/api/client/generationline/${lg_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de linea de generación.");
  }
}

export default function EditGeneration({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadData(id)
      .then((data) => {
        setOriginalData(data); // Guardar los valores originales
        reset(data); // Inicializar el formulario con los valores cargados
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
      const response = await axios.put(`/api/client/generationline/${id}`, data);
      toast.success(response.data.message || "Linea de generación actualizada correctamente.");
      router.refresh();
      router.push('/client/generationline');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al actualizar la linea de generación.");
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
            <label htmlFor="li_linea">Linea *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nombre de la línea de generación."><HelpIcon /></span>
            </label><br />
            <input type="text" id="li_linea" name="li_linea" {...register("li_linea")} disabled readOnly /><br />

            <label htmlFor="lg_actividad_realiza">Actividad realiza *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de trabajo dentro de la línea de investigación.">
                <HelpIcon />
              </span>
            </label><br />
            <input type="text" id="lg_actividad_realiza" name="lg_actividad_realiza" className={`input-field ${errors.lg_actividad_realiza ? "input-error" : ""}`} {...register("lg_actividad_realiza", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." } })} />
            {errors.lg_actividad_realiza && <span className="error">{errors.lg_actividad_realiza.message}</span>}
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

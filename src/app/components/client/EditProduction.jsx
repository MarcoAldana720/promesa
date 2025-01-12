"use client";

import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, usePathname } from "next/navigation";
import HelpIcon from "../../assets/HelpIcon";
import { useForm } from "react-hook-form";

async function loadProductionData(pd_id) {
  try {
    const { data } = await axios.get(`/api/client/academicproduction/${pd_id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Error al cargar los datos de producción.");
  }
}

const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export default function EditProduction({ show }) {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [selectedOption, setSelectedOption] = useState("");
  const [originalData, setOriginalData] = useState(null);
  const { register, handleSubmit, setValue, control, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      art_autores: "",
      art_estado_actual: "",
      art_de_la_pagina: "",
      art_a_la_pagina: "",
      art_pais: "",
      art_volumen: "",
      art_fecha_publicacion: "",
      art_tipo_articulo: "",
      art_titulo_articulo: "",
      art_nombre_revista: "",
      art_editorial: "",
      art_issn: "",
      art_direccion_electronica: "",
      lib_autores: "",
      lib_estado_actual: "",
      lib_pagina: "",
      lib_pais: "",
      lib_edicion: "",
      lib_isbn: "",
      lib_titulo_libro: "",
      lib_tipo_libro: "",
      lib_editorial: "",
    },
  });

  useEffect(() => {
    loadProductionData(id)
      .then((data) => {
        setSelectedOption(data.tp_id === 1 ? "1" : "2");
        const formattedData = {
          ...data,
          art_fecha_publicacion: formatDateForInput(data.art_fecha_publicacion),
          lib_fecha_publicacion: formatDateForInput(data.lib_fecha_publicacion),
        };
        setOriginalData(formattedData); // Guardar datos originales
        reset(formattedData); // Inicializar formulario
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`/api/client/academicproduction/${id}`, data);
      toast.success(response.data.message || "Estudio actualizado correctamente.");
      router.refresh();
      router.push("/client/academicproduction");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al actualizar el estudio.");
    }
  };

  const closeModal = () => {
    if (originalData) {
      reset(originalData); // Restaurar valores originales al cerrar
    }

    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button>
        <br />

        <div className="form">
          <label htmlFor="pd_id">
            Tipo de Producción *:
            <span className="tooltip-icon highlight-icon" data-tooltip="Clasifica el tipo de producción.">
              <HelpIcon />
            </span>
          </label>
          <select name="pd_id" id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} disabled >
            <option value="">Selecciona una opción</option>
            <option value="1">Artículo</option>
            <option value="2">Libro</option>
          </select>
          <br />

          <form onSubmit={handleSubmit(onSubmit)} method="post">
            {selectedOption === "1" && (
              <>
                <label htmlFor="art_autores">Autor(es) *:</label><br />
                <input type="text" className={`input-field ${errors.art_autores ? "input-error" : ""}`} {...register("art_autores", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_autores && <span className="error">{errors.art_autores.message}</span>}<br />

                <label htmlFor="art_estado_actual">Estado Actual *:</label><br />
                <input type="text" className={`input-field ${errors.art_estado_actual ? "input-error" : ""}`} {...register("art_estado_actual", { required: "Este campo es obligatorio.", maxLength: { value: 10, message: "El campo solo admite 10 caracteres." }, })} />
                {errors.art_estado_actual && <span className="error">{errors.art_estado_actual.message}</span>}<br />

                <label htmlFor="art_de_la_pagina">De la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" name="art_de_la_pagina" id="art_de_la_pagina" className={`input-field ${errors.art_de_la_pagina ? "input-error" : ""}`} {...register("art_de_la_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.art_de_la_pagina && <span className="error">{errors.art_de_la_pagina.message}</span>}<br />

                <label htmlFor="art_a_la_pagina">A la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" name="art_a_la_pagina" id="art_a_la_pagina" className={`input-field ${errors.art_a_la_pagina ? "input-error" : ""}`} {...register("art_a_la_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.art_a_la_pagina && <span className="error">{errors.art_a_la_pagina.message}</span>}<br />

                <label htmlFor="art_pais">País *:</label><br />
                <input type="text" name="art_pais" id="art_pais" className={`input-field ${errors.art_pais ? "input-error" : ""}`} {...register("art_pais", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.art_pais && <span className="error">{errors.art_pais.message}</span>}<br />

                <label htmlFor="art_volumen">Volumen *:</label><br />
                <input type="number" name="art_volumen" id="art_volumen" className={`input-field ${errors.art_volumen ? "input-error" : ""}`} {...register("art_volumen", { required: "Este campo es obligatorio.", maxLength: { value: 10, message: "El campo solo admite 10 caracteres." }, })} />
                {errors.art_volumen && <span className="error">{errors.art_volumen.message}</span>}<br />

                <label htmlFor="art_fecha_publicacion">Fecha de publicación *:</label><br />
                <input type="date" name="art_fecha_publicacion" id="art_fecha_publicacion" className={`input-field ${errors.art_fecha_publicacion ? "input-error" : ""}`} {...register("art_fecha_publicacion", { required: "Este campo es obligatorio." })} />
                {errors.art_fecha_publicacion && <span className="error">{errors.art_fecha_publicacion.message}</span>}<br />

                <label htmlFor="art_tipo_articulo">Tipo de artículo *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del articulo."><HelpIcon /></span>
                </label><br />
                <select name="art_tipo_articulo" id="art_tipo_articulo" className={`input-field ${errors.art_tipo_articulo ? "input-error" : ""}`} {...register("art_tipo_articulo", { required: "Este campo es obligatorio." })} >
                  <option value="">Selecciona una opción</option>
                  <option value="Artículo de difusión y divulgación">Articulo de difusion y divulgacion</option>
                  <option value="Artículo de arbitrado">Artículo de arbitrado</option>
                  <option value="Artículo en revista indexada">Artículo en revista indexada</option>
                </select>
                {errors.art_tipo_articulo && <span className="error">{errors.art_tipo_articulo.message}</span>}<br />

                <label htmlFor="art_titulo_articulo">Título del artículo *:</label><br />
                <input type="text" name="art_titulo_articulo" id="art_titulo_articulo" className={`input-field ${errors.art_titulo_articulo ? "input-error" : ""}`} {...register("art_titulo_articulo", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_titulo_articulo && <span className="error">{errors.art_titulo_articulo.message}</span>}<br />

                <label htmlFor="art_nombre_revista">Nombre de la revista *:</label><br />
                <input type="text" name="art_nombre_revista" id="art_nombre_revista" className={`input-field ${errors.art_nombre_revista ? "input-error" : ""}`} {...register("art_nombre_revista", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_nombre_revista && <span className="error">{errors.art_nombre_revista.message}</span>}<br />

                <label htmlFor="art_editorial">Editorial *:</label><br />
                <input type="text" name="art_editorial" id="art_editorial" className={`input-field ${errors.art_editorial ? "input-error" : ""}`} {...register("art_editorial", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_editorial && <span className="error">{errors.art_editorial.message}</span>}<br />

                <label htmlFor="art_issn">ISSN *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Código que identifica publicaciones seriadas."><HelpIcon /></span>
                </label><br />
                <input type="text" name="art_issn" id="art_issn" className={`input-field ${errors.art_issn ? "input-error" : ""}`} {...register("art_issn", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_issn && <span className="error">{errors.art_issn.message}</span>}<br />

                <label htmlFor="art_direccion_electronica">Dirección electrónica del artículo:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Enlace electrónico para consultar el artículo."><HelpIcon /></span>
                </label><br />
                <input type="text" name="art_direccion_electronica" id="art_direccion_electronica" className={`input-field ${errors.art_direccion_electronica ? "input-error" : ""}`} {...register("art_direccion_electronica", { maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_direccion_electronica && <span className="error">{errors.art_direccion_electronica.message}</span>}<br />
              </>
            )}

            {selectedOption === "2" && (
              <>
                <label htmlFor="lib_autores">Autor(es) del Libro *:</label><br />
                <input type="text" className={`input-field ${errors.lib_autores ? "input-error" : ""}`} {...register("lib_autores", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." } })} />
                {errors.lib_autores && <span className="error">{errors.lib_autores.message}</span>}<br />

                <label htmlFor="lib_estado_actual">Estado Actual del Libro *:</label><br />
                <select className={`input-field ${errors.lib_estado_actual ? "input-error" : ""}`} {...register("lib_estado_actual", { required: "Este campo es obligatorio." })} >
                  <option value="">Selecciona una opción</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Publicado">Publicado</option>
                </select>
                {errors.lib_estado_actual && <span className="error">{errors.lib_estado_actual.message}</span>}<br />

                <label htmlFor="lib_pagina">Páginas *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Número total de páginas del libro."><HelpIcon /></span>
                </label><br />
                <input type="number" id="lib_pagina" className={`input-field ${errors.lib_pagina ? "input-error" : ""}`} {...register("lib_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.lib_pagina && <span className="error">{errors.lib_pagina.message}</span>}<br />

                <label htmlFor="lib_pais">País *:</label><br />
                <input type="text" id="lib_pais" className={`input-field ${errors.lib_pais ? "input-error" : ""}`} {...register("lib_pais", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.lib_pais && <span className="error">{errors.lib_pais.message}</span>}<br />

                <label htmlFor="lib_edicion">Edición *:</label><br />
                <input type="number" id="lib_edicion" className={`input-field ${errors.lib_edicion ? "input-error" : ""}`} {...register("lib_edicion", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.lib_edicion && <span className="error">{errors.lib_edicion.message}</span>}<br />

                <label htmlFor="lib_isbn">ISBN:</label><br />
                <input type="text" id="lib_isbn" className={`input-field ${errors.lib_isbn ? "input-error" : ""}`} {...register("lib_isbn", { maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_isbn && <span className="error">{errors.lib_isbn.message}</span>}<br />

                <label htmlFor="lib_titulo_libro">Título de libro *:</label><br />
                <input type="text" id="lib_titulo_libro" className={`input-field ${errors.lib_titulo_libro ? "input-error" : ""}`} {...register("lib_titulo_libro", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_titulo_libro && <span className="error">{errors.lib_titulo_libro.message}</span>}<br />

                <label htmlFor="lib_tipo_libro">Tipo de libro *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del libro."><HelpIcon /></span>
                </label><br />
                <select id="lib_tipo_libro" className={`input-field ${errors.lib_tipo_libro ? "input-error" : ""}`} {...register("lib_tipo_libro", { required: "Este campo es obligatorio." })} >
                  <option value="">Selecciona una opción</option>
                  <option value="Capítulo de libro">Capítulo de libro</option>
                  <option value="Libro">Libro</option>
                </select>
                {errors.lib_tipo_libro && <span className="error">{errors.lib_tipo_libro.message}</span>}<br />

                <label htmlFor="lib_editorial">Editorial *:</label><br />
                <input type="text" id="lib_editorial" className={`input-field ${errors.lib_editorial ? "input-error" : ""}`} {...register("lib_editorial", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_editorial && <span className="error">{errors.lib_editorial.message}</span>}<br />

                <label htmlFor="lib_tiraje">Tiraje *:</label><br />
                <input type="number" id="lib_tiraje" className={`input-field ${errors.lib_tiraje ? "input-error" : ""}`} {...register("lib_tiraje", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_tiraje && <span className="error">{errors.lib_tiraje.message}</span>}<br />

                <label htmlFor="lib_fecha_publicacion">Fecha de publicación *:</label><br />
                <input type="date" id="lib_fecha_publicacion" className={`input-field ${errors.lib_fecha_publicacion ? "input-error" : ""}`} {...register("lib_fecha_publicacion", { required: "Este campo es obligatorio." })} />
                {errors.lib_fecha_publicacion && <span className="error">{errors.lib_fecha_publicacion.message}</span>}<br />
              </>
            )}

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

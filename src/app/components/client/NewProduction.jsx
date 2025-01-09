"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import HelpIcon from "../../assets/HelpIcon";

export default function NewProduction({ show }) {
  const [selectedOption, setSelectedOption] = useState("");
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const pathname = usePathname();
  const router = useRouter();

  const onSubmit = async (data) => {
    let payload = {
      tipo_produccion: selectedOption === "1" ? "articulo" : "libro",
      titulo: data[selectedOption === "1" ? "art_titulo_articulo" : "lib_titulo_libro"],
      fecha_publicacion: data[selectedOption === "1" ? "art_fecha_publicacion" : "lib_fecha_publicacion"],
      detalles: {},
    };

    if (selectedOption === "1") {
      payload.detalles = {
        autores: data.art_autores,
        estado_actual: data.art_estado_actual,
        de_la_pagina: data.art_de_la_pagina,
        a_la_pagina: data.art_a_la_pagina,
        pais: data.art_pais,
        volumen: data.art_volumen,
        nombre_revista: data.art_nombre_revista,
        editorial: data.art_editorial,
        issn: data.art_issn,
        direccion_electronica: data.art_direccion_electronica,
        tipo_articulo: data.art_tipo_articulo,
      };
    } else if (selectedOption === "2") {
      payload.detalles = {
        autores: data.lib_autores,
        estado_actual: data.lib_estado_actual,
        pagina: data.lib_pagina,
        pais: data.lib_pais,
        edicion: data.lib_edicion,
        isbn: data.lib_isbn,
        editorial: data.lib_editorial,
        tiraje: data.lib_tiraje || null,
        tipo_libro: data.lib_tipo_libro,
      };
    }

    try {
      const res = await axios.post("/api/client/academicproduction", payload);
      toast.success(res.data.message || "Datos guardados exitosamente.");
      reset();
      setSelectedOption(""); // Reinicia el valor del select de tipo de produccion
      router.push("/client/academicproduction");
    } catch (error) {
      const errorMsg = error.response?.data.message || "Error al guardar los datos.";
      toast.error(errorMsg);
    }
  };

  const closeModal = () => {
    reset();
    setSelectedOption(""); // Reinicia el valor del select de tipo de produccion
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
            Tipo de producción *:
            <span className="tooltip-icon highlight-icon" data-tooltip="Clasifica el tipo de producción.">
              <HelpIcon />
            </span>
          </label>
          <select {...register("pd_id", { required: "Este campo es obligatorio." })} id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} >
            <option value="">Selecciona una opción</option>
            <option value="1">Artículo</option>
            <option value="2">Libro</option>
          </select>
          {errors.pd_id && <span className="error">{errors.pd_id.message}</span>}
          <br />

          <form onSubmit={handleSubmit(onSubmit)}>
            {selectedOption === "1" && (
              <>
                <label htmlFor="art_autores">Autor(es) *:</label><br />
                <input {...register("art_autores", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} id="art_autores" />
                {errors.art_autores && <span className="error">{errors.art_autores.message}</span>}
                <br />

                <label htmlFor="art_estado_actual">Estado actual *:</label><br />
                <input {...register("art_estado_actual", { required: "Este campo es obligatorio.", maxLength: { value: 10, message: "El campo solo admite 10 caracteres." }, })} id="art_estado_actual" />
                {errors.art_estado_actual && <span className="error">{errors.art_estado_actual.message}</span>}
                <br />

                <label htmlFor="art_de_la_pagina">De la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" id="art_de_la_pagina" {...register("art_de_la_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.art_de_la_pagina && <span className="error">{errors.art_de_la_pagina.message}</span>}<br />

                <label htmlFor="art_a_la_pagina">A la página *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Rango de páginas que ocupa el artículo."><HelpIcon /></span>
                </label><br />
                <input type="number" id="art_a_la_pagina" {...register("art_a_la_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.art_a_la_pagina && <span className="error">{errors.art_a_la_pagina.message}</span>}<br />

                <label htmlFor="art_pais">País *:</label><br />
                <input type="text" id="art_pais" {...register("art_pais", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.art_pais && <span className="error">{errors.art_pais.message}</span>}<br />

                <label htmlFor="art_volumen">Volumen *:</label><br />
                <input type="number" id="art_volumen" {...register("art_volumen", { required: "Este campo es obligatorio.", maxLength: { value: 10, message: "El campo solo admite 10 caracteres." }, })} />
                {errors.art_volumen && <span className="error">{errors.art_volumen.message}</span>}<br />

                <label htmlFor="art_fecha_publicacion">Fecha de publicación *:</label><br />
                <input type="date" id="art_fecha_publicacion" {...register("art_fecha_publicacion", { required: "Este campo es obligatorio." })} />
                {errors.art_fecha_publicacion && <span className="error">{errors.art_fecha_publicacion.message}</span>}<br />

                <label htmlFor="art_tipo_articulo">Tipo de artículo *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del artículo."><HelpIcon /></span>
                </label><br />
                <select id="art_tipo_articulo" {...register("art_tipo_articulo", { required: "Este campo es obligatorio." })} >
                  <option value="">Selecciona una opción</option>
                  <option value="Artículo de difusión y divulgación">Artículo de difusión y divulgación</option>
                  <option value="Artículo de arbitrado">Artículo de arbitrado</option>
                  <option value="Artículo en revista indexada">Artículo en revista indexada</option>
                </select>
                {errors.art_tipo_articulo && <span className="error">{errors.art_tipo_articulo.message}</span>}<br />

                <label htmlFor="art_titulo_articulo">Título del artículo *:</label><br />
                <input type="text" id="art_titulo_articulo" {...register("art_titulo_articulo", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_titulo_articulo && <span className="error">{errors.art_titulo_articulo.message}</span>}<br />

                <label htmlFor="art_nombre_revista">Nombre de la revista *:</label><br />
                <input type="text" id="art_nombre_revista" {...register("art_nombre_revista", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_nombre_revista && <span className="error">{errors.art_nombre_revista.message}</span>}<br />

                <label htmlFor="art_editorial">Editorial *:</label><br />
                <input type="text" id="art_editorial" {...register("art_editorial", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_editorial && <span className="error">{errors.art_editorial.message}</span>}<br />

                <label htmlFor="art_issn">ISSN *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Código que identifica publicaciones seriadas."><HelpIcon /></span>
                </label><br />
                <input type="text" id="art_issn" {...register("art_issn", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_issn && <span className="error">{errors.art_issn.message}</span>}<br />

                <label htmlFor="art_direccion_electronica">Dirección electrónica del artículo:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Enlace electrónico para consultar el artículo."><HelpIcon /></span>
                </label><br />
                <input type="text" id="art_direccion_electronica" {...register("art_direccion_electronica", { maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.art_direccion_electronica && <span className="error">{errors.art_direccion_electronica.message}</span>}<br />
              </>
            )}

            {selectedOption === "2" && (
              <>
                <label htmlFor="lib_autores">Autor(es) del libro *:</label><br />
                <input {...register("lib_autores", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} id="lib_autores" />
                {errors.lib_autores && <span className="error">{errors.lib_autores.message}</span>}
                <br />

                <label htmlFor="lib_estado_actual">Estado actual del libro *:</label><br />
                <select {...register("lib_estado_actual", { required: "Este campo es obligatorio." })} id="lib_estado_actual" >
                  <option value="">Selecciona una opción</option>
                  <option value="Aceptado">Aceptado</option>
                  <option value="Publicado">Publicado</option>
                </select>
                {errors.lib_estado_actual && <span className="error">{errors.lib_estado_actual.message}</span>}
                <br />

                <label htmlFor="lib_pagina">Páginas *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Número total de páginas del libro."><HelpIcon /></span>
                </label><br />
                <input type="number" id="lib_pagina" {...register("lib_pagina", { required: "Este campo es obligatorio.", maxLength: { value: 3, message: "El campo solo admite 3 caracteres." }, })} />
                {errors.lib_pagina && <span className="error">{errors.lib_pagina.message}</span>}<br />

                <label htmlFor="lib_pais">País *:</label><br />
                <input type="text" id="lib_pais" {...register("lib_pais", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.lib_pais && <span className="error">{errors.lib_pais.message}</span>}<br />

                <label htmlFor="lib_edicion">Edición *:</label><br />
                <input type="number" id="lib_edicion" {...register("lib_edicion", { required: "Este campo es obligatorio.", maxLength: { value: 20, message: "El campo solo admite 20 caracteres." }, })} />
                {errors.lib_edicion && <span className="error">{errors.lib_edicion.message}</span>}<br />

                <label htmlFor="lib_isbn">ISBN:</label><br />
                <input type="text" id="lib_isbn" {...register("lib_isbn", { maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_isbn && <span className="error">{errors.lib_isbn.message}</span>}<br />

                <label htmlFor="lib_titulo_libro">Título de libro *:</label><br />
                <input type="text" id="lib_titulo_libro" {...register("lib_titulo_libro", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_titulo_libro && <span className="error">{errors.lib_titulo_libro.message}</span>}<br />

                <label htmlFor="lib_tipo_libro">Tipo de libro *:
                  <span className="tooltip-icon highlight-icon" data-tooltip="Clasificación del libro."><HelpIcon /></span>
                </label><br />
                <select id="lib_tipo_libro" {...register("lib_tipo_libro", { required: "Este campo es obligatorio." })} >
                  <option value="">Selecciona una opción</option>
                  <option value="Capítulo de libro">Capítulo de libro</option>
                  <option value="Libro">Libro</option>
                </select>
                {errors.lib_tipo_libro && <span className="error">{errors.lib_tipo_libro.message}</span>}<br />

                <label htmlFor="lib_editorial">Editorial *:</label><br />
                <input type="text" id="lib_editorial" {...register("lib_editorial", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_editorial && <span className="error">{errors.lib_editorial.message}</span>}<br />

                <label htmlFor="lib_tiraje">Tiraje *:</label><br />
                <input type="number" id="lib_tiraje" {...register("lib_tiraje", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
                {errors.lib_tiraje && <span className="error">{errors.lib_tiraje.message}</span>}<br />

                <label htmlFor="lib_fecha_publicacion">Fecha de publicación *:</label><br />
                <input type="date" id="lib_fecha_publicacion" {...register("lib_fecha_publicacion", { required: "Este campo es obligatorio." })} />
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

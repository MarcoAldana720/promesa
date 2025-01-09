"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonEditProduction from "./ButtonEditProduction";
import EditProduction from "./EditProduction";

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
  const date = new Date(isoString);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormProduction() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname()
  const search = useSearchParams()
  const edit = search.get('edit') ?? ''
  const [selectedOption, setSelectedOption] = useState("");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    loadProductionData(id)
      .then((data) => {
        setInfo(data);

        // Configura automáticamente el tipo de producción basado en tp_id
        if (data.tp_id === 1) {
          setSelectedOption("1"); // Artículo
        } else if (data.tp_id === 2) {
          setSelectedOption("2"); // Libro
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  }, [id]);

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.delete(`/api/client/academicproduction/${id}`, {
        withCredentials: true,
      });

      if (response.status === 204) {
        toast.success("Producto Eliminado Exitosamente.");
        router.push("/client/academicproduction");
      } else if (response.status === 404) {
        toast.error("Producción Académica No Encontrada O No Autorizada.");
      } else if (response.status === 401) {
        toast.error("No Autorizado.");
      } else {
        toast.error("Error Al eliminar El Producto.");
      }
    } catch (error) {
      console.error("Error Al Eliminar:", error);
      if (error.response) {
        // Muestra un mensaje de error basado en la respuesta del servidor
        toast.error(error.response.data.message || "Error Desconocido.");
      } else {
        toast.error("Error En El Servidor.");
      }
    }
  };

  return (
    <section className="custom_container">
      <EditProduction show={Boolean(edit)} pathname={pathname}/>
      <Link href="/client/academicproduction">&lt; Regresar</Link>
      <br />
      <br />
      <div className="form_blocked">
        <label htmlFor="pd_id">Tipo de producción:</label><br />
        <select className="type_production" name="pd_id" id="pd_id" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} disabled >
          <option value="1">Artículos</option>
          <option value="2">Libros</option>
        </select>
        <br />
        <form action="" method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              {/* Campos específicos para Articulos */}
              {selectedOption === "1" && (
                <>
                  <label htmlFor="art_autores">Autor(es):</label><br />
                  <input type="text" name="art_autores" id="art_autores" value={info.art_autores} disabled /><br />

                  <label htmlFor="art_estado_actual">Estado actual:</label><br />
                  <input type="text" name="art_estado_actual" id="art_estado_actual" value={info.art_estado_actual} disabled /><br />

                  <label htmlFor="art_de_la_pagina">De la página:</label><br />
                  <input type="number" name="art_de_la_pagina" id="art_de_la_pagina" value={info.art_de_la_pagina} disabled /><br />

                  <label htmlFor="art_a_la_pagina">A la página:</label><br />
                  <input type="number" name="art_a_la_pagina" id="art_a_la_pagina" value={info.art_a_la_pagina} disabled /><br />

                  <label htmlFor="art_pais">País:</label><br />
                  <input type="text" name="art_pais" id="art_pais" value={info.art_pais} disabled /><br />

                  <label htmlFor="art_volumen">Volumen:</label><br />
                  <input type="number" name="art_volumen" id="art_volumen" value={info.art_volumen} disabled /><br />

                  <label htmlFor="art_fecha_publicacion">Fecha de publicación:</label><br />
                  <input type="date" name="art_fecha_publicacion" id="art_fecha_publicacion" value={formatDateForInput(info.art_fecha_publicacion)} disabled /><br />
                </>
              )}
              {/* Campos específicos para Libro */}
              {selectedOption === "2" && (
                <>
                  <label htmlFor="lib_autores">Autor(es) del libro:</label><br />
                  <input type="text" name="lib_autores" id="lib_autores" value={info.lib_autores} disabled /><br />

                  <label htmlFor="lib_estado_actual">Estado actual del libro:</label><br />
                  <select name="lib_estado_actual" id="lib_estado_actual" value={info.lib_estado_actual} disabled>
                    <option value="">Selecciona una opción</option>
                    <option value="Aceptado">Aceptado</option>
                    <option value="Publicado">Publicado</option>
                  </select><br />

                  <label htmlFor="lib_pagina">Páginas (libro):</label><br />
                  <input type="number" name="lib_pagina" id="lib_pagina" value={info.lib_pagina} disabled /><br />

                  <label htmlFor="lib_edicion">Edición:</label><br />
                  <input type="number" name="lib_edicion" id="lib_edicion" value={info.lib_edicion} disabled /><br />

                  <label htmlFor="lib_isbn">ISBN:</label><br />
                  <input type="text" name="lib_isbn" id="lib_isbn" value={info.lib_isbn} disabled /><br />

                  <label htmlFor="lib_titulo_libro">Título de libro:</label><br />
                  <input type="text" name="lib_titulo_libro" id="lib_titulo_libro" value={info.lib_titulo_libro} disabled /><br />

                  <label htmlFor="lib_fecha_publicacion">Fecha de publicación:</label><br />
                  <input type="date" name="lib_fecha_publicacion" id="lib_fecha_publicacion" value={formatDateForInput(info.lib_fecha_publicacion)} disabled /><br />
                </>
              )}
            </div>

            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
              {/* Campos específicos para Articulos */}
              {selectedOption === "1" && (
                <>
                  <label htmlFor="art_tipo_articulo">Tipo de artículo:</label><br />
                  <select name="art_tipo_articulo" id="art_tipo_articulo" value={info.art_tipo_articulo} disabled >
                    <option value="">Selecciona una opción</option>
                    <option value="Artículo de difusión y divulgación">Artículo de difusión y divulgación</option>
                    <option value="Artículo de arbitrado">Artículo de arbitrado</option>
                    <option value="Artículo en revista indexada">Artículo en revista indexada</option>
                  </select><br />

                  <label htmlFor="art_titulo_articulo">Título del artículo:</label><br />
                  <input type="text" name="art_titulo_articulo" id="art_titulo_articulo" value={info.art_titulo_articulo} disabled /><br />

                  <label htmlFor="art_nombre_revista">Nombre de la revista:</label><br />
                  <input type="text" name="art_nombre_revista" id="art_nombre_revista" value={info.art_nombre_revista} disabled /><br />

                  <label htmlFor="art_editorial">Editorial:</label><br />
                  <input type="text" name="art_editorial" id="art_editorial" value={info.art_editorial} disabled /><br />

                  <label htmlFor="art_issn">ISSN:</label><br />
                  <input type="text" name="art_issn" id="art_issn" value={info.art_issn} disabled /><br />

                  <label htmlFor="art_direccion_electronica">Dirección electrónica del artículo:</label><br />
                  <input type="text" name="art_direccion_electronica" id="art_direccion_electronica" value={info.art_direccion_electronica} disabled /><br />
                </>
              )}

              {/* Campos específicos para Libro */}
              {selectedOption === "2" && (
                <>
                  <label htmlFor="lib_tipo_libro">Tipo de libro:</label><br />
                  <select name="lib_tipo_libro" id="lib_tipo_libro" value={info.lib_tipo_libro} disabled >
                    <option value="">Selecciona una opción</option>
                    <option value="Capítulo de libro">Capítulo de libro</option>
                    <option value="Libro">Libro</option>
                  </select><br />

                  <label htmlFor="lib_editorial">Editorial:</label><br />
                  <input type="text" name="lib_editorial" id="lib_editorial" value={info.lib_editorial} disabled /><br />

                  <label htmlFor="lib_tiraje">Tiraje:</label><br />
                  <input type="number" name="lib_tiraje" id="lib_tiraje" value={info.lib_tiraje} disabled /><br />

                  <label htmlFor="lib_pais">País:</label><br />
                  <input type="text" name="lib_pais" id="lib_pais" value={info.lib_pais} disabled /><br />
                </>
              )}
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <ButtonEditProduction />
            <button type="button" onClick={handleDelete} >Eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}

"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import ButtonEditStudies from "./ButtonEditStudies";
import EditStudies from "./EditStudies";

// Helper function to load study data
async function loadStudyData(est_id) {
  try {
    const { data } = await axios.get(`/api/client/studies/${est_id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de estudio.");
  }
}

// Helper function to format the date to "YYYY-MM-DD"
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function FormStudies() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname()
  const search = useSearchParams()
  const edit = search.get('edit') ?? ''
  const [info, setInfo] = useState({
    est_nivel_estudios: "",
    est_area_estudio: "",
    est_disciplina_estudio: "",
    est_institucion_otorgante: "",
    est_pais_institucion: "",
    est_fecha_obtencion_titulo: "",
  });

  // Load study data on component mount
  useEffect(() => {
    loadStudyData(id)
      .then((data) => {
        setInfo(data);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  }, [id]);

  // Handle delete study
  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.delete(`/api/client/studies/${id}`, {
        withCredentials: true,
      });

      if (response.status === 204) {
        toast.success("Estudio eliminado exitosamente.");
        router.push("/client/studies");
      } else if (response.status === 404) {
        toast.error("Estudio no encontrado.");
      } else if (response.status === 401) {
        toast.error("No autorizado.");
      } else {
        toast.error("Error al eliminar el estudio.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en el servidor.");
    }
  };

  return (
    <section className="custom_container">
      <EditStudies show={Boolean(edit)} pathname={pathname}/>
      <Link href="/client/studies">&lt; Regresar</Link><br /><br />
      <div className="form_blocked">
        <form method="post">
          <div className="container_informacion">
            <div className="form_left">
              <label htmlFor="est_nivel_estudios">Nivel de estudios:</label><br />
              <select name="est_nivel_estudios" id="est_nivel_estudios" value={info.est_nivel_estudios} disabled >
                <option value="">Selecciona una opción</option>
                <option value="Doctorado">Doctorado</option>
                <option value="Maestria">Maestría</option>
                <option value="Licenciatura">Licenciatura</option>
              </select>
              <br />

              <label htmlFor="est_area_estudio">Área:</label><br />
              <select name="est_area_estudio" id="est_area_estudio" value={info.est_area_estudio} disabled >
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
              </select><br />

              <label htmlFor="est_disciplina_estudio">Disciplina:</label><br />
              <input type="text" name="est_disciplina_estudio" id="est_disciplina_estudio" value={info.est_disciplina_estudio} disabled /> <br />
            </div>

            <div className="form_right">
              <label htmlFor="est_institucion_otorgante">Institución otorgante:</label><br />
              <input type="text" name="est_institucion_otorgante" id="est_institucion_otorgante" value={info.est_institucion_otorgante} disabled /><br />

              <label htmlFor="est_pais_institucion">País de la institución otorgante:</label><br />
              <input type="text" name="est_pais_institucion" id="est_pais_institucion" value={info.est_pais_institucion} disabled /><br />

              <label htmlFor="est_fecha_obtencion_titulo">Fecha de obtención del título o grado:</label><br />
              <input type="date" name="est_fecha_obtencion_titulo" id="est_fecha_obtencion_titulo" value={formatDateForInput(info.est_fecha_obtencion_titulo)} disabled /><br />
            </div>
          </div>

          <div className="btn_client">
            <ButtonEditStudies />
            <button type="button" onClick={handleDelete}>Eliminar</button>
          </div>
        </form>
      </div>
    </section>
  );
}
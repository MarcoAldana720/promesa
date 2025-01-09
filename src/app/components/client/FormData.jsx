"use client"

import Link from 'next/link'
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useParams, useSearchParams, usePathname } from "next/navigation";
import ButtonEditData from "./ButtonEditData";
import EditData from "./EditData";

// Helper function to load study data
async function loadData(da_id) {
  try {
    const { data } = await axios.get(`/api/client/employmentdata/${da_id}`);
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

export default function FormData() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const edit = search.get('edit') ?? ''
  const [info, setInfo] = useState({
    da_nombramiento: "",
    da_hrs_contrato: "",
    da_escuela_pertenece: "",
    da_inicio_contrato: "",
    da_unidad: "",
    da_campus: "",
  });

  // Load study data on component mount
  useEffect(() => {
    loadData(id)
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
      const response = await axios.delete(`/api/client/employmentdata/${id}`, {
        withCredentials: true,
      });

      if (response.status === 204) {
        toast.success("Dato eliminado exitosamente");
        router.push("/client/employmentdata");
      } else if (response.status === 404) {
        toast.error("Estudio no encontrado");
      } else if (response.status === 401) {
        toast.error("No autorizado");
      } else {
        toast.error("Error al eliminar el estudio");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error en el servidor");
    }
  };

  return (
    <section className="custom_container">
      <EditData show={Boolean(edit)} pathname={pathname}/>
      <Link href="/client/employmentdata">&lt; Regresar</Link><br /><br />
      <div className="form_blocked">
        <form method="post">
          {/* CONTAINER LABEL AND INPUT */}
          <div className="container_informacion">
            {/* CONTAINER WHERE FORM LEFT */}
            <div className="form_left">
              <label htmlFor="da_nombramiento">Nombramiento:</label><br />
              <input type="text" name="da_nombramiento" id="da_nombramiento" value={info.da_nombramiento} disabled /><br />

              <label htmlFor="da_escuela_pertenece">Escuela a la que pertenece:</label><br />
              <select name="da_escuela_pertenece" id="da_escuela_pertenece" value={info.da_escuela_pertenece} disabled >
                <option value="">Selecciona una opción</option>
                <option value="Arquitectura">Arquitectura</option>
                <option value="Derecho">Derecho</option>
                <option value="Diseño">Diseño</option>
                <option value="Humanidades">Humanidades</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Negocios">Negocios</option>
                <option value="Salud">Salud</option>
              </select><br />

              <label htmlFor="da_inicio_contrato">Inicio de contrato:</label><br />
              <input type="date" name="da_inicio_contrato" id="da_inicio_contrato" value={formatDateForInput(info.da_inicio_contrato)} disabled /><br />
            </div>
            {/* CONTAINER WHERE FORM RIGHT */}
            <div className="form_right">
            <label htmlFor="da_hrs_contrato">Horas de contrato:</label><br />
              <input type="number" name="da_hrs_contrato" id="da_hrs_contrato" value={info.da_hrs_contrato} disabled /><br />

              <label htmlFor="da_unidad">Unidad académica de adscripción:</label><br />
              <select name="da_unidad" id="da_unidad" value={info.da_unidad} disabled >
                <option value="">Selecciona una opción</option>
                <option value="Ingeniería arquitectónica">Ingeniería arquitectónica</option>
                <option value="Derecho">Derecho</option>
                <option value="Relaciones internacionales y alianzas estratégicas">Relaciones internacionales y alianzas estratégicas</option>
                <option value="Cultura física y entrenamiento deportivo">Cultura física y entrenamiento deportivo</option>
                <option value="Bioconstrucción y diseño sustentable">Bioconstrucción y diseño sustentable</option>
                <option value="Diseño interactivo">Diseño interactivo</option>
                <option value="Diseño de moda">Diseño de moda</option>
                <option value="Diseño e innovación">Diseño e innovación</option>
                <option value="Comunicación">Comunicación</option>
                <option value="Lengua y literatura modernas">Lengua y literatura modernas</option>
                <option value="Producción musical">Producción musical</option>
                <option value="Ingeniería automotriz">Ingeniería automotriz</option>
                <option value="Ingeniería biomédica">Ingeniería biomédica</option>
                <option value="Ingeniería industrial logística">Ingeniería industrial logística</option>
                <option value="Ingeniería mecatrónica">Ingeniería mecatrónica</option>
                <option value="Ingeniería en desarrollo de tecnología y software">Ingeniería en desarrollo de tecnología y software</option>
                <option value="Ingeniería en energía y petróleo">Ingeniería en energía y petróleo</option>
                <option value="Administración y dirección financiera">Administración y dirección financiera</option>
                <option value="Administración y mercadotecnia estratégica">Administración y mercadotecnia estratégica</option>
                <option value="Dirección de empresas y negocios internacionales">Dirección de empresas y negocios internacionales</option>
                <option value="Cirujano dentista">Cirujano dentista</option>
                <option value="Fisioterapia y rehabilitación">Fisioterapia y rehabilitación</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Psicología">Psicología</option>
              </select><br />

              <label htmlFor="da_campus">Campus:</label><br />
              <select name="da_campus" id="da_campus" value={info.da_campus} disabled >
                <option value="">Selecciona una opción</option>
                <option value="Mérida">Mérida</option>
                <option value="Valladolid">Valladolid</option>
                <option value="Chetumal">Chetumal</option>
              </select><br />
            </div>
          </div>
          {/* CONTAINER THE BUTTON  */}
          <div className="btn_client">
            <ButtonEditData />
            <button type="button" onClick={handleDelete}>Eliminar</button>
          </div>
        </form>
      </div>
    </section>
  )
}

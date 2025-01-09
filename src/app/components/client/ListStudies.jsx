"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaStudies from "./FilaStudies";
import NewStudies from "./NewStudies";
import AddUserIcon from "../../assets/AddUserIcon";
import Loading from "./Loading";
import { useSearchParams } from "next/navigation";

export default function ListStudies() {
  const [estudios, setEstudios] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewStudies = searchParams.get("new") === "1";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEstudios() {
      try {
        const { data } = await axios.get("/api/client/studies");

        // Filtra los datos con los nombres correctos de las propiedades
        const filteredData = data.filter((estudio) => {
          return estudio.est_nivel_estudios && estudio.est_area_estudio && estudio.est_disciplina_estudio && estudio.est_fecha_obtencion_titulo;
        });

        // Actualiza el estado con los datos filtrados
        setEstudios(filteredData);
      } catch (error) {
        console.error("Error fetching estudios:", error);
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 3000);
      }
    }
    fetchEstudios();
  }, [isAddingNewStudies]);

  if(loading) return <Loading/>

  return (
    <section className="container_clients">
      <div className="container_table">
        {estudios.length > 0 ? (
          <>
            <h1 className="title">Resumen de estudios realizados</h1>
            <span className="description">Para editar o eliminar un estudio, primero deberás seleccionar la fila correspondiente en la tabla haciendo clic en ella...</span><br /><br />

            <table>
              <thead>
                <tr>
                  <th>Nivel de estudio</th>
                  <th>Área</th>
                  <th>Disciplina</th>
                  <th>Fecha de obtención</th>
                </tr>
              </thead>
              <tbody>
                {estudios.map((estudio, index) => (
                  <FilaStudies key={index} estudio={estudio} />
                ))}
              </tbody>
            </table><br />

            <div className="container_add">
              <Link href="/client/studies?new=1">
                <div className="container_btn">
                  <AddUserIcon width={18} />
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>Presione agregar, para agregar un nuevo estudio.</p><br />
            <div className="container_add_filter">
              <Link href="/client/studies?new=1">
                <div className="container_btn_filter">
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <NewStudies show={isAddingNewStudies} />
    </section>
  );
}

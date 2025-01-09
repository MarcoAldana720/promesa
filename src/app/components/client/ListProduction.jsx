"use client"

import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import FilaProduction from "./FilaProduction";
import NewProduction from "./NewProduction";
import AddUserIcon from "../../assets/AddUserIcon";
import { useSearchParams } from "next/navigation";
import Loading from "./Loading";

export default function ListProduction() {
  const [producciones, setProducciones] = useState([]);
  const searchParams = useSearchParams();
  const isAddingNewProduction = searchParams.get("new") === "1";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducciones() {
      try {
        const response = await axios.get("/api/client/academicproduction");
        setProducciones(response.data); // Actualiza el estado con los datos.
      } catch (error) {
        console.error("Error al obtener las producciones:", error.message);
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 3000);
      }
    }
    fetchProducciones();
  }, [isAddingNewProduction]);

  if(loading) return <Loading/>

  return (
    <section className="container_clients">
      <div className="container_table">
        {producciones.length > 0 ? (
          <>
            <h1 className="title">Resumen de producción</h1>
            <span className="description">Para editar o eliminar un producto, primero deberás seleccionar la fila correspondiente en la tabla haciendo clic en ella...</span><br /><br />

            <table>
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Fecha de publicación</th>
                  <th>Tipo de producción</th>
                </tr>
              </thead>
              <tbody>
                {producciones.map((produccion, index) => (
                  <FilaProduction key={index} producciones={produccion} />
                ))}
              </tbody>
            </table><br />

            <div className="container_add">
              <Link href="/client/academicproduction?new=1">
                <div className="container_btn">
                  <AddUserIcon width={18} />
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="search_not_exit_filter">
            <p>Presione agregar, para agregar una nuevo producción.</p><br />
            <div className="container_add_filter">
              <Link href="/client/academicproduction?new=1">
                <div className="container_btn_filter">
                  <span>Agregar</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div><br />

      <NewProduction show={isAddingNewProduction} />
    </section>
  );
}

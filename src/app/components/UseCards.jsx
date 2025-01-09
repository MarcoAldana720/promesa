"use client";

import Link from "next/link";
import UserIcon from "../assets/UserIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";

// Función para cargar los usuarios
async function loadUsers() {
    const { data } = await axios.get("/api/admin");
    return data;
}

// Componente UserCard en formato RFC
export default function UserCard() {
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0); // Estado para el contador
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const data = await loadUsers();
            setUsers(data);
          } catch (error) {
            console.error("Error al cargar usuarios:", error);
          } finally {
            setTimeout(() => {
              setLoading(false)
            }, 3000);
          }
        };

        fetchUsers();
    }, []);

    // Contamos el número de usuarios
    const sizeData = users.length;

    useEffect(() => {
        // Si hay usuarios, iniciar el conteo
        if (count < sizeData) {
            const interval = setInterval(() => {
                setCount(prevCount => prevCount + 1);
            }, 100); // Intervalo de 100ms para incrementar el contador

            return () => clearInterval(interval); // Limpiar el intervalo cuando se alcance el valor o se desmonte el componente
        }
    }, [count, sizeData]);

    if(loading) return <Loading/>

    return (
        <div className="container_clients">
            <h1 className="title">Panel de control</h1><br />
            <div className="container_cards">
                <Link href="/admin/usuarios">
                    <div className="cards">
                        <div className="container_count">
                            <p className="count">{count}</p> {/* Mostrar el contador progresivo */}
                            <p className="description_2">Usuarios</p>
                        </div>
                        <div className="container_icon">
                            <UserIcon className="icon" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

"use client"

import ButtonEdit from "./ButtonEdit";
import ButtonResetPassword from "./ButtonResetPassword";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import EditUser from "./EditUser";

export default function InfoUser({ userId, searchParams }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await axios.get(`/api/admin/${userId}`);
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        };

        loadUser();
    }, [userId]);

    // Si no hay datos de usuario, devuelve un componente vacío
    if (!user) {
        return null;
    }

    const { us_id, us_nombres, us_apellido_paterno, us_apellido_materno, rol_descripcion, esc_descripcion, es_descripcion } = user;

    // Función para mostrar las iniciales
    const getInitials = (nombres, apellidoPaterno, apellidoMaterno) => {
        const firstNameInitial = nombres ? nombres.charAt(0) : '';
        const lastNameInitial = apellidoPaterno ? apellidoPaterno.charAt(0) : (apellidoMaterno ? apellidoMaterno.charAt(0) : '');
        return firstNameInitial + lastNameInitial;
    };

    const initials = getInitials(us_nombres, us_apellido_paterno, us_apellido_materno);

    return (
        <div className="custom_container">
            <EditUser show={Boolean(searchParams.edit)} />
            <Link href="/admin/usuarios">&lt; Regresar</Link><br /><br />

            <div className="profile_card">
                <div className="profile_initials">{initials}</div>
                <h1 className="profile_name">
                    {us_nombres}
                    {(us_apellido_paterno || us_apellido_materno) && ' '}
                    {us_apellido_paterno && `${us_apellido_paterno}`}
                    {us_apellido_materno && (us_apellido_paterno ? ` ${us_apellido_materno}` : `${us_apellido_materno}`)}
                </h1>
                <div className="profile_center">
                    <p className="profile_description">Cargo: <span>{rol_descripcion}</span></p>
                    <p className="profile_description">Escuela: <span>{esc_descripcion}</span></p>
                    <p className="profile_description">Estado: <span> {es_descripcion}</span></p>
                </div>

                {/* Permite Restablecer La Contraseña */}
                <ButtonResetPassword us_id={us_id} />

                {/* Permite Editar La Información */}
                <ButtonEdit id={us_id} />
            </div>
        </div>
    );
}

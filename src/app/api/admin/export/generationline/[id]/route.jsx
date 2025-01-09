import { NextResponse } from "next/server";
import { conn } from "../../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCIÓN PARA OBTENER LA LÍNEA DE GENERACIÓN DESDE LA RUTA DINÁMICA
export async function GET(request, { params }) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // Decodificar el token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid token", error: err.message },
        { status: 400 }
      );
    }

    // Obtener el `id` del usuario desde los parámetros de la ruta
    const { id } = params; // Capturar el id dinámico desde la URL

    // Validar si el ID es un número válido
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid user ID in URL" },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener la línea de generación del usuario con el ID proporcionado
    const results = await conn.query(
      `
      SELECT
        linea_generacion.lg_id,
        linea_generacion.lg_actividad_realiza,
        linea.li_linea
      FROM
        usuarios
      LEFT JOIN
        linea_generacion ON usuarios.us_id = linea_generacion.lg_id_profesor
      LEFT JOIN
        linea ON linea_generacion.lg_id_linea = linea.li_id
      WHERE
        usuarios.us_id = ?
    `,
      [id] // Usar el ID de la ruta
    );

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      return NextResponse.json(
        { message: "No generation line records found for the provided user" },
        { status: 404 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error fetching generation line", error: error.message },
      { status: 500 }
    );
  }
}

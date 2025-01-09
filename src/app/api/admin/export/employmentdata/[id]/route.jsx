import { NextResponse } from "next/server";
import { conn } from "../../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO DESDE LA RUTA DINÁMICA
export async function GET(request, { params }) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        { message: "No Se Proporcionó Token." },
        { status: 401 }
      );
    }

    // Decodificar el token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Token inválido", error: err.message },
        { status: 400 }
      );
    }

    // Obtener el `id` del usuario desde los parámetros de la ruta
    const { id } = params; // El id dinámico desde la URL

    // Validar si el ID es un número válido
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "ID de usuario inválido en la URL." },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener los datos del usuario usando el ID de la ruta
    const results = await conn.query(
      `
      SELECT
        datos.da_id,
        datos.da_nombramiento,
        datos.da_hrs_contrato,
        datos.da_escuela_pertenece,
        datos.da_inicio_contrato,
        datos.da_unidad,
        datos.da_campus
      FROM
        usuarios
      LEFT JOIN
        datos ON usuarios.us_id = datos.da_id_profesor
      WHERE
        usuarios.us_id = ?
    `,
      [id] // Usar el ID obtenido desde la ruta dinámica
    );

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      return NextResponse.json(
        { message: "No Se Encontraron Registros Para El Usuario Proporcionado." },
        { status: 404 }
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error al obtener los datos del usuario", error: error.message },
      { status: 500 }
    );
  }
}

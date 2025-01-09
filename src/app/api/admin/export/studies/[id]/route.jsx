import { NextResponse } from "next/server";
import { conn } from "../../../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCIÓN PARA OBTENER TODOS LOS ESTUDIOS DEL USUARIO ESPECÍFICO BASADO EN EL ID DINÁMICO
export async function GET(request, { params }) {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get("myTokenName")?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        {
          message: "No Se Proporcionó Token.",
        },
        { status: 401 }
      );
    }

    // Decodificar el token JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        {
          message: "Token Inválido.",
          error: err.message,
        },
        { status: 400 }
      );
    }

    // Obtener el `id` del usuario desde los parámetros de la ruta
    const { id } = params; // Extrae el ID dinámico desde la URL

    // Validar si el ID es válido (por ejemplo, si es un número)
    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "ID de usuario inválido en la URL." },
        { status: 400 }
      );
    }

    // Consulta SQL para obtener toda la información de estudios del usuario con el ID proporcionado
    const results = await conn.query(
      `
      SELECT
        estudios.est_id,
        estudios.est_nivel_estudios,
        estudios.est_area_estudio,
        estudios.est_disciplina_estudio,
        estudios.est_institucion_otorgante,
        estudios.est_pais_institucion,
        estudios.est_fecha_obtencion_titulo
      FROM
        usuarios
      LEFT JOIN
        estudios ON usuarios.us_id = estudios.est_id_profesor
      WHERE
        usuarios.us_id = ?
    `,
      [id]
    );

    // Verificar si se encontraron resultados
    if (!results || results.length === 0) {
      return NextResponse.json(
        {
          message: "No Se Encontraron Registros Para El Usuario Proporcionado.",
        },
        { status: 404 }
      );
    }

    // Devolver los resultados obtenidos
    return NextResponse.json(results);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: "Error al Obtener los Estudios.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

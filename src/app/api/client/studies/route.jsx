import { NextResponse } from "next/server";
import { conn } from "../../../../libs/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Fuerza la generación dinámica
export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET;

// FUNCION PARA OPTENER TODOS LOS ESTUDIOS QUE HA REALIZADO EL USUARIO QUE INICIO SESION
export async function GET() {
  try {
    // Obtener el token desde las cookies
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    // Verificar si el token existe
    if (!token) {
      return NextResponse.json(
        {
          message: 'No se proporcionó token.'
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const loggedInUser = decoded.id; // Nombre del usuario que inició sesión

    // Consulta para obtener toda la información de estudios del usuario autenticado
    const results = await conn.query(`
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
    `, [loggedInUser]);

    // Verificar si se encontraron resultados
    if (results.length === 0) {
      return NextResponse.json(
        {
          message: 'No se encontraron registros para el usuario.'
        }, {
          status: 404
        }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}

// FUNCION PARA AGREGAR UN ESTUDIO NUEVO QUE HA REALIZADO EL USUARIO QUE INICIO SESION
export async function POST(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('myTokenName')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'No se proporcionó token.'
        }, {
          status: 401
        }
      );
    }

    // Decodificar el token JWT para obtener el `id`
    const decoded = jwt.verify(token, JWT_SECRET);
    // console.log(decoded); // Verificar el contenido del token
    const est_id_profesor = decoded.id; // Asegúrate de que esto sea correcto

    // Obtener los datos del cuerpo de la solicitud
    const {
      est_nivel_estudios,
      est_area_estudio,
      est_disciplina_estudio,
      est_institucion_ortogante,
      est_pais_institucion,
      est_fecha_obtencion_titulo
    } = await req.json();

    // Inserción de los datos en la base de datos
    const result = await conn.query(
      `
      INSERT INTO estudios (
        est_nivel_estudios,
        est_area_estudio,
        est_disciplina_estudio,
        est_institucion_otorgante,
        est_pais_institucion,
        est_fecha_obtencion_titulo,
        est_id_profesor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        est_nivel_estudios,
        est_area_estudio,
        est_disciplina_estudio,
        est_institucion_ortogante,
        est_pais_institucion,
        est_fecha_obtencion_titulo,
        est_id_profesor // Asegúrate de que esto contenga el ID correcto
      ]
    );

    // console.log("Resultado de la inserción:", result);

    if (result?.affectedRows === 1) {
      return NextResponse.json(
        {
          message: "Registro añadido exitosamente.",
          insertId: result.insertId
        }
      );
    } else {
      throw new Error("No se pudo insertar el registro.");
    }

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        message: error.message
      }, {
        status: 500
      }
    );
  }
}
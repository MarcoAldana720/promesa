"use client";

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import HelpIcon from "../../assets/HelpIcon";

export default function NewStudies({ show }) {
  const pathname = usePathname();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/client/studies', {
        est_nivel_estudios: data.us_nivel,
        est_area_estudio: data.us_area,
        est_disciplina_estudio: data.us_disciplina,
        est_institucion_ortogante: data.us_institucion,
        est_pais_institucion: data.us_pais,
        est_fecha_obtencion_titulo: data.us_fecha,
      });
      toast.success(res.data.message || 'Registro de estudios agregado exitosamente.');
      reset();
      router.push("/client/studies");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al agregar el registro de estudios.');
    }
  };

  const closeModal = () => {
    reset();
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button>
        <br />

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            <label htmlFor="us_nivel">Nivel de estudios *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nivel académico alcanzado."><HelpIcon /></span>
            </label>
            <br />
            <select id="us_nivel" className={`input-field ${errors.us_nivel ? "input-error" : ""}`} {...register('us_nivel', { required: 'Este campo es obligatorio.' })}>
              <option value="">Selecciona una opción</option>
              <option value="Doctorado">Doctorado</option>
              <option value="Maestria">Maestría</option>
              <option value="Licenciatura">Licenciatura</option>
            </select>
            {errors.us_nivel && <span className="error">{errors.us_nivel.message}</span>}
            <br />

            <label htmlFor="us_area">Área *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Campo de estudio o disciplina principal."><HelpIcon /></span>
            </label>
            <br />
            <select id="us_area" className={`input-field ${errors.us_area ? "input-error" : ""}`} {...register('us_area', { required: 'Este campo es obligatorio.' })}>
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
            </select>
            {errors.us_area && <span className="error">{errors.us_area.message}</span>}
            <br />

            <label htmlFor="us_disciplina">Disciplina *:</label>
            <br />
            <input type="text" id="us_disciplina" className={`input-field ${errors.us_disciplina ? "input-error" : ""}`} {...register('us_disciplina', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' }, })} />
            {errors.us_disciplina && <span className="error">{errors.us_disciplina.message}</span>}
            <br />

            <label htmlFor="us_fecha">Fecha de obtención del título o grado *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Fecha en que se emitió el título o grado."><HelpIcon /></span>
            </label>
            <br />
            <input type="date" id="us_fecha" className={`input-field ${errors.us_fecha ? "input-error" : ""}`} {...register('us_fecha', { required: 'Este campo es obligatorio.' })} />
            {errors.us_fecha && <span className="error">{errors.us_fecha.message}</span>}
            <br />

            <label htmlFor="us_institucion">Institución otorgante:</label>
            <br />
            <input type="text" id="us_institucion" className={`input-field ${errors.us_institucion ? "input-error" : ""}`} {...register('us_institucion', { maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' }, })} />
            {errors.us_institucion && <span className="error">{errors.us_institucion.message}</span>}
            <br />

            <label htmlFor="us_pais">País *:</label>
            <br />
            <input type="text" id="us_pais" className={`input-field ${errors.us_pais ? "input-error" : ""}`} {...register('us_pais', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' }, })} />
            {errors.us_pais && <span className="error">{errors.us_pais.message}</span>}
            <br />

            <div className="btn">
              <button type="submit">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}

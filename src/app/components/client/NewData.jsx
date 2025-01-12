"use client";

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { toast } from 'sonner';
import HelpIcon from "../../assets/HelpIcon";

export default function NewData({ show }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const pathname = usePathname();
  const router = useRouter();

  async function onSubmit(data) {
    try {
      const res = await axios.post('/api/client/employmentdata', data);
      toast.success(res.data.message || 'Registro de dato agregado exitosamente.');
      reset();
      router.push("/client/employmentdata");
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al agregar el registro de dato.');
    }
  }

  const closeModal = () => {
    reset();
    router.replace(pathname);
  };

  return (
    <Modal show={show} pathRedirect={pathname}>
      <div className="container_relative">
        {/* Botón de cerrar */}
        <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
          &times;
        </button><br />

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="da_nombramiento">Nombramiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de contrato o cargo asignado."><HelpIcon /></span>
            </label><br />
            <input type="text" id="da_nombramiento" name="da_nombramiento" className={`input-field ${errors.da_nombramiento ? "input-error" : ""}`} {...register("da_nombramiento", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres.", }, })} />
            {errors.da_nombramiento && <span className="error">{errors.da_nombramiento.message}</span>}
            <br />

            <label htmlFor="da_escuela_pertenece">Escuela a la que pertenece *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Nombre de la escuela o facultad donde labora."><HelpIcon /></span>
            </label><br />
            <select id="da_escuela_pertenece" name="da_escuela_pertenece" className={`input-field ${errors.da_escuela_pertenece ? "input-error" : ""}`} {...register("da_escuela_pertenece", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." } })}>
              <option value="">Selecciona una opción</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Derecho">Derecho</option>
              <option value="Diseño">Diseño</option>
              <option value="Humanidades">Humanidades</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Negocios">Negocios</option>
              <option value="Salud">Salud</option>
            </select>
            {errors.da_escuela_pertenece && <span className="error">{errors.da_escuela_pertenece.message}</span>}
            <br />

            <label htmlFor="da_inicio_contrato">Inicio de contrato *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Fecha de inicio del contrato laboral."><HelpIcon /></span>
            </label><br />
            <input type="date" id="da_inicio_contrato" name="da_inicio_contrato" className={`input-field ${errors.da_inicio_contrato ? "input-error" : ""}`} {...register("da_inicio_contrato", { required: "Este campo es obligatorio." })} />
            {errors.da_inicio_contrato && <span className="error">{errors.da_inicio_contrato.message}</span>}
            <br />

            <label htmlFor="da_hrs_contrato">Horas de contrato *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Cantidad de horas."><HelpIcon /></span>
            </label><br />
            <input type="number" id="da_hrs_contrato" name="da_hrs_contrato" className={`input-field ${errors.da_hrs_contrato ? "input-error" : ""}`} {...register("da_hrs_contrato", { required: "Este campo es obligatorio.", maxLength: { value: 2, message: "El campo solo admite 2 digitos.", }, })} />
            {errors.da_hrs_contrato && <span className="error">{errors.da_hrs_contrato.message}</span>}
            <br />

            <label htmlFor="da_unidad">Unidad académica de adscripción *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Departamento o unidad académica donde está adscrito."><HelpIcon /></span>
            </label><br />
            <select id="da_unidad" name="da_unidad" className={`input-field ${errors.da_unidad ? "input-error" : ""}`} {...register("da_unidad", { required: "Este campo es obligatorio." })} >
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
            </select>
            {errors.da_unidad && <span className="error">{errors.da_unidad.message}</span>}
            <br />

            <label htmlFor="da_campus">Campus:
              <span className="tooltip-icon highlight-icon" data-tooltip="Ubicación específica del campus."><HelpIcon /></span>
            </label><br />
            <select id="da_campus" name="da_campus" className={`input-field ${errors.da_campus ? "input-error" : ""}`} {...register("da_campus", { maxLength: { value: 10, message: "El campo solo admite 10 caracteres.", }, })} >
              <option value="">Selecciona una opción</option>
              <option value="Mérida">Mérida</option>
              <option value="Valladolid">Valladolid</option>
              <option value="Chetumal">Chetumal</option>
            </select>
            {errors.da_campus && <span className="error">{errors.da_campus.message}</span>}
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

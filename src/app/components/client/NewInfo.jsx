"use client";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import HelpIcon from "../../assets/HelpIcon";

const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date)) return ""; // Verifica si la fecha es inválida
    return date.toISOString().split("T")[0]; // Devuelve formato YYYY-MM-DD
  } catch {
    return "";
  }
};

export default function NewInfo({ show, data = null, isEdit = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isEdit && data) {
      Object.keys(data).forEach((key) => {
        let value = data[key] || "";
        // Aplica el formato solo a la fecha de nacimiento
        if (key === "iden_fecha_nacimiento") {
          value = formatDateForInput(value);
        }
        setValue(key, value);
      });
    }
  }, [data, isEdit, setValue]);

  const onSubmit = async (formData) => {
    try {
      if (isEdit) {
        const res = await axios.put(`/api/client/identify/${data.id}`, formData);
        toast.success(res.data.message || "Información actualizada correctamente.");
      } else {
        const res = await axios.post("/api/client/identify", formData);
        toast.success(res.data.message || "Información guardada correctamente.");
      }

      // reset();
      router.refresh();
      router.replace(pathname);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar la información.");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="iden_curp">
              Clave Única de Registro de Población (CURP) *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Código alfanumérico único de 18 caracteres."><HelpIcon /></span>
            </label>
            <input type="text" id="iden_curp" className={`input-field ${errors.iden_curp ? "input-error" : ""}`} {...register("iden_curp", { required: "Este campo es obligatorio.", maxLength: { value: 18, message: "El campo solo admite 18 caracteres."}, pattern: { value: /^[A-Z0-9]+$/, message: "Solo se permiten letras mayúsculas y números." } })} />
            {errors.iden_curp && <span className="error">{errors.iden_curp.message}</span>}
            <br />

            <label htmlFor="iden_rfc">
              Registro Federal de Contribuyente (RFC) *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Código alfanumérico único de 12 caracteres."><HelpIcon /></span>
            </label>
            <input type="text" id="iden_rfc" className={`input-field ${errors.iden_rfc ? "input-error" : ""}`} {...register("iden_rfc", { required: "Este campo es obligatorio.", maxLength: { value: 12, message: "El campo solo admite 12 caracteres."}, pattern: { value: /^[A-Z0-9]+$/, message: "Solo se permiten letras mayúsculas y números." } })} />
            {errors.iden_rfc && <span className="error">{errors.iden_rfc.message}</span>}
            <br />

            <label htmlFor="iden_fecha_nacimiento">Fecha de nacimiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Indica la fecha de nacimiento."><HelpIcon /></span>
            </label>
            <input type="date" id="iden_fecha_nacimiento" className={`input-field ${errors.iden_fecha_nacimiento ? "input-error" : ""}`} {...register("iden_fecha_nacimiento", { required: "Este campo es obligatorio." })} />
            {errors.iden_fecha_nacimiento && <span className="error">{errors.iden_fecha_nacimiento.message}</span>}
            <br />

            <label htmlFor="iden_nacionalidad">Nacionalidad *:</label>
            <input type="text" id="iden_nacionalidad" className={`input-field ${errors.iden_nacionalidad ? "input-error" : ""}`} {...register("iden_nacionalidad", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." } })} />
            {errors.iden_nacionalidad && <span className="error">{errors.iden_nacionalidad.message}</span>}
            <br />

            <label htmlFor="iden_entidad">Entidad de nacimiento *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Estado de la República Mexicana donde nació."><HelpIcon /></span>
            </label><br />
            <input type="text" name="iden_entidad" id="iden_entidad" className={`input-field ${errors.iden_entidad ? "input-error" : ""}`} {...register("iden_entidad", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres." } })} />
            {errors.iden_entidad && <span className="error">{errors.iden_entidad.message}</span>}
            <br />

            <label htmlFor="iden_estado_civil">Estado civil *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Situación legal de la persona."><HelpIcon /></span>
            </label>
            <select id="iden_estado_civil" className={`input-field ${errors.iden_estado_civil ? "input-error" : ""}`} {...register("iden_estado_civil", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Soltero(a)">Soltero(a)</option>
            </select>
            {errors.iden_estado_civil && <span className="error">{errors.iden_estado_civil.message}</span>}
            <br />

            <label htmlFor="iden_telefono">Celular:</label><br />
            <input type="tel" className={`input-field ${errors.iden_telefono ? "input-error" : ""}`} {...register("iden_telefono", { maxLength: { value: 10, message: "El campo solo admite 10 dígitos.", }, })} />
            {errors.iden_telefono && <span className="error">{errors.iden_telefono.message}</span>}<br />

            <label htmlFor="iden_email">Correo electrónico *:</label>
            <input type="email" id="iden_email" className={`input-field ${errors.iden_email ? "input-error" : ""}`} {...register("iden_email", { required: "Este campo es obligatorio.", maxLength: { value: 50, message: "El campo solo admite 50 caracteres" } })} />
            {errors.iden_email && <span className="error">{errors.iden_email.message}</span>}
            <br />

            <label htmlFor="iden_email_alternativo">Correo electrónico adicional:</label>
            <input type="email" id="iden_email_alternativo" className={`input-field ${errors.iden_email_alternativo ? "input-error" : ""}`} {...register("iden_email_alternativo", { maxLength: { value: 50, message: "El campo solo admite 50 caracteres.", }, })} />
            {errors.iden_email_alternativo && <span className="error">{errors.iden_email_alternativo.message}</span>}
            <br />

            <label htmlFor="iden_area_dedicacion">Área de dedicación *:</label>
            <select id="iden_area_dedicacion" className={`input-field ${errors.iden_area_dedicacion ? "input-error" : ""}`} {...register("iden_area_dedicacion", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Derecho">Derecho</option>
              <option value="Diseño">Diseño</option>
              <option value="Humanidades">Humanidades</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Negocios">Negocios</option>
              <option value="Salud">Salud</option>
            </select>
            {errors.iden_area_dedicacion && <span className="error">{errors.iden_area_dedicacion.message}</span>}
            <br />

            <label htmlFor="iden_disciplina_dedicacion">Disciplina de dedicación *:</label>
            <select id="iden_disciplina_dedicacion" className={`input-field ${errors.iden_disciplina_dedicacion ? "input-error" : ""}`} {...register("iden_disciplina_dedicacion", { required: "Este campo es obligatorio." })} >
              <option value="">Selecciona una opción</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Ingeniería arquitectónica">Ingeniería arquitectónica</option>
              <option value="Derecho">Derecho</option>
              <option value="Relaciones internacionales y alianzas estratégicas">Relaciones internacionales y alianzas estratégicas</option>
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
              <option value="Cultura física y entrenamiento deportivo">Cultura física y entrenamiento deportivo</option>
              <option value="Fisioterapia y rehabilitación">Fisioterapia y rehabilitación</option>
              <option value="Nutrición">Nutrición</option>
              <option value="Psicología">Psicología</option>
            </select>
            {errors.iden_disciplina_dedicacion && <span className="error">{errors.iden_disciplina_dedicacion.message}</span>}
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

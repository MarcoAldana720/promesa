"use client";

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import HelpIcon from "../../assets/HelpIcon";

export default function NewLine({ show }) {
  const pathname = usePathname();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/client/line', {
        li_linea: data.li_linea,
        lg_actividad_realiza: data.lg_actividad_realiza,
      });

      toast.success(res.data.message || 'Registro agregado exitosamente.');
      reset();
      router.push('/client/line');
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al agregar el registro.');
    }
  };

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
        </button>
        <br />

        <div className="form">
          <form onSubmit={handleSubmit(onSubmit)} method="post">
            {/* Campo li_linea */}
            <label htmlFor="li_linea">
              Línea *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tema o área de investigación.">
                <HelpIcon />
              </span>
            </label><br />
            <input type="text" id="li_linea" name="li_linea" className={`input-field ${errors.li_linea ? "input-error" : ""}`} {...register('li_linea', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.', }, })} />
            {errors.li_linea && <span className="error">{errors.li_linea.message}</span>}
            <br />

            {/* Campo lg_actividad_realiza */}
            <label htmlFor="lg_actividad_realiza">
              Actividad que realiza *:
              <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de trabajo dentro de la línea de investigación.">
                <HelpIcon />
              </span>
            </label><br />
            <input type="text" id="lg_actividad_realiza" name="lg_actividad_realiza" className={`input-field ${errors.lg_actividad_realiza ? "input-error" : ""}`} {...register('lg_actividad_realiza', { required: 'Este campo es obligatorio.', maxLength: { value: 100, message: 'El campo solo admite 100 caracteres.' }, })} />
            {errors.lg_actividad_realiza && <span className="error">{errors.lg_actividad_realiza.message}</span>}
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

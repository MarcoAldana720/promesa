"use client";

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import Modal from './Modal';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

export default function NewUser({ show }) {
  const pathname = usePathname();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/admin', data);
      toast.success(res.data.message || 'Usuario registrado exitosamente.');
      reset();
      router.push('/admin/usuarios');
    } catch (error) {
      toast.error(error.response?.data.message || 'Error al registrar usuario.');
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
            <label htmlFor="us_nombres">Nombre(s) *:</label><br />
            <input type="text" id="us_nombres" {...register('us_nombres', { required: 'Este campo es obligatorio.', maxLength: { value: 50, message: 'El campo solo admite 50 caracteres.' }, })} />
            {errors.us_nombres && <span className="error">{errors.us_nombres.message}</span>}
            <br />

            <label htmlFor="us_apellido_paterno">Apellido paterno *:</label><br />
            <input type="text" id="us_apellido_paterno" {...register('us_apellido_paterno', { required: 'Este campo es obligatorio.', maxLength: { value: 50, message: 'El campo solo admite 50 caracteres.' }, })} />
            {errors.us_apellido_paterno && <span className="error">{errors.us_apellido_paterno.message}</span>}
            <br />

            <label htmlFor="us_apellido_materno">Apellido materno *:</label><br />
            <input type="text" id="us_apellido_materno" {...register('us_apellido_materno', { required: 'Este campo es obligatorio.', maxLength: { value: 50, message: 'El campo solo admite 50 caracteres.' }, })} />
            {errors.us_apellido_materno && <span className="error">{errors.us_apellido_materno.message}</span>}
            <br />

            <label htmlFor="us_usuario">Usuario *:</label><br />
            <input type="text" id="us_usuario" {...register('us_usuario', { required: 'Este campo es obligatorio.', maxLength: { value: 50, message: 'El campo solo admite 50 caracteres.' }, })} />
            {errors.us_usuario && <span className="error">{errors.us_usuario.message}</span>}
            <br />

            <label htmlFor="us_gen_id">Género *:</label><br />
            <select id="us_gen_id" {...register('us_gen_id', { required: 'Este campo es obligatorio.' })} >
              <option value="">Selecciona una opción</option>
              <option value="1">Masculino</option>
              <option value="2">Femenina</option>
            </select>
            {errors.us_gen_id && <span className="error">{errors.us_gen_id.message}</span>}
            <br />

            <label htmlFor="us_rol_id">Cargo *:</label><br />
            <select id="us_rol_id" {...register('us_rol_id', { required: 'Este campo es obligatorio.' })} >
              <option value="">Selecciona una opción</option>
              <option value="1">Administrador</option>
              <option value="2">Profesor</option>
            </select>
            {errors.us_rol_id && <span className="error">{errors.us_rol_id.message}</span>}
            <br />

            <label htmlFor="us_esc_id">Escuela *:</label><br />
            <select id="us_esc_id" {...register('us_esc_id', { required: 'Este campo es obligatorio.' })} >
              <option value="">Selecciona una opción</option>
              <option value="1">General</option>
              <option value="2">Arquitectura</option>
              <option value="3">Derecho</option>
              <option value="4">Diseño</option>
              <option value="5">Humanidades</option>
              <option value="6">Ingeniería</option>
              <option value="7">Negocios</option>
              <option value="8">Salud</option>
            </select>
            {errors.us_esc_id && <span className="error">{errors.us_esc_id.message}</span>}
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

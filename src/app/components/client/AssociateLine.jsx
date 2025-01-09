"use client";

import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "./Modal";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HelpIcon from "../../assets/HelpIcon";

export default function AssociateLine({ show }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineId = searchParams.get("editLine");
  const [linea, setLinea] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (lineId) {
      axios
        .get(`/api/client/line/${lineId}`)
        .then((res) => setLinea(res.data))
        .catch(() => toast.error("Error al obtener la línea seleccionada."));
    }
  }, [lineId]);

  const closeModal = () => {
    reset();
    router.replace(pathname);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`/api/client/line/${lineId}`, {
        lg_actividad_realiza: data.lg_actividad_realiza,
      });

      toast.success(res.data.message || "Actividad asociada exitosamente.");
      reset();
      router.push("/client/generationline");
    } catch (error) {
      console.error("Error al asociar la actividad:", error);
      toast.error(
        error.response?.data.message || "Error al asociar la actividad."
      );
    }
  };

  return (
    <div>
      <Modal show={show} pathRedirect={pathname}>
        <div className="container_relative">
          <button onClick={closeModal} className="close-modal" aria-label="Cerrar">
            &times;
          </button>
          <br />

          <div className="form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="li_linea">
                Línea *:
                <span className="tooltip-icon highlight-icon" data-tooltip="Tema o área de investigación." >
                  <HelpIcon />
                </span>
              </label>
              <input type="text" name="li_linea" id="li_linea" value={linea?.li_linea || ""} disabled readOnly /><br />

              <label htmlFor="lg_actividad_realiza">
                Actividad que realiza *:
                <span className="tooltip-icon highlight-icon" data-tooltip="Tipo de trabajo dentro de la línea de investigación." >
                  <HelpIcon />
                </span>
              </label>
              <input type="text" name="lg_actividad_realiza" id="lg_actividad_realiza" {...register("lg_actividad_realiza", { required: "Este campo es obligatorio.", maxLength: { value: 100, message: "El campo solo admite 100 caracteres." }, })} />
              {errors.lg_actividad_realiza && <span className="error">{errors.lg_actividad_realiza.message}</span> }
              <br />

              <div className="btn">
                <button type="submit">Asociar a mi producción</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}

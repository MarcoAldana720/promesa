"use client"

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const ButtonResetPassword = ({ us_id }) => {
  const [loading, setLoading] = useState(false);

  const restablecer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`/api/admin/${us_id}/reset-password`);
      toast.success("La contraseña fue restaurada con éxito.");
    } catch (error) {
      toast.error("Error al restaurar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={restablecer}>
      <input type="hidden" value={us_id} name="id" />
      <button type="submit" className="btn_reset" disabled={loading} > {loading ? "Cargando..." : "Restaurar contraseña"} </button>
    </form>
  );
};

export default ButtonResetPassword;

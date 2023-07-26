import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const EditProfileModal = ({ onClose, userData, updateUserData }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (userData) {
      setValue("fullName", userData.fullName || "");
      setValue("address", userData.address || "");
      setValue("city", userData.city || "");
      setValue("state", userData.state || "");
      setValue("zipCode", userData.zipCode || "");
    }
  }, [userData]);

  const submitHandler = async ({ address, city, state, zipCode, fullName }) => {
    try {
      const newData = { ...userData, fullName, address, city, state, zipCode };
      const { data } = await axios.put(`api/user/${userData._id}`, newData);
      updateUserData(data);
      data
        ? toast.success("Sus datos fueron actualizados correctamente.")
        : toast.error("Hubo un error al intentar actualizar sus datos.");
      onClose();
    } catch (error) {}
  };

  return (
    <div className="absolute top-0 h-full w-full z-0 bg-black/60 overflow-clip">
      <div className="relative bg-gray-100 w-11/12 md:w-4/5 lg:w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <form
          className="mx-auto lg:w-full p-8"
          onSubmit={handleSubmit(submitHandler)}
          noValidate
        >
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-bold text-2xl">Editar Perfil</h1>
            <FontAwesomeIcon
              icon={faTimes}
              className="w-3 cursor-pointer"
              onClick={onClose}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              className="w-full"
              id="fullName"
              autoFocus
              {...register("fullName")}
            ></input>
          </div>

          <div className="mb-4">
            <label htmlFor="address">Domicilio</label>
            <input
              type="text"
              className="w-full"
              id="address"
              autoFocus
              {...register("address")}
            ></input>
          </div>

          <div className="mb-4">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              className="w-full"
              id="city"
              autoFocus
              {...register("city")}
            ></input>
          </div>

          <div className="mb-4">
            <label htmlFor="state">Provincia</label>
            <input
              type="text"
              className="w-full"
              id="state"
              autoFocus
              {...register("state")}
            ></input>
          </div>

          <div className="mb-4">
            <label htmlFor="zipCode">Código Postal</label>
            <input
              type="text"
              className="w-full"
              id="zipCode"
              autoFocus
              {...register("zipCode")}
            ></input>
          </div>

          <div className="mb-4">
            <button className="primary-button w-full">Confirmar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

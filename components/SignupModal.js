import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import { Layout } from "./Layout";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { getError } from "@/utils/error";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const SignupModal = ({ switchToLogin, onClose }) => {
  const router = useRouter();
  const { redirect } = router.query;

  const onChangeToLoginClick = () => {
    switchToLogin();
    onClose();
  };

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const submitHandler = async ({ username, email, password }) => {
    try {
      await axios.post("/api/auth/signup", {
        username,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      }
      onClose();
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <div className="fixed h-full w-full z-20 bg-black/60">
      <div className="relative bg-gray-100 w-11/12 md:w-4/5 lg:w-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <form
          className="mx-auto lg:w-full p-8"
          onSubmit={handleSubmit(submitHandler)}
          noValidate
        >
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-bold text-2xl">Crear cuenta</h1>
            <FontAwesomeIcon
              icon={faTimes}
              className="w-3 cursor-pointer"
              onClick={onClose}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              className="w-full"
              id="username"
              autoFocus
              {...register("username", {
                required: "Por favor ingrese su nombre",
                minLength: {
                  value: 2,
                  message:
                    "El nombre ingresado debe tener al menos 2 caracteres",
                },
              })}
            ></input>
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              className="w-full"
              id="email"
              {...register("email", {
                required: "Por favor ingrese su dirección de email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                  message: "Por favor ingrese un email válido",
                },
              })}
            ></input>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password">Contraseña</label>
            <input
              onChange={console.log(errors)}
              type="password"
              className="w-full"
              id="password"
              {...register("password", {
                required: "Por favor ingrese la contraseña",
                minLength: {
                  value: 5,
                  message:
                    "Por favor ingrese una contraseña de al menos 5 caracteres",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              onChange={console.log(errors)}
              type="password"
              className="w-full"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Por favor confirme la contraseña",
                validate: (value) => value === getValues("password"),
                // minLength: { value: 5, message: "Por favor ingrese una contraseña de al menos 5 caracteres" }
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
            {errors.confirmPassword &&
              errors.confirmPassword.type === "validate" && (
                <p className="text-red-500">
                  Las contraseñas ingresadas no coinciden
                </p>
              )}
          </div>

          <div className="mb-4">
            <button className="primary-button w-full">Crear cuenta</button>
          </div>

          <div className="mb-4">
            <p>
              ¿Ya tenés una cuenta?{" "}
              <span
                onClick={onChangeToLoginClick}
                className="underline inline cursor-pointer"
              >
                Iniciá sesión
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;

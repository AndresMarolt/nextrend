import { Layout } from "@/components/Layout";
import React, { useEffect } from "react";
import CheckoutWizard from "@/components/CheckoutWizard";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import db from "@/utils/db";
import User from "@/models/User";

const ShippingScreen = ({ userData }) => {
  userData = JSON.parse(userData);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue("fullName", userData.fullName);
    setValue("address", userData.address);
    setValue("city", userData.city);
    setValue("state", userData.state);
    setValue("zipCode", userData.zipCode);
  }, [shippingAddress]);

  const submitHandler = ({ fullName, address, city, state, zipCode }) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, state, zipCode },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: { fullName, address, city, state, zipCode },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Datos de envío">
      <CheckoutWizard activeStep={1}></CheckoutWizard>

      <form
        className="mx-auto w-11/12 md:max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Datos de envío</h1>
        <div className="mb-4">
          <label htmlFor="fullName">Nombre completo</label>
          <input
            type="text"
            className="w-full"
            id="fullName"
            autoFocus
            {...register("fullName", {
              required: "Por favor ingrese su nombre completo",
            })}
          />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="address">Domicilio</label>
          <input
            type="text"
            className="w-full"
            id="address"
            autoFocus
            {...register("address", {
              required: "Por favor ingrese su domicilio",
              minLength: {
                value: 3,
                message:
                  "El domicilio de envío debe tener más de dos caracteres",
              },
            })}
          />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="city">Ciudad</label>
          <input
            type="text"
            className="w-full"
            id="city"
            autoFocus
            {...register("city", {
              required: "Por favor ingrese su ciudad",
            })}
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="city">Provincia</label>
          <input
            type="text"
            className="w-full"
            id="state"
            autoFocus
            {...register("state", {
              required: "Por favor ingrese su provincia",
            })}
          />
          {errors.state && (
            <p className="text-red-500">{errors.state.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="zipCode">Código postal</label>
          <input
            type="text"
            className="w-full"
            id="zipCode"
            autoFocus
            {...register("zipCode", {
              required: "Por favor ingrese su código postal",
            })}
          />
          {errors.zipCode && (
            <p className="text-red-500">{errors.zipCode.message}</p>
          )}
        </div>

        <div className="mb-4 flex justify-between">
          <button className="primary-button">Continuar</button>
        </div>
      </form>
    </Layout>
  );
};

ShippingScreen.auth = true;

export default ShippingScreen;

export async function getServerSideProps(context) {
  const { user } = await getSession(context);
  let userData = null;
  if (user) {
    try {
      await db.connect();
      userData = await User.findById(user._id);
      userData = JSON.stringify(userData);
      await db.disconnect();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return {
    props: {
      userData,
    },
  };
}

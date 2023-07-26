import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import CheckoutWizard from "@/components/CheckoutWizard";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Store } from "@/utils/Store";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const PaymentScreen = () => {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error(
        "Debe elegir un método de pago para poder finalizar su compra"
      );
    }
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({ ...cart, paymentMethod: selectedPaymentMethod })
    );
    router.push("/place-order");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <Layout title={"Método de pago"}>
      <div className="m-auto">
        <CheckoutWizard activeStep={2} />
        <form className="mx-auto max-w-screen-md px-4" onSubmit={submitHandler}>
          <h1 className="mb-4 text-xl">Método de pago</h1>

          {["PayPal"].map((payment) => (
            <div key={payment} className="mb-4">
              <input
                name="paymentMethod"
                className="p-2 outline-none focus:ring-0"
                id={payment}
                type="radio"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              <label className="ml-2" htmlFor={payment}>
                {payment}
              </label>
            </div>
          ))}

          <div className="mb-4 flex justify-between">
            <button
              onClick={() => router.push("/shipping")}
              type="button"
              className="default-button"
            >
              Volver
            </button>

            <button className="primary-button">Continuar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

PaymentScreen.auth = true;

export default PaymentScreen;

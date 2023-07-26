import React, { useContext, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import CheckoutWizard from "@/components/CheckoutWizard";
import Link from "next/link";
import Image from "next/image";
import { Store } from "@/utils/Store";
import { useRouter } from "next/router";
import { getError } from "@/utils/error";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const PlaceOrderScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { items, shippingAddress, paymentMethod } = cart;

  const round2 = (num) => {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  };

  const itemsPrice = round2(
    items.reduce(
      (accumulator, item) => accumulator + item.quantity * item.price,
      0
    )
  );
  const shippingPrice = itemsPrice > 20000 ? 0 : 700;
  const totalPrice = round2(itemsPrice + shippingPrice);

  const PlaceOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("api/orders", {
        items,
        shippingAddress,
        shippingPrice,
        paymentMethod,
        itemsPrice,
        totalPrice,
      });

      dispatch({ type: "CART_CLEAR_ITEMS" });
      setLoading(false);
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  return (
    <Layout title={"Confirmar compra"}>
      <div className="m-auto">
        <CheckoutWizard activeStep={3} />
        <h1 className="text-xl px-2 pb-5 md:px-5 md:pb-0">Confirmar compra</h1>
        {!items.length ? (
          <p>
            El carrito está vacío.{" "}
            <Link href={"/"} className="text-blue-600">
              Volver a la tienda
            </Link>
          </p>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card px-2 md:p-5">
                <h2 className="mb-2 text-lg font-bold">Datos de envío</h2>
                <div>
                  <p>Nombre completo: {shippingAddress.fullName}</p>
                  <p>Domicilio: {shippingAddress.address},</p>
                  <p>Ciudad: {shippingAddress.city}</p>
                  <p>Código postal: {shippingAddress.zipCode}</p>
                  <p>Provincia: {shippingAddress.state}</p>
                </div>
                <Link className="text-blue-600" href={"/shipping"}>
                  Editar
                </Link>
              </div>

              <div className="card px-2 md:p-5">
                <h2 className="mb-2 text-lg font-bold">Método de pago</h2>
                <p>{paymentMethod}</p>
                <Link className="text-blue-600" href={"/payment"}>
                  Editar
                </Link>
              </div>

              <div className="card px-2 md:p-5">
                <h2 className="mb-2 text-lg font-bold">Finalizar compra</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className=" text-left">Producto</th>
                      <th className="p-5 text-right">Cantidad</th>
                      <th className="p-5 text-right">Precio</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={`${item._id}-${item.variant}-${item.size}`}
                        className="border-b"
                      >
                        <td>
                          <Link href={`/product/${item._id}`} className="flex">
                            <Image
                              src={`${item.variant.image}`}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="inline"
                            ></Image>
                            &nbsp;
                            <div className="flex flex-col justify-center">
                              <p className="m-0">{item.name}</p>
                              <p className="m-0">Color: {item.variant.name}</p>
                              <p className="m-0">Talle: {item.size}</p>
                            </div>
                          </Link>
                        </td>

                        <td className="p-5 text-right">{item.quantity}</td>
                        <td className="p-5 text-right">${item.price}</td>
                        <td className="p-5 text-right">
                          ${item.price * item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4">
                  <Link href={"/cart"} className="text-blue-600">
                    Editar
                  </Link>
                </div>
              </div>
            </div>

            <div className="card px-2 md:p-5">
              <h2 className="mb-2 text-lg">Resumen de compra</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <h3>Artículos</h3>
                    <p>${itemsPrice}</p>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <h3>Envío</h3>
                    <p>${shippingPrice}</p>
                  </div>
                </li>

                <li>
                  <div className="mb-2 flex justify-between">
                    <h3>Total</h3>
                    <p>${totalPrice}</p>
                  </div>
                </li>

                <li>
                  <button
                    className="primary-button w-full"
                    disabled={loading}
                    onClick={PlaceOrderHandler}
                  >
                    {loading ? "Cargando..." : "Finalizar compra"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

PlaceOrderScreen.auth = true;

export default PlaceOrderScreen;

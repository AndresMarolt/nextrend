import { Layout } from "@/components/Layout";
import { useRouter } from "next/router";
import { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { getError } from "@/utils/error";
import Link from "next/link";
import Image from "next/image";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { Store } from "@/utils/Store";
import Cookies from "js-cookie";
import Order from "@/models/Order";
import db from "@/utils/db";
import { useSession } from "next-auth/react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "", order: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, errorPay: "", successPay: false };
  }
};

const OrderScreen = ({ orderItems }) => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const router = useRouter();
  const orderId = query.id;
  const { state } = useContext(Store);
  const [
    { loading, error, order, successPay, loadingPay, errorPay },
    dispatch,
  ] = useReducer(reducer, { loading: true, order: {}, error: "" });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { cart } = state;
  const items = JSON.parse(orderItems).items;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };

    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });

        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay]);

  const {
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Se realizó su pago correctamente");
        dispatch({ type: "CLEAR_CART_ITEMS" });
        Cookies.set("cart", JSON.stringify({ ...cart, items: [] }));
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };

  const onError = (err) => {
    toast.error(getError(err));
  };

  if (session?.user?._id !== JSON.parse(orderItems).user) {
    router.push("/");
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <div className="container m-auto px-4">
        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p className="alert-error">{error}</p>
        ) : (
          <div className="grid mt-5 md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card p-5">
                <h1 className="mb-4">{`Orden #${orderId}`}</h1>
                <h2 className="mb-1 text-lg">Datos de envío</h2>
                <div>
                  <p>Nombre completo: {shippingAddress.fullName}</p>
                  <p>Domicilio: {shippingAddress.address},</p>
                  <p>Ciudad: {shippingAddress.city}</p>
                  <p>Código postal: {shippingAddress.zipCode}</p>
                  <p>Provincia: {shippingAddress.state}</p>
                </div>
                {isDelivered ? (
                  <p className="alert-success">
                    Estado: Entregado el {deliveredAt}
                  </p>
                ) : (
                  <p className="alert-error">Estado: No entregado</p>
                )}
              </div>

              <div className="card p-5">
                <h2 className="mb-2 text-lg">Método de pago</h2>
                <p>{paymentMethod}</p>
                {isPaid ? (
                  <p className="alert-success">Estado: Pagado el {paidAt}</p>
                ) : (
                  <p className="alert-error">Estado: No pagado</p>
                )}
              </div>

              <div className="card p-5 overflow-x-auto">
                <h2 className="mb-2 text-lg">Items de la orden</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Item</th>
                      <th className="p-5 text-right">Cantidad</th>
                      <th className="p-5 text-right">Precio</th>
                      <th className="p-5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={`${item._id}-${item.variant[0].name}`}
                        className="border-b"
                      >
                        <td>
                          <Link
                            href={`/product/${item._id}`}
                            className="flex items-center"
                          >
                            <Image
                              src={item.variant[0].image}
                              alt={item.name}
                              width={50}
                              height={50}
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
              </div>
            </div>

            <div>
              <div className="card p-5">
                <h2 className="mb-2 text-lg">Resúmen de su orden de compra</h2>
                <ul>
                  <li className="mb-2 flex justify-between">
                    <p>Items</p>
                    <p>${itemsPrice}</p>
                  </li>

                  <li className="mb-2 flex justify-between">
                    <p>Envío</p>
                    <p>${shippingPrice}</p>
                  </li>

                  <li className="mb-2 flex justify-between">
                    <p>Total</p>
                    <p>${totalPrice}</p>
                  </li>

                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <p>Cargando...</p>
                      ) : (
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}

                      {loadingPay && <p>Cargando...</p>}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

OrderScreen.auth = true;

export default OrderScreen;

export async function getServerSideProps(context) {
  const { id } = context.params;
  let orderItems;
  try {
    await db.connect();
    orderItems = await Order.findById(id);
    await db.disconnect();
  } catch (error) {
    console.error("Error fetching order data:", error);
  }
  orderItems = JSON.stringify(orderItems);

  return {
    props: {
      orderItems,
    },
  };
}

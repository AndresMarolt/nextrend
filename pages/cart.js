import { Layout } from "@/components/Layout";
import { Store } from "@/utils/Store";
import React, { useRef } from "react";
import { useContext } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const CartScreen = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { items },
  } = state;
  const router = useRouter();
  const { data: session } = useSession();

  const removeItemHandler = (item) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };

  const checkoutClickHandler = () => {
    session?.user
      ? router.push("/shipping")
      : dispatch({ type: "SET_SHOW_LOGIN_MODAL", payload: true });
  };

  return (
    <Layout title={"Cesta"}>
      <div className="container m-auto mt-10 px-4">
        <h1 className="mb-4 text-xl">Cesta</h1>

        {!items.length ? (
          <div>
            Cesta vacía.{" "}
            <Link href="/" className="text-blue-600">
              {" "}
              Volver a la tienda
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <table className="min-w-full">
                <thead className="border-b md:table-header-group">
                  <tr>
                    <th className="py-2 md:p-5 text-left">Item</th>
                    <th className="py-2 md:p-5 text-right">Precio</th>
                    <th className="py-2 mr-12 md:p-5 text-right">Cant.</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr
                      key={`${item._id}-${item.variant.name}-${item.size}`}
                      className="border-b"
                    >
                      <td className="w-1/2">
                        <Link
                          href={`/product/${item._id}`}
                          className="flex items-center"
                        >
                          <img
                            src={`${item.variant.image}`}
                            alt={item.name}
                            className="w-16 md:w-20"
                          />
                          &nbsp;
                          {item.name}
                          <br />
                          Color: {item.variant.name}
                          <br />
                          Talle: {item.size}
                        </Link>
                      </td>

                      <td className="md:p-5 text-right">${item.price}</td>

                      <td className="md:p-5 text-right">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(item, e.target.value)
                          }
                        >
                          {[...Array(item.stock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="md:p-5 text-center">
                        <button onClick={() => removeItemHandler(item)}>
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            className="h-5 w-5 m-auto"
                          ></FontAwesomeIcon>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card p-5">
              <ul>
                <li>
                  <h3 className="pb-3 text-xl">
                    Subtotal (
                    {items.reduce(
                      (accumulator, item) => accumulator + item.quantity,
                      0
                    )}
                    ) : $
                    {items.reduce(
                      (accumulator, item) =>
                        accumulator + item.quantity * item.price,
                      0
                    )}
                  </h3>
                </li>

                <li>
                  <button
                    onClick={checkoutClickHandler}
                    className="primary-button w-full"
                  >
                    Tramitar pedido
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

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });

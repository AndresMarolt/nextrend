import { Layout } from "@/components/Layout";
import EditProfileModal from "@/components/EditProfileModal";
import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import db from "@/utils/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Link from "next/link";

export default function profile({ userData, orderHistory }) {
  userData = JSON.parse(userData);
  orderHistory = JSON.parse(orderHistory);

  const { data: session } = useSession();
  const [user, setUser] = useState(userData);
  const [showEditModal, setEditShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let { data } = await axios.get(`/api/user/${session?.user?._id}`);
        setUser(data);

        const response = await axios.get(`api/user/ordersDetails`, {
          params: { orderIds: data?.orders },
        });
        orderHistory = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, []);

  if (!session) {
    return <div>Sign in required</div>;
  }

  const updateUserData = (newData) => {
    setUser(newData);
  };

  return (
    <Layout title="Profile">
      <div className="w-11/12 mx-auto my-10">
        <div className="flex flex-col gap-5 pb-10 border-b border-gray-300">
          <div className="mt-2 flex items-center">
            <h1 className="text-4xl inline mr-3">{user?.username}</h1>
            <button className="cursor-pointer">
              <FontAwesomeIcon
                className="w-4 text-black"
                icon={faPen}
                onClick={() => setEditShowModal(true)}
              />
            </button>
          </div>

          <div className="w-full flex flex-col justify-center gap-4">
            <div className="flex gap-2">
              <p className="font-bold">Nombre completo:</p>
              <p>{user?.fullName || "-"}</p>
            </div>
            <div className="flex gap-2">
              <p className="font-bold">Domicilio:</p>
              <p>{user?.address || "-"}</p>
            </div>

            <div className="flex gap-2">
              <p className="font-bold">Ciudad:</p>
              <p>{user?.city || "-"}</p>
            </div>

            <div className="flex gap-2">
              <p className="font-bold">Provincia:</p>
              <p>{user?.state || "-"}</p>
            </div>

            <div className="flex gap-2">
              <p className="font-bold">Código Postal:</p>
              <p>{user?.zipCode || "-"}</p>
            </div>
          </div>
        </div>

        <h1 className="text-2xl pt-10">Historial de órdenes</h1>
        <div className="flex flex-col items-center justify-center md:justify-start md:flex-row md:flex-wrap gap-4 mt-8">
          {!orderHistory.length && <p>No hay registro de órdenes de compra</p>}
          {orderHistory.map((order) => (
            <Link
              key={order._id}
              className="flex flex-col p-5 rounded-lg shadow-lg shadow-gray-300 cursor-pointer"
              href={`/order/${order._id}`}
            >
              <p>Órden #{order._id}</p>
              <br />
              <p>Items:</p>
              {order.items.map((item) => (
                <div key={item._id}>- {item.name}</div>
              ))}
              <br />
              <p>Costo de los artículos: ${order.itemsPrice}</p>
              <p>Costo de envío: ${order.shippingPrice}</p>
              <p>Costo total: ${order.totalPrice}</p>
              <br />
              <p>Método de pago: {order.paymentMethod}</p>
              <p>Pago: {order.isPaid ? "Realizado" : "Pendiente"}</p>
            </Link>
          ))}
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          className="w-1/2"
          onClose={() => setEditShowModal(false)}
          updateUserData={updateUserData}
          userData={user}
        />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { user } = await getSession(context);
  let userData = null;
  let orderHistory = [];

  if (user) {
    try {
      await db.connect();
      userData = await User.findById(user._id);
      orderHistory = await Order.find({ user: userData._id });
      await db.disconnect();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  userData = JSON.stringify(userData);
  orderHistory = JSON.stringify(orderHistory);
  return {
    props: {
      userData,
      orderHistory,
    },
  };
}

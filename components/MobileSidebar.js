"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const MobileSidebar = ({
  cartItemsCount,
  session,
  dispatch,
  logoutClickHandler,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="overflow-x-clip">
      <FontAwesomeIcon
        icon={faBars}
        className="w-4 cursor-pointer"
        onClick={() => setShowSidebar(true)}
      />
      <div
        className={`overflow-x-clip absolute top-0 flex flex-col w-2/3 left-full z-50 bg-white transition-all ease-in-out ${
          showSidebar &&
          "transform -translate-x-full shadow-2xl shadow-gray-600"
        }`}
        style={{ height: "100vh" }}
      >
        <FontAwesomeIcon
          className="w-4 h-12 mx-5 cursor-pointer"
          icon={faXmark}
          onClick={() => setShowSidebar(false)}
        />
        <ul className="p-5">
          <li className="py-2">
            <Link href="/cart" className="w-6 flex relative">
              <FontAwesomeIcon icon={faBagShopping} />
              {cartItemsCount > 0 && (
                <span className="rounded-full bg-red-600 px-1 h-4 text-xs font-bold text-white flex items-center absolute bottom- left-5">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </li>
          {session?.user ? (
            <>
              <li className="py-2 ">
                <Link
                  className="font-bold cursor-pointer text-blue-600"
                  href="/profile"
                >
                  Perfil ({session?.user?.username})
                </Link>
              </li>

              <li className="py-2 ">
                <span
                  className="font-bold cursor-pointer"
                  onClick={logoutClickHandler}
                >
                  Cerrar Sesión
                </span>
              </li>
            </>
          ) : (
            <li className="py-2 ">
              <span
                className="font-bold cursor-pointer"
                onClick={() =>
                  dispatch({ type: "SET_SHOW_LOGIN_MODAL", payload: true })
                }
              >
                Iniciar Sesión
              </span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileSidebar;

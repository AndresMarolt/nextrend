import React, { useEffect, useState, useContext, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import { Store } from "@/utils/Store";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "./LoginModal";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupModal from "./SignupModal";
import MobileSidebar from "./MobileSidebar";

export const Layout = ({ title, children }) => {
  const { state, dispatch } = useContext(Store);
  const { cart, showLoginModal, showSignupModal } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { status, data: session } = useSession();
  const [screenWidth, setScreenWidth] = useState(null);

  const screenWidthRef = useRef(null);

  useEffect(() => {
    setCartItemsCount(
      cart.items.reduce((accumulator, item) => accumulator + item.quantity, 0)
    );
    if (screenWidthRef.current === null) {
      screenWidthRef.current =
        typeof window !== "undefined" ? window.innerWidth : null;
      setScreenWidth(screenWidthRef.current);
    }
  }, [cart.items]);

  useEffect(() => {
    if (showLoginModal || showSignupModal) {
      document.documentElement.classList.add("overflow-y-hidden");
    } else {
      document.documentElement.classList.remove("overflow-y-hidden");
    }
  }, [showLoginModal, showSignupModal]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Nextrend` : "Nextrend"}</title>
        <meta name="description" content="Ecommerce website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex flex-col  font-raleway overflow-clip relative">
        <header className="sticky top-0 h-12 border-b bg-white border-x-gray-400 md:h-20 flex items-center justify-between z-20">
          <Link
            href="/"
            className="relative left-1/2 -translate-x-1/2 text-3xl font-light flex items-center font-lato"
          >
            N&nbsp;E&nbsp;X&nbsp;T&nbsp;R&nbsp;E&nbsp;N&nbsp;D
          </Link>
          <nav className=" flex h-12 px-4 items-center justify-between md:h-20">
            {screenWidth < 768 ? (
              <MobileSidebar
                cartItemsCount={cartItemsCount}
                dispatch={dispatch}
                session={session}
                logoutClickHandler={logoutClickHandler}
              />
            ) : (
              <div className="w-100 flex items-center gap-4">
                <Link href="/cart" className="p-2 flex relative">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    className="w-6 h-full"
                  />
                  {cartItemsCount > 0 && (
                    <span className="rounded-full bg-red-600 px-1 h-4 text-xs font-bold text-white flex items-center absolute bottom-5 left-7">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {status === "loading" ? (
                  <p>Cargando</p>
                ) : session?.user ? (
                  <Menu as="div" className="relative inline-block z-40">
                    <Menu.Button className="text-blue-600">
                      {session?.user?.username}
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 w-56 origin-top-right shadow-lg bg-white">
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/profile">
                          Perfil
                        </DropdownLink>
                      </Menu.Item>

                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="#"
                          onClick={logoutClickHandler}
                        >
                          Cerrar sesión
                        </DropdownLink>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                ) : (
                  <button
                    className="p-2"
                    onClick={() =>
                      dispatch({ type: "SET_SHOW_LOGIN_MODAL", payload: true })
                    }
                  >
                    Iniciar sesión
                  </button>
                )}
              </div>
            )}
          </nav>
        </header>

        {showLoginModal && (
          <LoginModal
            switchToSignup={() =>
              dispatch({ type: "SET_SHOW_SIGNUP_MODAL", payload: true })
            }
            onClose={() => {
              dispatch({ type: "SET_SHOW_LOGIN_MODAL", payload: false });
            }}
          />
        )}

        {showSignupModal && (
          <SignupModal
            switchToLogin={() =>
              dispatch({ type: "SET_SHOW_LOGIN_MODAL", payload: true })
            }
            onClose={() =>
              dispatch({ type: "SET_SHOW_SIGNUP_MODAL", payload: false })
            }
          />
        )}

        <main className="" style={{ minHeight: "84vh" }}>
          {children}
        </main>

        <footer
          className="flex justify-center items-center shadow-inner h-10"
          style={{ height: "5vh" }}
        >
          Copyright &#169; 2023 Nextrend
        </footer>
      </div>
    </>
  );
};

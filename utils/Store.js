import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { items: [], shippingAddress: {} },
  showModal: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existingItem = state.cart.items.find(
        (item) =>
          item._id === newItem._id &&
          item.size === newItem.size &&
          item.variant === newItem.variant
      );
      const cartItems = existingItem
        ? state.cart.items.map((item) =>
            item._id === newItem._id &&
            item.size === newItem.size &&
            item.variant === newItem.variant
              ? newItem
              : item
          )
        : [...state.cart.items, newItem];
      Cookies.set("cart", JSON.stringify({ ...state.cart, items: cartItems }));
      return { ...state, cart: { ...state.cart, items: cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.items.filter(
        (item) =>
          item._id !== action.payload._id ||
          item.size !== action.payload.size ||
          item.variant !== action.payload.variant
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, items: cartItems }));
      return { ...state, cart: { ...state.cart, items: cartItems } };
    }
    case "CART_RESET": {
      return {
        ...state,
        cart: {
          items: [],
          shippingAddress: {
            location: {},
          },
          paymentMethod: "",
        },
      };
    }
    case "CART_CLEAR_ITEMS": {
      return { ...state, cart: { ...state.cart, items: [] } };
    }
    case "SAVE_SHIPPING_ADDRESS": {
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    }
    case "SAVE_PAYMENT_METHOD": {
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    }
    case "SET_SHOW_LOGIN_MODAL": {
      return { ...state, showLoginModal: action.payload };
    }
    case "SET_SHOW_SIGNUP_MODAL": {
      return { ...state, showSignupModal: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};

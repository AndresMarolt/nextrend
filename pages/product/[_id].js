import React, { useContext, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Store } from "@/utils/Store";
import db from "@/utils/db";
import Product from "@/models/Product";
import axios from "axios";
import { toast } from "react-toastify";

const ProductScreen = (props) => {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const [itemStock, setItemStock] = useState(null);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedVariant, setSelectedVariant] = useState(0);

  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await axios.get(`/api/products/${product._id}`);
      setItemStock(data.stock);
    };
    fetchStock();
  }, []);

  if (!product) {
    return (
      <Layout title={"Producto no encontrado"}>Producto no encontrado</Layout>
    );
  }

  const addToCartHandler = async () => {
    const existingItem = state.cart.items.find(
      (item) =>
        item._id === product._id &&
        item.variant.name === product.variants[selectedVariant].name
    );

    if (existingItem) {
      toast.warn("Este producto ya fue agregado a la cesta.");
    } else {
      const size = selectedSize;
      const variant = product.variants[selectedVariant];
      const { data } = await axios.get(`/api/products/${product._id}`);
      setItemStock(data.stock);
      if (itemStock < 1) {
        toast.error("Lo sentimos, no queda stock de este producto");
      }
      dispatch({
        type: "CART_ADD_ITEM",
        payload: { ...product, quantity: 1, size, variant },
      });
      toast.success("Producto agregado a la cesta");
    }
  };

  return (
    <Layout title={product.name}>
      <div className="container m-auto px-4">
        <div className="py-2">
          <Link href="/" className="text-blue-600">
            Volver
          </Link>
        </div>

        <div className="grid md:grid-cols-8 md:gap-3 w-full">
          <div className="md:col-span-3 w-full">
            <Image
              src={product.variants[selectedVariant].image}
              alt={product.name}
              width={"60"}
              height={"0"}
              sizes="100wv"
              className="w-full"
            ></Image>
          </div>

          <div className="w-full py-5 md:col-span-3">
            <ul>
              <li>
                <h1 className="text-3xl mb-3">{product.name}</h1>
              </li>

              <li>
                <h1 className="text-lg">
                  Valoración: {product.rating} de {product.numReviews} reseñas
                </h1>
              </li>

              <li>
                <h1 className="text-lg">{product.description}</h1>
              </li>

              {product.variants.length > 1 && (
                <li className="flex gap-2 mt-5">
                  {product.variants.map((variant, index) => (
                    <Image
                      key={variant.image}
                      src={variant.image}
                      alt={variant.image}
                      width={50}
                      height={50}
                      className={`border border-gray-300 px-2 cursor-pointer ${
                        selectedVariant === index && "border-2 border-gray-900"
                      }`}
                      onClick={() => {
                        setSelectedVariant(index);
                      }}
                    />
                  ))}
                </li>
              )}

              <li className="flex mt-5">
                <p className="mr-3">Seleccioná tu talle:</p>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className={`border border-gray-300 px-2 cursor-pointer ${
                        selectedSize === size && "border-2 border-gray-900"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          <div className="w-full md:col-span-2">
            <div className="card p-5">
              <div className="mb-2 flex justify-between">
                <p>Precio</p>
                <p>${product.price}</p>
              </div>

              <div className="mb-2 flex justify-between">
                <p>Stock</p>
                <p>
                  {itemStock > 0
                    ? "Disponible"
                    : "No disponible en este momento"}
                </p>
              </div>

              <button
                className="primary-button w-full"
                onClick={addToCartHandler}
              >
                Agregar a la Cesta
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { _id } = params;

  await db.connect();

  try {
    const product = await Product.findById(_id).lean();
    await db.disconnect();
    return {
      props: {
        product: db.convertDocToObjects(product),
      },
    };
  } catch (error) {
    await db.disconnect();
    return {
      props: {
        product: null,
      },
    };
  }
};

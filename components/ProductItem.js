import React from "react";
import Link from "next/link";
import Image from "next/image";

export const ProductItems = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product._id}`} className="">
        <Image
          src={product.variants[0].image}
          alt={product.name}
          className="w-full"
          width={199}
          height={0}
        />
        <div className="flex flex-col items-start justify-center py-3 text-sm ">
          <h3 className="mb-1">{product?.name}</h3>
          <div className="flex gap-1 mb-2">
            {product.variants.map((variant) => (
              <span
                key={`${product.name}-${variant.name}`}
                className="inline-block h-5 w-5 rounded-full border border-gray-300"
                style={{ backgroundColor: `${variant.color}` }}
              ></span>
            ))}
          </div>
          <div className="flex gap-0 md:gap-2 mb-1">
            {product?.sizes?.map((size) => (
              <span
                key={`${product.name}-${size}`}
                className="border border-gray-300 px-2"
              >
                {size}
              </span>
            ))}
          </div>
          <p>${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

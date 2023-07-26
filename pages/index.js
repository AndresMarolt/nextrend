import { Layout } from "@/components/Layout";
import { ProductItems } from "@/components/ProductItem";
import db from "@/utils/db";
import Product from "@/models/Product";
import HeroCarousel from "@/components/HeroCarousel";
import { Fragment } from "react";

export default function Home({ products }) {
  return (
    <Layout title="Homepage" className="">
      <HeroCarousel as={Fragment} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 container m-auto px-4">
        {products.map((product) => (
          <ProductItems product={product} key={product._id}></ProductItems>
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObjects),
    },
  };
};

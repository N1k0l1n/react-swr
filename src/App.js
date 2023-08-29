import React from "react";
import useSWR, { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false, fetcher }}>
      <Products />
    </SWRConfig>
  );
}

function Products() {
  const url = "https://dummyjson.com/products";
  const { data, error } = useSWR(url);

  if (error) return <div>Error...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <DisplayProducts
      products={data.products} // Accessing the nested products array
      categories={[...new Set(data.products.map(product => product.category))]}
    />
  );
}

function DisplayProducts({ products, categories }) {
  const [filterCategory, setFilterCategory] = React.useState(null);

  const filteredProducts = filterCategory
    ? products.filter(product => product.category === filterCategory)
    : products;

  return (
    <>
      {categories.map(category => (
        <button
          onClick={() => {
            setFilterCategory(category);
          }}
          key={category}
        >
          {category}
        </button>
      ))}
      {filterCategory && (
        <button
          onClick={() => {
            setFilterCategory(null);
          }}
        >
          reset
        </button>
      )}

      <pre>{JSON.stringify(filteredProducts, null, 2)}</pre>
    </>
  );
}

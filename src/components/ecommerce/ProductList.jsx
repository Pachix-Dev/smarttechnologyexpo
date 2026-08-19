import React from "react";
import ecommerceStore from "../../store/ecommerce-store";
import ProductCard from "./ProductCard";
import CartSummary from "./CartSummary";
import { ECOMMERCE_PRODUCTS } from "../../data/ecommerce_products";

export default function ProductList({ language }) {
  const { addToCart } = ecommerceStore();

  const products = ECOMMERCE_PRODUCTS;

  // Agrupar productos por categoría
  const productsByCategory = {};
  const activeProducts = products.filter(
    (product) => product.status === "active",
  );
  activeProducts.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  const categoryLabels = {
    womens_networking: "Women Networking - Smart Technology Expo",
    drone_innovations: "Drone Innovations Forum",
    csia: "Control System Integrators Association (CSIA)",
  };

  // Filtrar productos inactivos
  // const activeProducts = products.filter(product => product.status === 'active');

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <section className="min-w-0 space-y-10">
          {Object.entries(productsByCategory).map(([category, items]) => (
            <div
              key={category}
              className="border-b border-slate-200 pb-10 last:border-b-0 last:pb-0"
            >
              <h2 className="mb-5 text-xl font-black uppercase tracking-wide text-slate-900 sm:mb-6 sm:text-2xl">
                {categoryLabels[category] || category}
              </h2>

              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {items.map((product) => (
                  <ProductCard
                    languageProp={language}
                    key={product.id_product}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}

          {activeProducts.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              {language === "es"
                ? "No hay productos disponibles en este momento."
                : "No products available at this time."}
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <CartSummary showCheckoutButton checkoutPath={language === "es" ? "/checkout" : "/en/checkout"} />
        </aside>
      </div>
    </div>
  );
}

import React from "react";
import ecommerceStore from "../../store/ecommerce-store";
import ProductCard from "./ProductCard";
import CartSummary from "./CartSummary";
import { ECOMMERCE_PRODUCTS } from "../../data/ecommerce_products";

export default function ProductList({ language }) {
  const { addToCart } = ecommerceStore();

  const activeProducts = ECOMMERCE_PRODUCTS.filter(
    (product) => product.status === "active",
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <section className="min-w-0">
          {activeProducts.length > 0 ? (
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {activeProducts.map((product) => (
                <ProductCard
                  languageProp={language}
                  key={product.id_product}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
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

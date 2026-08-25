import React, { useState } from "react";

export default function ProductCard({ product, languageProp, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      product_id: product.id_product,
      quantity: parseInt(quantity),
      name: languageProp === "es" ? product.name_es : product.name_en,
      price: product.price,
      event_date:
        languageProp === "es" ? product.event_date_es : product.event_date_en,
    });

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
    setQuantity(1);
  };

  const isOutOfStock =
    product.capacity_limit !== null && product.available_capacity <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      <div className="p-6">
        {/* Nombre */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-400 pb-2">
          {languageProp === "es" ? product.name_es : product.name_en}
        </h3>

        {/* Descripción */}
        {product.description_es && (
          <p className="text-gray-600 text-sm mb-4">
            {languageProp === "es"
              ? product.description_es
              : product.description_en}
          </p>
        )}

        {/* Fecha */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-semibold flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <path
                fill="currentColor"
                d="M5.673 0a.7.7 0 0 1 .7.7v1.309h7.517v-1.3a.7.7 0 0 1 1.4 0v1.3H18a2 2 0 0 1 2 1.999v13.993A2 2 0 0 1 18 20H2a2 2 0 0 1-2-1.999V4.008a2 2 0 0 1 2-1.999h2.973V.699a.7.7 0 0 1 .7-.699M1.4 7.742v10.259a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V7.756zm5.267 6.877v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zm-8.333-3.977v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zM4.973 3.408H2a.6.6 0 0 0-.6.6v2.335l17.2.014V4.008a.6.6 0 0 0-.6-.6h-2.71v.929a.7.7 0 0 1-1.4 0v-.929H6.373v.92a.7.7 0 0 1-1.4 0z"
              />
            </svg>
            {languageProp === "es"
              ? product.event_date_es
              : product.event_date_en}
          </p>
        </div>

        {/* Horario */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-semibold flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12" />
                <path
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="2"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12Z"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeWidth="2"
                  d="M12 6.5V12l3 3"
                />
              </g>
            </svg>
            {product.schedule}
          </p>
        </div>

        {/* Lugar */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-semibold flex items-center gap-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2m6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14c4.05-3.7 6-6.8 6-9.14M12 2c4.2 0 8 3.22 8 8.2c0 3.32-2.67 7.25-8 11.8c-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2"
              />
            </svg>
            {languageProp === "es" ? product.venue_es : product.venue_en}
          </p>
        </div>

        {/* Disponibilidad */}
        <div className="mb-4">
          <p className="text-gray-700 text-sm font-semibold flex items-center gap-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9.175 10.825Q8 9.65 8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12t-2.825-1.175M4 20v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
              />
            </svg>
            {languageProp === "es"
              ? product.capacity_desc_es
              : product.capacity_desc_en}
          </p>
        </div>

        {/* Precio */}
        <div className="mb-6">
          <div className="border-2 border-solid border-green-800 bg-green-600/10 rounded-lg p-2 mb-2">
            <h4 className="text-base font-bold mb-2 uppercase text-green-800">
              {languageProp === "es"
                ? "Preventa : Agosto y septiembre"
                : "Presale : August and September"}
            </h4>
            <span className="text-3xl font-bold text-green-800">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <span className="text-gray-600 text-sm ml-2 font-bold">MXN</span>
            {languageProp === "es" ? " con IVA incluido" : " with VAT included"}
          </div>
          <div className="flex flex-col">
            <span className="uppercase">
              {languageProp === "es"
                ? "Precio regular: octubre y noviembre "
                : "Regular price: October and November "}
            </span>
            <span className="text-gray-600 text-base font-bold">
              ${parseFloat(product.final_price).toFixed(2)}
              <span className="text-sm ml-2 font-normal">
                MXN
                {languageProp === "es"
                  ? " con IVA incluido"
                  : " with VAT included"}
              </span>
            </span>
          </div>
          {/* <span className="text-gray-500 text-sm ml-2">
            {product.capacity_limit === null
              ? languageProp === "es" ? "Disponible" : "Available"
              : languageProp === "es" ? "No disponible" : "Not available"
            }
          </span> */}
        </div>

        {/* Cantidad */}
        {!isOutOfStock && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {languageProp === "es" ? "Cantidad" : "Quantity"}
            </label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.capacity_limit || 100}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  const max = product.capacity_limit || 100;
                  setQuantity(Math.min(val, max));
                }}
                className="flex-1 text-center py-2 font-semibold"
              />
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(quantity + 1, product.capacity_limit || 100),
                  )
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
            isOutOfStock
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isOutOfStock
            ? languageProp === "es"
              ? "Agotado"
              : "Out of Stock"
            : languageProp === "es"
              ? "Añadir al Carrito"
              : "Add to Cart"}
        </button>

        {/* Mensaje de producto añadido */}
        {addedMessage && (
          <div className="mt-3 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded text-sm text-center">
            ✓ {languageProp === "es" ? "Se añadió al carrito" : "Added to cart"}
          </div>
        )}
      </div>
    </div>
  );
}

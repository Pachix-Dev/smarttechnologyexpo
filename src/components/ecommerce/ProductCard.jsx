import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      product_id: product.id_product,
      quantity: parseInt(quantity),
      name: product.name,
      price: product.price,
      event_date: product.event_date,
    });

    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
    setQuantity(1);
  };

  const isOutOfStock =
    product.capacity_limit !== null && product.available_capacity <= 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200">
      <div className="p-6">
        {/* Tipo de producto */}
        {/* <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {product.product_type === 'event'
              ? 'Evento'
              : product.product_type === 'workshop'
              ? 'Taller'
              : 'Conferencia'}
          </span>
        </div> */}

        {/* Nombre */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>

        {/* Descripción */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        )}

        {/* Fecha */}
        <div className="text-sm text-gray-500 mb-4">
          📅 {formatDate(product.event_date)}
        </div>

        {/* Disponibilidad */}
        <div className="mb-4">
          {product.capacity_limit === null ? (
            <p className="text-green-600 text-sm font-semibold">Disponible</p>
          ) : isOutOfStock ? (
            <p className="text-red-600 text-sm font-semibold">Agotado</p>
          ) : (
            <p className="text-green-600 text-sm font-semibold">
              {product.available_capacity} lugares disponibles
            </p>
          )}
        </div>

        {/* Precio */}
        <div className="mb-6">
          <span className="text-3xl font-bold text-blue-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="text-gray-600 text-sm ml-2">MXN</span> / por persona
        </div>

        {/* Cantidad */}
        {!isOutOfStock && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad
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
                    Math.min(quantity + 1, product.available_capacity || 100)
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
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
        </button>

        {/* Mensaje de producto añadido */}
        {addedMessage && (
          <div className="mt-3 bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded text-sm text-center">
            ✓ Añadido al carrito
          </div>
        )}
      </div>
    </div>
  );
}

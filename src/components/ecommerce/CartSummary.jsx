import React from 'react';
import ecommerceStore from '../../store/ecommerce-store';

export default function CartSummary({ showCheckoutButton = false, checkoutPath = '/checkout' }) {
  const { cart, removeFromCart, updateCartQuantity, pricing } = ecommerceStore();
  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
  const discount = Math.min(Number(pricing?.discount || 0), subtotal);
  const finalAmount = Math.max(0, subtotal - discount);

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Resumen del Carrito</h2>

      {/* Items del carrito */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {cart.map((item) => (
          <div key={item.product_id} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-600">
                ${parseFloat(item.price).toFixed(2)} c/u
              </p>
            </div>

            <div className="flex items-center gap-2 mx-4">
              <button
                onClick={() =>
                  updateCartQuantity(item.product_id, item.quantity - 1)
                }
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() =>
                  updateCartQuantity(item.product_id, item.quantity + 1)
                }
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="text-red-600 hover:text-red-800 text-sm mt-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totales */}
      <div className="border-t-2 pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} MXN</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Descuento:</span>
            <span>-${discount.toFixed(2)} MXN</span>
          </div>
        )}

        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
          <span>Total:</span>
          <span className="text-blue-600">${finalAmount.toFixed(2)} MXN</span>
        </div>

        {showCheckoutButton && (
          <a
            href={checkoutPath}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Pagar
          </a>
        )}
      </div>
    </div>
  );
}

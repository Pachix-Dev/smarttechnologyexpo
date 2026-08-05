import React, { useState, useEffect } from 'react';
import ecommerceStore from '../../store/ecommerce-store';
import { ecommerceFetch } from '../../lib/ecommerceApi';

export default function CheckoutForm({ onOrderCreated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const {
    visitor,
    cart,
    couponCode,
    setPricing,
    setPendingOrder,
    setCurrentOrder,
    clearMessages,
    pricing,
  } = ecommerceStore();

  // Recalcular precios cuando cambia el carrito o cupón
  useEffect(() => {
    if (cart.length > 0 && visitor) {
      handleRecalculateTotal();
    }
  }, [cart, couponCode, visitor]);

  const handleRecalculateTotal = async () => {
    try {
      // Crear carrito en formato esperado por el backend
      const cartItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        expected_price: item.price,
      }));

      // Preparar orden temporal: pricing + orden PayPal (sin persistir en DB)
      const response = await ecommerceFetch('/ecommerce/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_email: visitor.email,
          cart_items: cartItems,
          coupon_code: couponCode || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPricing(data.pricing);
        setPendingOrder({
          visitor_email: visitor.email,
          coupon_code: couponCode || null,
          cart_items: cartItems,
          pricing: data.pricing,
          paypal_order_id: data.paypal_order_id,
          prepared_at: Date.now(),
        });
        setCurrentOrder({
          paypal_order_id: data.paypal_order_id,
        });
        setMessage('');
      } else {
        setMessage(data.message || 'Error calculando total');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error recalculating total:', error);
      // Silencioso en error de cálculo
    }
  };

  const handleProceedToPayment = async () => {
    if (!visitor) {
      setMessage('Por favor verifica tu registro primero');
      setMessageType('error');
      return;
    }

    if (cart.length === 0) {
      setMessage('Tu carrito está vacío');
      setMessageType('error');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      // El handleRecalculateTotal ya ha creado la orden
      // Aquí procedemos al pago con PayPal
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      setMessage('Error preparando pago');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (!visitor) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
        <p className="font-semibold">Debes verificar tu registro primero</p>
        <p className="text-sm mt-1">Usa el formulario de verificación anterior</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No hay productos en tu carrito</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Resumen de Compra</h3>

      {/* Info del visitante */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <p className="text-sm text-gray-600">Comprador registrado:</p>
        <p className="text-lg font-bold text-gray-900">{visitor.name}</p>
        <p className="text-sm text-gray-600">{visitor.email}</p>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Productos:</h4>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} x {item.quantity}
              </span>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Totales */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border-t-2">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>${pricing.subtotal.toFixed(2)} MXN</span>
          </div>

          {pricing.discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Descuento:</span>
              <span>-${pricing.discount.toFixed(2)} MXN</span>
            </div>
          )}

          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
            <span>Total a Pagar:</span>
            <span className="text-blue-600">${pricing.final_amount.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div
          className={`text-sm px-4 py-3 rounded mb-4 ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800'
              : messageType === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {message}
        </div>
      )}

      {/* Botón de pago */}
      <button
        onClick={handleProceedToPayment}
        disabled={loading || cart.length === 0}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Procesando...' : 'Continuar al Pago'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        En el siguiente paso seleccionarás tu método de pago con PayPal
      </p>
    </div>
  );
}

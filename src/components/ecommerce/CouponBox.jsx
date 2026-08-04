import React, { useState } from 'react';
import ecommerceStore from '../../store/ecommerce-store';
import { ecommerceFetch } from '../../lib/ecommerceApi';

export default function CouponBox() {
  const [inputCode, setInputCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { coupon, setCoupon, setCouponCode, clearCoupon, cart, pricing } =
    ecommerceStore();

  const handleValidateCoupon = async (e) => {
    e.preventDefault();

    if (!inputCode.trim()) {
      setMessage('Por favor ingresa un código de cupón');
      setMessageType('error');
      return;
    }

    if (cart.length === 0) {
      setMessage('Añade productos al carrito primero');
      setMessageType('error');
      return;
    }

    setValidating(true);
    setMessage('');

    try {
      const response = await ecommerceFetch('/ecommerce/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setCoupon(data.coupon);
        setCouponCode(inputCode.trim());
        setMessage('✓ Cupón validado y aplicado');
        setMessageType('success');
        setInputCode('');

        // Recalcular totales con el cupón
        handleRecalculatePricing(data.coupon.id_coupon);
      } else {
        setMessage(data.message || 'Cupón no válido');
        setMessageType('error');
        clearCoupon();
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setMessage('Error validando cupón');
      setMessageType('error');
    } finally {
      setValidating(false);
    }
  };

  const handleRecalculatePricing = async (couponId) => {
    // Esta función se llama desde CheckoutForm después de aplicar el cupón
    // Por ahora es un placeholder
  };

  const handleRemoveCoupon = () => {
    clearCoupon();
    setInputCode('');
    setMessage('Cupón removido');
    setMessageType('info');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Código de Descuento</h3>

      {!coupon ? (
        <form onSubmit={handleValidateCoupon} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ingresa tu código"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={validating}
            />
            <button
              type="submit"
              disabled={validating || !inputCode.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {validating ? 'Validando...' : 'Aplicar'}
            </button>
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded ${
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
        </form>
      ) : (
        <div className="bg-white p-4 rounded-lg border-2 border-green-300">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-600">Cupón aplicado:</p>
              <p className="text-xl font-bold text-green-600">{coupon.code}</p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Remover
            </button>
          </div>

          {coupon.description && (
            <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
          )}

          <div className="bg-green-50 p-2 rounded text-sm">
            <p className="text-green-800 font-semibold">
              Descuento: ${pricing.discount.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

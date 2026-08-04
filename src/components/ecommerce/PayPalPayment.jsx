import React, { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import ecommerceStore from '../../store/ecommerce-store';
import { ecommerceFetch } from '../../lib/ecommerceApi';

export default function PayPalPayment({ orderId, paypalOrderId, onSuccess, onError }) {
  const [isApproving, setIsApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paypalClientId, setPayPalClientId] = useState('');
  const [paypalCurrency, setPayPalCurrency] = useState('MXN');
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  const { visitor, pricing, currentOrder, pendingOrder, clearCheckoutState } = ecommerceStore();

  const activePaypalOrderId = paypalOrderId ?? pendingOrder?.paypal_order_id ?? currentOrder?.paypal_order_id;

  useEffect(() => {
    let active = true;

    const loadPayPalConfig = async () => {
      try {
        const response = await ecommerceFetch('/ecommerce/paypal-config');
        const data = await response.json();

        if (!active) return;

        if (response.ok && data?.success && data?.paypal?.client_id) {
          setPayPalClientId(data.paypal.client_id);
          setPayPalCurrency(data?.paypal?.currency || 'MXN');
          setErrorMessage('');
        } else {
          setErrorMessage(data?.message || 'No se pudo obtener configuración de PayPal');
        }
      } catch (error) {
        if (active) {
          setErrorMessage('Error cargando configuración de PayPal');
        }
      } finally {
        if (active) {
          setIsConfigLoading(false);
        }
      }
    };

    loadPayPalConfig();

    return () => {
      active = false;
    };
  }, []);

  if (!visitor || !pendingOrder || !activePaypalOrderId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg">
        <p className="font-semibold">Información de orden incompleta</p>
      </div>
    );
  }

  if (isConfigLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-lg">
        <p className="font-semibold">Cargando configuración de PayPal...</p>
      </div>
    );
  }

  if (!paypalClientId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
        <p className="font-semibold">Falta configurar CLIENT_ID en server/.env</p>
      </div>
    );
  }

  const handleApprove = async (data) => {
    setIsApproving(true);
    setErrorMessage('');

    try {
      const orderIdFromPaypal = data?.orderID || activePaypalOrderId;

      if (orderIdFromPaypal !== activePaypalOrderId) {
        throw new Error('El ID de la orden de PayPal no coincide con la orden preparada');
      }

      const response = await ecommerceFetch('/ecommerce/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paypal_order_id: orderIdFromPaypal,
          pending_order: pendingOrder,
        }),
      });

      const captureData = await response.json();

      if (captureData.success) {
        const params = new URLSearchParams();
        if (captureData.order_id) params.set('order_id', String(captureData.order_id));
        if (captureData.transaction_id) params.set('tx', String(captureData.transaction_id));

        clearCheckoutState();

        // Pago exitoso
        if (onSuccess) {
          onSuccess({
            order_id: captureData.order_id,
            transaction_id: captureData.transaction_id,
            tickets_created: captureData.tickets_created,
            ticket_ids: captureData.ticket_ids,
          });
        }

        window.location.assign(
          `/gracias-por-tu-compra${params.toString() ? `?${params.toString()}` : ''}`
        );
      } else {
        setErrorMessage(captureData.message || 'Error capturando pago');
        if (onError) {
          onError(captureData.message);
        }
      }
    } catch (error) {
      console.error('Error in capture:', error);
      setErrorMessage('Error procesando el pago: ' + error.message);
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleError = (err) => {
    console.error('PayPal error:', err);
    setErrorMessage('Error en PayPal: ' + err.message);
    if (onError) {
      onError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-bold mb-6">Procesar Pago con PayPal</h3>

      {/* Resumen */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span>${pricing.subtotal.toFixed(2)} MXN</span>
          </div>

          {pricing.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento:</span>
              <span>-${pricing.discount.toFixed(2)} MXN</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total a Pagar:</span>
            <span className="text-blue-600">${pricing.final_amount.toFixed(2)} MXN</span>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* PayPal Buttons */}
      {!isApproving && (
        <div className="border rounded-lg p-4 mb-4">
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: paypalCurrency,
              intent: 'capture',
            }}
          >
            <PayPalButtons
              createOrder={async () => {
                // La orden ya fue creada en el backend
                // Solo retornamos el ID de PayPal
                return activePaypalOrderId;
              }}
              onApprove={async (data) => {
                handleApprove(data);
              }}
              onError={handleError}
              onCancel={() => {
                setErrorMessage('Pago cancelado por el usuario');
              }}
            />
          </PayPalScriptProvider>
        </div>
      )}

      {isApproving && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          <p className="font-semibold">Procesando pago...</p>
          <p className="text-sm">Por favor espera mientras procesamos tu transacción</p>
        </div>
      )}

      <p className="text-xs text-gray-600 text-center mt-4">
        Tu información de pago es procesada de forma segura por PayPal
      </p>
    </div>
  );
}

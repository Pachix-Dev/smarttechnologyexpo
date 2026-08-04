import React, { useState } from 'react';
import ecommerceStore from '../../store/ecommerce-store';
import { ecommerceFetch } from '../../lib/ecommerceApi';

export default function VisitorLookup({ onVisitorFound }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { visitor, setVisitor, clearVisitor } = ecommerceStore();

  const handleSearchVisitor = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage('Por favor ingresa tu email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await ecommerceFetch(
        `/ecommerce/visitor?email=${encodeURIComponent(email.trim())}`
      );

      const data = await response.json();

      if (data.success) {
        setVisitor(data.visitor);
        setMessage('✓ Visitante encontrado');
        setMessageType('success');
        if (onVisitorFound) {
          onVisitorFound(data.visitor);
        }
      } else {
        setMessage(data.message || 'Visitante no registrado');
        setMessageType('error');
        clearVisitor();
      }
    } catch (error) {
      console.error('Error searching visitor:', error);
      setMessage('Error buscando visitante');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearVisitor = () => {
    clearVisitor();
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
      <h3 className="font-bold text-lg mb-4 text-gray-800">Verificar Registro</h3>

      {!visitor ? (
        <form onSubmit={handleSearchVisitor} className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Por favor ingresa el email con el que te registraste en el evento
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Buscando...' : 'Verificar'}
            </button>
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded ${
                messageType === 'success'
                  ? 'bg-green-100 text-green-800'
                  : messageType === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      ) : (
        <div className="bg-white p-4 rounded-lg border-2 border-green-300 space-y-3">
          <div>
            <p className="text-sm text-gray-600">Visitante registrado:</p>
            <p className="text-lg font-bold text-gray-900">{visitor.name}</p>
            <p className="text-sm text-gray-600">{visitor.email}</p>
          </div>

          <div className="bg-green-50 p-2 rounded">
            <p className="text-green-700 text-sm font-semibold">
              ✓ Listo para continuar con tu compra
            </p>
          </div>

          <button
            onClick={handleClearVisitor}
            className="text-red-600 hover:text-red-800 font-semibold text-sm"
          >
            Cambiar visitante
          </button>
        </div>
      )}

      {!visitor && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
          <p className="font-semibold mb-1">¿No tienes registro aún?</p>
          <p>
            Debes registrarte en el evento antes de poder comprar entradas. Por favor visita{' '}
            <a href="/registro" className="text-yellow-700 underline hover:text-yellow-900">
              el formulario de registro
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

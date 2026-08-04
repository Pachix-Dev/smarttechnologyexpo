import React, { useState, useEffect } from 'react';
import ecommerceStore from '../../store/ecommerce-store';
import ProductCard from './ProductCard';
import CartSummary from './CartSummary';
import { ecommerceFetch } from '../../lib/ecommerceApi';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, setError: setStoreError } = ecommerceStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ecommerceFetch('/ecommerce/products');
        
        if (!response.ok) {
          throw new Error('Error obteniendo productos');
        }

        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products);
          setError(null);
        } else {
          setError('No se pudieron cargar los productos');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setStoreError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [setStoreError]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  // Agrupar productos por categoría
  const productsByCategory = {};
  products.forEach((product) => {
    if (!productsByCategory[product.category]) {
      productsByCategory[product.category] = [];
    }
    productsByCategory[product.category].push(product);
  });

  const categoryLabels = {
    womens_networking: 'Women Networking - Smart Technology Expo',
    drone_innovations: 'Drone Innovations Forum',
    csia: 'Control System Integrators Association (CSIA)',
  };

  return (
    <div className="py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section>
          <h1 className="mb-12 text-center text-4xl font-bold">Nuestros Productos</h1>

          {Object.entries(productsByCategory).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h2 className="mb-8 text-2xl font-bold uppercase text-gray-800">
                {categoryLabels[category] || category}
              </h2>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {items.map((product) => (
                  <ProductCard
                    key={product.id_product}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="py-20 text-center text-gray-500">
              No hay productos disponibles en este momento
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <CartSummary showCheckoutButton checkoutPath="/checkout" />
        </aside>
      </div>
    </div>
  );
}

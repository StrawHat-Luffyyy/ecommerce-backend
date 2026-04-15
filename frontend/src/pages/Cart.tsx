import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Trash2 } from "lucide-react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { useState } from "react";

export const Cart = () => {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout");
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Sync cart to backend redis storage
      await Promise.all(
        items.map((item) =>
          api.post("/cart", { productId: item.product.id, quantity: item.quantity })
        )
      );

      // 2. Create the order to generate Stripe clientSecret
      const orderResponse = await api.post("/orders");
      const { clientSecret, order } = orderResponse.data.data;
      
      // 3. Move to our dedicated Checkout wrapper with the secret
      navigate("/checkout", { state: { clientSecret, orderId: order.id } });
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState 
        title="Your cart is empty" 
        description="Looks like you haven't added anything to your cart yet."
        actionLabel="Continue Shopping"
        onAction={() => navigate("/products")}
      />
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start" onSubmit={(e) => e.preventDefault()}>
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"}
                      alt={item.product.name}
                      className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <Link to={`/products/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                              {item.product.name}
                            </Link>
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">${item.product.price}</p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9 flex flex-col items-end">
                        <label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity, {item.product.name}</label>
                        <select
                          id={`quantity-${item.product.id}`}
                          name={`quantity-${item.product.id}`}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>

                        <div className="absolute top-0 right-0 sm:relative sm:top-auto sm:right-auto sm:mt-4">
                          <button 
                            type="button" 
                            className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${getCartTotal().toFixed(2)}</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <dt className="text-base font-medium text-gray-900">Order total</dt>
                <dd className="text-base font-medium text-gray-900">${(getCartTotal() + 5).toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <Button onClick={handleCheckout} isLoading={isProcessing} className="w-full" size="lg">
                Checkout securely
              </Button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

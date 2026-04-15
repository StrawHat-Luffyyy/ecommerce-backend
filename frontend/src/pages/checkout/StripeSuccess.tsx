import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const StripeSuccess = () => {
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We have received your order and will begin processing it shortly.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/dashboard")} variant="outline">View Order</Button>
          <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
};

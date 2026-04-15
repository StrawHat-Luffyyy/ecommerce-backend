import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export const StripeCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-8">
          Your payment was cancelled or failed. Your cart has been saved and you can try checking out again anytime.
        </p>
        <Button onClick={() => navigate("/cart")} className="w-full">
          Return to Cart
        </Button>
      </div>
    </div>
  );
};

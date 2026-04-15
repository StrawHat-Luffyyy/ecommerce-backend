import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        isLoading={isProcessing}
      >
        Pay Now
      </Button>
    </form>
  );
};

export const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.clientSecret) {
    return (
      <div className="min-h-screen pt-16 flex justify-center text-red-500">
        <div className="text-center">
          <p>Invalid Checkout Session.</p>
          <Button onClick={() => navigate("/cart")} className="mt-4">Back to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Complete Payment</h2>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: state.clientSecret,
            appearance: { theme: 'stripe' }
          }}
        >
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

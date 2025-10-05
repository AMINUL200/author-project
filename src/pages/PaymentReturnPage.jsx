import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}paypal/return?token=${token}&PayerID=${payerId}`
        );
        if (res.data.success) {
          // now capture order
          const captureRes = await axios.post(
            `${import.meta.env.VITE_API_URL}capture-order`,
            {
              paypal_order_id: res.data.paypal_order_id,
              order_id: res.data.order.id,
            }
          );
          if (captureRes.data.success) {
            toast.success("Payment successful! 🎉");
            // redirect user to article with full PDF access
            window.location.href = `/article/${res.data.order.article_id}`;
          }
        } else {
          toast.error("Payment failed. Try again.");
        }
      } catch (err) {
        console.error("Return error:", err);
        toast.error("Error processing payment");
      }
    };

    if (token && payerId) {
      verifyPayment();
    }
  }, [token, payerId]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Processing your payment...</p>
    </div>
  );
};

export default PaymentReturnPage;

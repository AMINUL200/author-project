import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const payerId = searchParams.get("paypal_order_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `https://animated-gelato-0927d1.netlify.app/paypal/return?success=true&paypal_order_id=${payerId}&order_id=${orderId}`
        );
        console.log("before check respons: ", res.data);
        if (res.data.success) {
          console.log("inner response:: ", res.data);
        }
        const order = {
          paypal_order_id: res.data.paypal_order_id,
          order_id: res.data.order.id,
          article_id: res.data.order.article_id,
          user_id: res.data.order.user_id,
        };

        console.log("order Details: ", order);

        if (res.data.success) {
          // now capture order
          const captureRes = await axios.post(
            `${import.meta.env.VITE_API_URL}paypal/capture-order`,
            {
              paypal_order_id: res.data.paypal_order_id,
              order_id: res.data.order.id,
              article_id: res.data.order.article_id,
              user_id: res.data.order.user_id,
            }
          );
          if (captureRes.data.success) {
            toast.success("Payment successful! 🎉");
            // redirect user to article with full PDF access
            window.location.href = `/articles/${res.data.order.article_id}`;
          }
        } else {
          toast.error("Payment failed. Try again.");
          console.log(res.data);
        }
      } catch (err) {
        console.error("Return error:", err);
        toast.error("Error processing payment");
      }
    };

    if (orderId && payerId) {
    verifyPayment();
    }
  }, [orderId, payerId]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Processing your payment...</p>
    </div>
  );
};

export default PaymentReturnPage;

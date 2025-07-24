import { getOrderById } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import OrderDetailsTable from "./order-details-table";
import { PaymentResult, ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  const session = await auth();

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });

    client_secret = paymentIntent.client_secret;
  }

  if (order.userId !== session?.user.id && session?.user.role !== "admin") {
    return redirect("/unauthorized");
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        user: {
          name: order.user!.name!,
          email: order.user!.email,
        },
        shippingAddress: order.shippingAddress as ShippingAddress,
        paymentResult: order.paymentResult as PaymentResult,
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
      isAdmin={session?.user?.role === "admin"}
    />
  );
};

export default OrderDetailsPage;

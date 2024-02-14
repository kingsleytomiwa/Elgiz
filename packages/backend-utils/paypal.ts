import { Period, calculateTotalPrice } from "utils/billing";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
}

export async function createOrder(value: number) {
  return sendPaypalRequest("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: value.toFixed(2),
          },
        },
      ],
    }),
  });
}

export async function captureOrder(orderId: string) {
  return sendPaypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
  });
}

export async function getOrder(orderId: string) {
  return sendPaypalRequest(`/v2/checkout/orders/${orderId}`);
}

export async function getSubscription(subscriptionId: string) {
  return sendPaypalRequest(`/v1/billing/subscriptions/${subscriptionId}`);
}

export async function getSubscriptionData(data: {
  name: string;
  period: Period;
  rooms: number;
  extras: string[];
}) {
  const accessToken = await generateAccessToken();
  const price = calculateTotalPrice(data.rooms, data.period, data.extras);

  const product: { id: string } = await sendPaypalRequest("/v1/catalogs/products", {
    accessToken,
    method: "POST",
    body: JSON.stringify({
      name: `Subscription for ${data.name}`,
      type: "DIGITAL",
      description: `${data.name} subscription for ${data.rooms} rooms and ${data.extras.length} modules`,
      category: "SOFTWARE",
    }),
  });

  const plan: { id: string } = await sendPaypalRequest("/v1/billing/plans", {
    accessToken,
    method: "POST",
    body: JSON.stringify({
      product_id: product.id,
      name: product.id,
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: data.period,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 12,
          pricing_scheme: {
            fixed_price: {
              value: price.subscription,
              currency_code: "EUR",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        ...(price.setup
          ? {
              setup_fee: {
                value: price.setup,
                currency_code: "EUR",
              },
            }
          : {}),
      },
    }),
  });

  const subscription: { id: string } = await sendPaypalRequest("/v1/billing/subscriptions", {
    accessToken,
    method: "POST",
    body: JSON.stringify({
      plan_id: plan.id,
    }),
  });

  return {
    id: subscription.id,
    price: price.total,
  };
}

export async function pauseSubscription(subscriptionId: string) {
  await sendPaypalRequest(`/v1/billing/subscriptions/${subscriptionId}/suspend`, {
    method: "POST",
  });
}

export async function resumeSubscription(subscriptionId: string) {
  await sendPaypalRequest(`/v1/billing/subscriptions/${subscriptionId}/activate`, {
    method: "POST",
    body: JSON.stringify({
      reason: "Reason unknown",
    }),
  });
}

export async function cancelSubscription(subscriptionId: string) {
  await sendPaypalRequest(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      reason: "Changed to bank transfer payment method",
    }),
  });
}

async function sendPaypalRequest(
  url: string,
  { accessToken, ...body }: RequestInit & { accessToken?: string } = {}
) {
  accessToken = accessToken || (await generateAccessToken());

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await fetch(`${PAYPAL_API}${url}`, {
    headers,
    ...body,
  });

  try {
    const data = await response.json();

    if (data?.name === "INVALID_REQUEST") {
      console.error(data);
      throw new Error(data?.message || "Invalid request");
    }

    return data;
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

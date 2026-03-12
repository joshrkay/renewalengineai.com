export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  // Stripe webhook scaffold. Verify signature with STRIPE_WEBHOOK_SECRET in next iteration.
  return res.status(200).json({ received: true })
}

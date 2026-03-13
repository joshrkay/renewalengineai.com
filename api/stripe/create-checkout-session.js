import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

const PLAN_TO_PRICE = {
  audit: process.env.STRIPE_PRICE_AUDIT,
  sprint: process.env.STRIPE_PRICE_SPRINT,
  managed: process.env.STRIPE_PRICE_MANAGED,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  try {
    const { plan } = req.body || {}
    const price = PLAN_TO_PRICE[plan]
    if (!price) return res.status(400).json({ error: 'invalid_or_unconfigured_plan' })

    const origin = req.headers.origin || 'https://renewalengineai.com'

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'managed' ? 'subscription' : 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/?checkout=success&plan=${plan}`,
      cancel_url: `${origin}/offers?checkout=cancel&plan=${plan}`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    return res.status(500).json({ error: 'checkout_session_failed' })
  }
}

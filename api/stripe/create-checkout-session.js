import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
})

const PLAN_CONFIG = {
  audit: { amount: 150000, mode: 'payment', name: 'AI-Powered Renewal Audit', interval: null },
  sprint: { amount: 600000, mode: 'payment', name: 'AI Automation Build & Launch', interval: null },
  managed: { amount: 250000, mode: 'subscription', name: 'Managed AI Operations', interval: 'month' },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })

  try {
    const { plan } = req.body || {}
    const cfg = PLAN_CONFIG[plan]
    if (!cfg) return res.status(400).json({ error: 'invalid_plan' })

    const origin = req.headers.origin || 'https://renewalengineai.com'

    const line_item = {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: cfg.amount,
        product_data: { name: cfg.name },
        ...(cfg.mode === 'subscription' ? { recurring: { interval: cfg.interval } } : {}),
      },
    }

    const session = await stripe.checkout.sessions.create({
      mode: cfg.mode,
      line_items: [line_item],
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

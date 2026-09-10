import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16'
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const jwt = authHeader.replace('Bearer ', '')
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser(jwt)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const body = await req.json()
    const { items = [], couponCode, shippingMethodId = 'standard' } = body

    let subtotal = 0
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, price, stock_count, in_stock')
        .eq('id', item.id)
        .single()
      if (!product || !product.in_stock || product.stock_count < item.quantity) {
        return new Response(JSON.stringify({ error: `Insufficient stock for product ${item.id}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      subtotal += Number(product.price) * item.quantity
    }

    let discount = 0
    let shipping = subtotal > 50 && shippingMethodId === 'standard' ? 0 : shippingMethodId === 'express' ? 19.99 : 9.99

    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('active', true)
        .maybeSingle()
      if (coupon) {
        if (coupon.type === 'percentage') discount = subtotal * Number(coupon.value)
        else if (coupon.type === 'fixed') discount = Number(coupon.value)
        else if (coupon.type === 'free_shipping') shipping = 0
      }
    }

    const tax = Math.max(0, subtotal - discount) * 0.08
    const total = Math.max(0, subtotal - discount) + tax + shipping
    const amount = Math.round(total * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        user_id: user.id,
        coupon: couponCode || '',
        shipping_method: shippingMethodId
      },
      automatic_payment_methods: { enabled: true }
    })

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

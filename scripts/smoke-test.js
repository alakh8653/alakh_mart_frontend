import fetch from 'node-fetch'

const API = process.env.API_URL || 'http://localhost:8000/api'

async function run() {
  try {
    console.log('1) Fetch categories')
    const cats = await (await fetch(`${API}/categories/`)).json()
    console.log('  categories:', cats.map((c) => c.name).join(', '))

    console.log('2) Fetch products (page 1)')
    const products = await (await fetch(`${API}/products/?page_size=5`)).json()
    console.log('  products count:', products.length || products.results?.length)

    console.log('3) Register a test user')
    const email = `smoketest+${Date.now()}@example.com`
    const password = 'TestPass123!'
    const regResp = await (await fetch(`${API}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username: email.split('@')[0] })
    })).json()
    if (regResp.detail || regResp.errors) {
      console.error('  register failed', regResp)
    } else {
      console.log('  registered user id', regResp.user?.id)
    }

    console.log('4) Login the test user')
    const loginResp = await (await fetch(`${API}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    })).json()
    if (!loginResp.access) {
      console.error('  login failed', loginResp)
      process.exit(2)
    }
    const access = loginResp.access
    console.log('  got access token')

    console.log('5) Create an order with first product')
    const product = (Array.isArray(products) ? products[0] : (products.results || products)[0])
    if (!product) {
      console.error('  no product to order')
      process.exit(3)
    }
    const orderPayload = {
      total_price: product.price,
      items: [{ product_id: product.id, quantity: 1 }],
      shipping_name: 'Smoke Tester',
      shipping_address: '1 Test St',
      shipping_city: 'Testville',
      shipping_state: 'TS',
      shipping_zip: '00000',
      shipping_country: 'Testland'
    }
    const orderResp = await (await fetch(`${API}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access}` },
      body: JSON.stringify(orderPayload)
    })).json()
    if (orderResp.detail) {
      console.error('  create order failed', orderResp)
      process.exit(4)
    }
    console.log('  order created id:', orderResp.id)

    console.log('Smoke test completed successfully')
    process.exit(0)
  } catch (e) {
    console.error('Smoke test error', e)
    process.exit(1)
  }
}

run()

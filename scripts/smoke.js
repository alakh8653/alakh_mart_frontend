const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args))
const API = process.env.API_URL || 'http://localhost:8000/api'
const rnd = (n=6)=> Math.random().toString(36).slice(2,2+n)

async function run() {
  console.log('Running API smoke test against', API)

  // 1. categories
  const cats = await (await fetch(`${API}/categories/`)).json()
  console.log('Categories:', cats.map(c=>c.name))

  // 2. products
  const products = await (await fetch(`${API}/products/?page_size=5`)).json()
  console.log('Got products count (slice):', products.length)
  if (!products || products.length === 0) {
    console.error('No products returned — failing smoke test')
    process.exit(2)
  }

  // 3. register
  const email = `smoke+${rnd()}@example.test`
  const username = `smoke_${rnd(4)}`
  const password = `Password1!`
  const regRes = await (await fetch(`${API}/auth/register/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, username, password }),
  })).json()
  console.log('Register response keys:', Object.keys(regRes))

  // 4. login
  const loginRes = await (await fetch(`${API}/auth/login/`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username, password }),
  })).json()
  console.log('Login response keys:', Object.keys(loginRes))
  if (!loginRes.access) {
    console.error('No access token returned — failing')
    process.exit(3)
  }
  const token = loginRes.access

  // 5. current user
  const me = await (await fetch(`${API}/auth/user/`, { headers: { Authorization: `Bearer ${token}` } })).json()
  console.log('Current user id:', me.id)

  // 6. create order using a product id
  const prod = products[0]
  const orderPayload = {
    items: [{ product_id: prod.id, quantity: 1 }],
    shipping_name: 'Smoke Tester',
    shipping_address: '123 Test St',
    shipping_city: 'Testville',
    shipping_state: 'TS',
    shipping_zip: '00000',
    shipping_country: 'Testland',
  }
  const createOrder = await (await fetch(`${API}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderPayload),
  })).json()
  console.log('Created order id:', createOrder.id)

  console.log('Smoke test completed successfully')
}

run().catch((err)=>{ console.error('Smoke test failed:', err); process.exit(1) })

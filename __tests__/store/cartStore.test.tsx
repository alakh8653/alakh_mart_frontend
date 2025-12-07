import { useCartStore } from '@/store/cartStore'

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] as any })
  })

  it('adds and updates items', () => {
    const initial = useCartStore.getState()
    initial.addItem('p1', 2)
    const afterAdd = useCartStore.getState()
    expect(afterAdd.items.length).toBe(1)
    expect(afterAdd.items[0].quantity).toBe(2)
    afterAdd.updateItem('p1', 3)
    const afterUpdate = useCartStore.getState()
    expect(afterUpdate.items[0].quantity).toBe(3)
    afterUpdate.removeItem('p1')
    expect(useCartStore.getState().items.length).toBe(0)
  })
})

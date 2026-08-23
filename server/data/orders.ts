import { Order } from '../../src/types';

let inMemoryOrders: Order[] = [];

export function getStoredOrders(): Order[] {
  return inMemoryOrders;
}

export function getOrderById(id: string): Order | undefined {
  return inMemoryOrders.find(o => o.id === id);
}

export function addOrder(orderData: Omit<Order, 'id'> & { id?: string }): Order {
  const newOrder: Order = {
    ...orderData,
    id: orderData.id || `NXT-${Date.now().toString().slice(-6)}`
  };
  inMemoryOrders = [newOrder, ...inMemoryOrders];
  return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const index = inMemoryOrders.findIndex(o => o.id === id);
  if (index === -1) return null;
  inMemoryOrders[index] = { ...inMemoryOrders[index], status };
  return inMemoryOrders[index];
}

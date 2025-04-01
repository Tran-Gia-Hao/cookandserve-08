import { MenuItem, Order, OrderItem, Staff, DailySummary, ItemStatus, OrderStatus } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: uuidv4(),
    name: 'Beef Steak',
    description: 'Tender beef steak grilled to perfection',
    price: 25.99,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing and croutons',
    price: 12.99,
    category: 'Starter',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and parmesan cheese',
    price: 18.99,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Mushroom Risotto',
    description: 'Creamy risotto with wild mushrooms',
    price: 16.99,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1534766438357-2b9ef4077e3d?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 8.99,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea2456d?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter',
    price: 5.99,
    category: 'Side',
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Fish & Chips',
    description: 'Crispy fried fish with french fries',
    price: 19.99,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1576777489921-c93ea5080243?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with chocolate ganache',
    price: 7.99,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3',
    available: true
  },
];

// Staff
export const staff: Staff[] = [
  { id: uuidv4(), name: 'John Doe', role: 'waiter' },
  { id: uuidv4(), name: 'Jane Smith', role: 'kitchen' },
  { id: uuidv4(), name: 'Michael Johnson', role: 'manager' },
];

// Generate mock orders
export const generateMockOrders = (count: number = 5): Order[] => {
  const orders: Order[] = [];
  
  for (let i = 0; i < count; i++) {
    const orderItems: OrderItem[] = [];
    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
    
    let totalPrice = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      const statusOptions: ItemStatus[] = ['pending', 'cooking', 'ready', 'served'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      totalPrice += menuItem.price * quantity;
      
      orderItems.push({
        id: uuidv4(),
        menuItemId: menuItem.id,
        menuItem: menuItem,
        quantity: quantity,
        status: status,
        createdAt: new Date(Date.now() - Math.random() * 10000000),
        updatedAt: new Date()
      });
    }
    
    const statusOptions: OrderStatus[] = ['pending', 'cooking', 'ready', 'served', 'paid'];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    orders.push({
      id: uuidv4(),
      tableNumber: Math.floor(Math.random() * 20) + 1, // Tables 1-20
      items: orderItems,
      status: status,
      totalPrice: Math.round(totalPrice * 100) / 100,
      createdAt: new Date(Date.now() - Math.random() * 10000000),
      updatedAt: new Date()
    });
  }
  
  return orders;
};

export const mockOrders = generateMockOrders(10);

// Mock daily summary
export const mockDailySummary: DailySummary = {
  date: new Date().toISOString().slice(0, 10),
  totalOrders: 42,
  totalRevenue: 1285.75,
  averageOrderValue: 30.61,
  popularItems: [
    { itemId: menuItems[0].id, name: menuItems[0].name, count: 18 },
    { itemId: menuItems[2].id, name: menuItems[2].name, count: 15 },
    { itemId: menuItems[4].id, name: menuItems[4].name, count: 12 },
  ]
};

// Mock weekly data for charts
export const mockWeeklyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  revenue: [980, 1200, 860, 1100, 1500, 1800, 1400],
  orders: [32, 38, 30, 35, 46, 52, 42]
};

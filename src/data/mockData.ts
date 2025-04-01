
import { MenuItem, Order, OrderItem, Staff, DailySummary, ItemStatus, OrderStatus } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: uuidv4(),
    name: 'Mongolian Beef',
    description: 'Tender slices of beef stir-fried with scallions in a savory sauce',
    price: 18.95,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1512838243191-e81e8f66f1fd?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Spring Rolls (4)',
    description: 'Crispy vegetable spring rolls served with sweet chili sauce',
    price: 7.95,
    category: 'Starter',
    image: 'https://images.unsplash.com/photo-1559018750-d3643b5a73f0?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'General Tso\'s Chicken',
    description: 'Crispy chicken pieces tossed in a sweet and spicy sauce',
    price: 16.95,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Vegetable Lo Mein',
    description: 'Stir-fried noodles with mixed vegetables in a savory sauce',
    price: 14.95,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1619380061814-58f03707f082?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Mango Pudding',
    description: 'Creamy mango-flavored pudding with fresh fruit',
    price: 6.95,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Crab Rangoon (6)',
    description: 'Crispy wontons filled with cream cheese and crab meat',
    price: 8.95,
    category: 'Side',
    image: 'https://images.unsplash.com/photo-1548811256-1623d885b0f7?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Kung Pao Shrimp',
    description: 'Stir-fried shrimp with peanuts, vegetables, and chili peppers',
    price: 19.95,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Fried Ice Cream',
    description: 'Vanilla ice cream wrapped in crispy coating, served with honey',
    price: 7.95,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1528252094031-4d3392f4e2d7?ixlib=rb-4.0.3',
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

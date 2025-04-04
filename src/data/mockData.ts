
import { MenuItem, Order, OrderItem, Staff, DailySummary, ItemStatus, OrderStatus } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Menu Items
export const menuItems: MenuItem[] = [
  {
    id: uuidv4(),
    name: 'Phở Bò Tái',
    description: 'Phở với thịt bò tái mỏng, hành và các loại gia vị tươi',
    price: 95000,
    category: 'Món Chính',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Chả Giò (4 cuốn)',
    description: 'Chả giò giòn rụm với nhân thịt và rau củ, ăn kèm với nước mắm chua ngọt',
    price: 65000,
    category: 'Khai Vị',
    image: 'https://images.unsplash.com/photo-1559018750-d3643b5a73f0?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Cơm Tấm Sườn',
    description: 'Cơm tấm với sườn nướng, trứng ốp la và đồ chua',
    price: 85000,
    category: 'Món Chính',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Bún Chả',
    description: 'Bún với thịt viên và thịt heo nướng, nước chấm chua ngọt và rau sống',
    price: 78000,
    category: 'Món Chính',
    image: 'https://images.unsplash.com/photo-1627476226547-9e36d61fa8ac?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Chè Ba Màu',
    description: 'Chè ngọt với đậu đỏ, đậu xanh và thạch đen, nước cốt dừa',
    price: 45000,
    category: 'Tráng Miệng',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Gỏi Cuốn (6 cuốn)',
    description: 'Gỏi cuốn tươi với tôm, thịt heo, bún, rau sống và nước mắm',
    price: 70000,
    category: 'Khai Vị',
    image: 'https://images.unsplash.com/photo-1548809542-17526d30f341?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Cá Kho Tộ',
    description: 'Cá kho trong tộ đất với nước mắm, đường thốt nốt và tiêu',
    price: 120000,
    category: 'Món Chính',
    image: 'https://images.unsplash.com/photo-1518980200453-9dde53dc3363?ixlib=rb-4.0.3',
    available: true
  },
  {
    id: uuidv4(),
    name: 'Bánh Flan',
    description: 'Bánh flan mềm mịn với nước caramel thơm ngậy',
    price: 35000,
    category: 'Tráng Miệng',
    image: 'https://images.unsplash.com/photo-1528252094031-4d3392f4e2d7?ixlib=rb-4.0.3',
    available: true
  },
];

// Staff
export const staff: Staff[] = [
  { id: uuidv4(), name: 'Nguyễn Văn A', role: 'waiter' },
  { id: uuidv4(), name: 'Trần Thị B', role: 'kitchen' },
  { id: uuidv4(), name: 'Phạm Văn C', role: 'manager' },
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
  totalRevenue: 3750000,
  averageOrderValue: 89200,
  popularItems: [
    { itemId: menuItems[0].id, name: menuItems[0].name, count: 18 },
    { itemId: menuItems[2].id, name: menuItems[2].name, count: 15 },
    { itemId: menuItems[4].id, name: menuItems[4].name, count: 12 },
  ]
};

// Mock weekly data for charts
export const mockWeeklyData = {
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  revenue: [2500000, 3200000, 2700000, 3000000, 3800000, 4200000, 3600000],
  orders: [32, 38, 30, 35, 46, 52, 42]
};

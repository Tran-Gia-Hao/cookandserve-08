
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { HomeIcon, MenuIcon, History, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import MenuItemCard from '@/components/MenuItemCard';
import OrderCart from '@/components/OrderCart';
import OrderDetail from '@/components/OrderDetail';
import { menuItems } from '@/data/mockData';
import { MenuItem, Order, OrderItem } from '@/models/types';
import { v4 as uuidv4 } from 'uuid';

const CustomerPage = () => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [tableNumber, setTableNumber] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [menuType, setMenuType] = useState<'a-la-carte' | 'buffet'>('a-la-carte');
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const addToOrder = (item: MenuItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem => 
        cartItem.menuItemId === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      const newItem: OrderItem = {
        id: uuidv4(),
        menuItemId: item.id,
        menuItem: item,
        quantity: 1,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCartItems([...cartItems, newItem]);
    }
    
    const message = menuType === 'buffet' 
      ? `${item.name} đã được chọn.`
      : `${item.name} đã thêm vào giỏ hàng.`;
      
    toast({
      title: menuType === 'buffet' ? "Đã chọn món" : "Đã thêm vào giỏ hàng",
      description: message,
      duration: 2000
    });
  };

  const removeFromOrder = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const addNote = (itemId: string, note: string) => {
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, notes: note } : item
    ));
  };

  const submitOrder = () => {
    if (cartItems.length === 0) return;
    
    const totalPrice = menuType === 'buffet' 
      ? 299000 * tableNumber // Example buffet price per person
      : cartItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: uuidv4(),
      tableNumber,
      items: cartItems,
      status: 'pending',
      totalPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setOrderHistory([newOrder, ...orderHistory]);
    setCartItems([]);
    
    toast({
      title: "Đã đặt món!",
      description: `Đơn hàng #${newOrder.id.slice(0, 8)} đã được đặt thành công.`,
      variant: "default"
    });
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-restaurant-light">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-restaurant-secondary">Cook & Serve</h1>
            <div className="w-9"></div> {/* Placeholder for balance */}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="menu" className="flex items-center">
              <MenuIcon className="mr-2 h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <History className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="menu">
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="text-lg font-medium mb-2">Lựa chọn kiểu gọi món:</div>
                <RadioGroup 
                  defaultValue="a-la-carte" 
                  value={menuType}
                  onValueChange={(value) => setMenuType(value as 'a-la-carte' | 'buffet')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="a-la-carte" id="a-la-carte" />
                    <label htmlFor="a-la-carte" className="cursor-pointer">
                      Gọi món (À la carte)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buffet" id="buffet" />
                    <label htmlFor="buffet" className="cursor-pointer">
                      Buffet Manwah (299.000₫/người)
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            <ScrollArea className="h-12 whitespace-nowrap pb-2 mb-6">
              <div className="flex space-x-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => setActiveCategory(category)}
                    className={activeCategory === category ? "button-primary" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
              {menuItems
                .filter(item => activeCategory === 'All' || item.category === activeCategory)
                .map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToOrder={addToOrder}
                    menuType={menuType}
                  />
                ))
              }
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            {orderHistory.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="mb-4 text-gray-500">You haven't placed any orders yet.</p>
                  <Button
                    onClick={() => document.querySelector('[data-value="menu"]')?.dispatchEvent(new Event('click'))}
                    className="button-primary"
                  >
                    Browse Menu
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 pb-20">
                {orderHistory.map(order => (
                  <Card key={order.id} className="animate-fade-in">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-gray-500 text-sm">Order #{order.id.slice(0, 8)}</span>
                          <div className="font-semibold">Table {order.tableNumber}</div>
                        </div>
                        <Badge className={`badge-${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="space-y-1 mb-2">
                        <div className="text-sm font-medium">Order Summary</div>
                        <ul className="text-sm">
                          {order.items.slice(0, 3).map((item, index) => (
                            <li key={index}>{item.quantity}x {item.menuItem.name}</li>
                          ))}
                          {order.items.length > 3 && (
                            <li className="text-gray-500">+{order.items.length - 3} more items</li>
                          )}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="font-semibold">Total</div>
                        <div className="font-semibold">${order.totalPrice.toFixed(2)}</div>
                      </div>
                      
                      <Button
                        className="w-full mt-3 button-primary"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <OrderCart
        items={cartItems}
        onRemoveItem={removeFromOrder}
        onUpdateQuantity={updateQuantity}
        onAddNote={addNote}
        onSubmitOrder={submitOrder}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
      />
      
      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={closeOrderDetails}
        userRole="customer"
      />
    </div>
  );
};

export default CustomerPage;

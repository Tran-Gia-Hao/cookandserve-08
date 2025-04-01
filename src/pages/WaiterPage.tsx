import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { HomeIcon, TableIcon, ClipboardList, Plus, ArrowLeft } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import OrderCard from '@/components/OrderCard';
import OrderDetail from '@/components/OrderDetail';
import { mockOrders, generateMockOrders } from '@/data/mockData';
import { Order, OrderStatus, ItemStatus } from '@/models/types';

const WaiterPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredOrders = orders
    .filter(order => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.id.toLowerCase().includes(searchLower) || 
        order.tableNumber.toString().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Table filter
      const matchesTable = tableFilter === null || order.tableNumber === tableFilter;

      return matchesSearch && matchesStatus && matchesTable;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const activeOrders = filteredOrders.filter(order => 
    order.status !== 'paid'
  );
  
  const completedOrders = filteredOrders.filter(order => 
    order.status === 'paid'
  );

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateItemStatus = (orderId: string, itemId: string, newStatus: ItemStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => 
          item.id === itemId ? { ...item, status: newStatus, updatedAt: new Date() } : item
        );
        
        return {
          ...order,
          items: updatedItems,
          updatedAt: new Date()
        };
      }
      return order;
    }));
    
    toast({
      title: "Item Updated",
      description: `Item status changed to ${newStatus}`,
      duration: 2000
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() } 
        : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order status changed to ${newStatus}`,
      duration: 2000
    });

    // Close the detail modal if the order is now paid
    if (newStatus === 'paid') {
      setIsDetailOpen(false);
    }
  };

  const handleCreateNewOrder = () => {
    const newOrder = generateMockOrders(1)[0];
    setOrders([newOrder, ...orders]);
    
    toast({
      title: "New Order Created",
      description: `Table ${newOrder.tableNumber} has placed a new order`,
      duration: 2000
    });
  };

  // Adapter function to make handleUpdateOrderStatus compatible with OrderCard
  const handleOrderCardStatusChange = (order: Order, newStatus: OrderStatus) => {
    handleUpdateOrderStatus(order.id, newStatus);
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
            <h1 className="text-xl font-bold text-restaurant-secondary">Waiter Dashboard</h1>
            <Button 
              size="sm" 
              className="button-primary"
              onClick={handleCreateNewOrder}
            >
              <Plus className="h-4 w-4 mr-1" /> New Order
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <FilterBar
          onSearch={setSearchTerm}
          onStatusFilter={setStatusFilter}
          onTableFilter={setTableFilter}
          searchTerm={searchTerm}
          selectedStatus={statusFilter}
          selectedTable={tableFilter}
        />
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              Active Orders
              {activeOrders.length > 0 && (
                <Badge className="ml-2 bg-restaurant-primary">{activeOrders.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <TableIcon className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No active orders at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onStatusChange={handleOrderCardStatusChange}
                    showActions={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No completed orders to show.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    showActions={false}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdateItemStatus={handleUpdateItemStatus}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        userRole="waiter"
      />
    </div>
  );
};

export default WaiterPage;

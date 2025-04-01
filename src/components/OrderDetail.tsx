
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order, OrderItem, OrderStatus, ItemStatus } from '@/models/types';
import { ArrowLeft, Clock, PlusCircle, Receipt } from 'lucide-react';

interface OrderDetailProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateItemStatus?: (orderId: string, itemId: string, newStatus: ItemStatus) => void;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  userRole: 'customer' | 'waiter' | 'kitchen' | 'manager';
}

const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateItemStatus,
  onUpdateOrderStatus,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'billing'>('items');

  if (!order) return null;

  const getItemStatusColor = (status: ItemStatus) => {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'cooking': return 'bg-orange-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getNextItemStatus = (currentStatus: ItemStatus): ItemStatus | null => {
    if (userRole === 'kitchen') {
      switch(currentStatus) {
        case 'pending': return 'cooking';
        case 'cooking': return 'ready';
        default: return null;
      }
    } else if (userRole === 'waiter') {
      switch(currentStatus) {
        case 'ready': return 'served';
        default: return null;
      }
    }
    return null;
  };

  const canModifyOrder = userRole === 'waiter' || userRole === 'kitchen' || userRole === 'manager';

  const statusActions = {
    'pending': {
      next: 'cooking',
      actionLabel: 'Start Cooking',
      role: 'kitchen'
    },
    'cooking': {
      next: 'ready',
      actionLabel: 'Mark Ready',
      role: 'kitchen'
    },
    'ready': {
      next: 'served',
      actionLabel: 'Mark Served',
      role: 'waiter'
    },
    'served': {
      next: 'paid',
      actionLabel: 'Mark Paid',
      role: 'waiter'
    }
  };

  const currentAction = statusActions[order.status as keyof typeof statusActions];
  const canModifyOrderStatus = currentAction && (userRole === currentAction.role || userRole === 'manager');

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - Table {order.tableNumber}</span>
            <Badge className={`badge-${order.status}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            {new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'items' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('items')}
            className={activeTab === 'items' ? 'button-primary' : ''}
          >
            Items
          </Button>
          <Button 
            variant={activeTab === 'billing' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('billing')}
            className={activeTab === 'billing' ? 'button-primary' : ''}
          >
            <Receipt className="mr-1 h-4 w-4" />
            Bill
          </Button>
        </div>

        {activeTab === 'items' && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{item.menuItem.name}</div>
                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                    {item.notes && (
                      <div className="text-sm italic mt-1">Note: {item.notes}</div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getItemStatusColor(item.status)}`}>
                      {item.status}
                    </Badge>
                    <div className="font-semibold">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {canModifyOrder && onUpdateItemStatus && getNextItemStatus(item.status) && (
                  <div className="mt-2">
                    <Button 
                      size="sm" 
                      className="w-full button-primary"
                      onClick={() => onUpdateItemStatus(order.id, item.id, getNextItemStatus(item.status)!)}
                    >
                      Mark as {getNextItemStatus(item.status)}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.menuItem.name}</span>
                    <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {userRole === 'waiter' && order.status === 'served' && (
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  Print Receipt
                </Button>
                <Button className="flex-1 button-primary">
                  Process Payment
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          
          {canModifyOrderStatus && onUpdateOrderStatus && (
            <Button 
              className="button-primary"
              onClick={() => onUpdateOrderStatus(order.id, currentAction.next as OrderStatus)}
            >
              {currentAction.actionLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetail;

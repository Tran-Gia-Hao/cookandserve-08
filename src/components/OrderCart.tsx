
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderItem } from '@/models/types';
import { ShoppingCart, Trash2, Send } from 'lucide-react';

interface OrderCartProps {
  items: OrderItem[];
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onAddNote: (itemId: string, note: string) => void;
  onSubmitOrder: () => void;
  tableNumber: number;
  onTableNumberChange: (tableNumber: number) => void;
}

const OrderCart: React.FC<OrderCartProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onAddNote,
  onSubmitOrder,
  tableNumber,
  onTableNumberChange
}) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg button-primary">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-restaurant-secondary">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-[90vw]">
        <SheetHeader>
          <SheetTitle>Your Order</SheetTitle>
          <SheetDescription>
            Review your items before placing the order
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-4 mb-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(parseInt(e.target.value) || 1)}
            min={1}
            className="mt-1"
          />
        </div>
        
        <Separator className="my-4" />
        
        {items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Your cart is empty. Add some items to get started.
          </div>
        ) : (
          <>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{item.menuItem.name}</div>
                        <div className="text-sm text-gray-500">
                          ${item.menuItem.price.toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto h-7 w-7 text-red-500"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <Input
                        placeholder="Add special instructions..."
                        value={item.notes || ''}
                        onChange={(e) => onAddNote(item.id, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="my-4" />
            
            <div>
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full mt-4 button-primary py-6"
                onClick={onSubmitOrder}
                disabled={items.length === 0 || tableNumber <= 0}
              >
                <Send className="mr-2 h-4 w-4" />
                Place Order
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrderCart;


import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MinusCircle } from 'lucide-react';
import { MenuItem } from '@/models/types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToOrder: (item: MenuItem) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  inOrder?: boolean;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToOrder, 
  quantity = 0, 
  onIncrease, 
  onDecrease,
  inOrder = false 
}) => {
  return (
    <Card className="menu-item overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
      {item.image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
          <Badge variant="secondary" className="absolute top-3 right-3 bg-amber-500 text-white font-bold px-3 py-1 rounded-full">
            ${item.price.toFixed(2)}
          </Badge>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-amber-800">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-0 flex-grow">
        {!item.available && (
          <Badge variant="destructive" className="mt-2">
            Not Available
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {inOrder ? (
          <div className="flex items-center justify-between w-full">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onDecrease}
              disabled={!item.available || quantity <= 0}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="mx-2 font-medium">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onIncrease}
              disabled={!item.available}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => onAddToOrder(item)} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
            disabled={!item.available}
          >
            Add to Order
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;

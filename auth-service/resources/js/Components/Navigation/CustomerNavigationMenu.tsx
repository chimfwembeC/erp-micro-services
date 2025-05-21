import React from 'react';
import { Link } from '@inertiajs/react';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { ShoppingCart, FileText, TicketCheck } from 'lucide-react';
import { NavigationItem } from '@/types';

interface CustomerNavigationMenuProps {
  t: (key: string) => string;
  hasPermission: (permission: string) => boolean;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function CustomerNavigationMenu({
  t,
  hasPermission,
}: CustomerNavigationMenuProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{t('common.customer')}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
          {hasPermission('view_orders') && (
            <ListItem
              href="/customer/orders"
              title={t('customer.orders')}
            >
              <div className="flex items-center gap-1 mt-1">
                <ShoppingCart className="h-4 w-4" />
                <span>{t('customer.viewOrders')}</span>
              </div>
            </ListItem>
          )}
          
          {hasPermission('view_invoices') && (
            <ListItem
              href="/customer/invoices"
              title={t('customer.invoices')}
            >
              <div className="flex items-center gap-1 mt-1">
                <FileText className="h-4 w-4" />
                <span>{t('customer.viewInvoices')}</span>
              </div>
            </ListItem>
          )}
          
          {hasPermission('view_support_tickets') && (
            <ListItem
              href="/customer/support"
              title={t('customer.support')}
            >
              <div className="flex items-center gap-1 mt-1">
                <TicketCheck className="h-4 w-4" />
                <span>{t('customer.viewTickets')}</span>
              </div>
            </ListItem>
          )}
          
          {hasPermission('submit_support_tickets') && (
            <ListItem
              href="/customer/support/new"
              title={t('customer.newTicket')}
            >
              <div className="flex items-center gap-1 mt-1">
                <TicketCheck className="h-4 w-4" />
                <span>{t('customer.createTicket')}</span>
              </div>
            </ListItem>
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

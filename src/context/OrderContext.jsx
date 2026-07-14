import { createContext, useContext, useState } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [lastOrder, setLastOrder] = useState(null);

  return (
    <OrderContext.Provider value={{ lastOrder, setLastOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within OrderProvider');
  return ctx;
}

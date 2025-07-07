"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ShopeePickupChecker from './meganPage';

export default function MyApp() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
        <ShopeePickupChecker/>
    </QueryClientProvider>
  );
}

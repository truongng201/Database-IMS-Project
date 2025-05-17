'use client';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

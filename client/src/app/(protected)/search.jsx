'use client';

import { useTransition, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/icons';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState('');

  // Update search value when URL changes
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    setSearchValue(currentSearch);
  }, [searchParams]);

  function searchAction(formData) {
    const query = formData.get('q')?.toString().trim();
    
    startTransition(() => {
      // Create search params
      const newSearchParams = new URLSearchParams();
      if (query) {
        newSearchParams.set('search', query);
      }
      
      // Navigate to current page with search parameters
      const url = query ? `${pathname}?${newSearchParams.toString()}` : pathname;
      router.push(url);
    });
  }

  function clearSearch() {
    startTransition(() => {
      setSearchValue('');
      router.push(pathname);
    });
  }

  function handleInputChange(e) {
    setSearchValue(e.target.value);
  }

  return (
    <form action={searchAction} className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="Search anything..."
        value={searchValue}
        onChange={handleInputChange}
        className="w-full rounded-lg bg-background pl-8 pr-8 md:w-[200px] lg:w-[336px]"
      />
      {searchValue && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-[.25rem] h-7 w-7 p-0 hover:bg-muted"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      {isPending && <Spinner className="absolute right-2.5 top-[.75rem]" />}
    </form>
  );
}

"use client";

import Link from "next/link";
import {
  Home,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Contact,
  Users,
  Cable,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/icons";
import Providers from "./providers";
import { NavItem } from "./nav-item";
import { SearchInput } from "./search";
import { User } from "./user";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <DashboardBreadcrumb />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <span className="sr-only">Acme Inc</span>
          <Logo />
        </Link>

        <NavItem href="/" label="Dashboard">
          <Home className="h-5 w-5" />
        </NavItem>
        <NavItem href="/orders" label="Orders">
          <ShoppingCart className="h-5 w-5" />
        </NavItem>
        <NavItem href="/products" label="Products">
          <Package className="h-5 w-5" />
        </NavItem>
        <NavItem href="/supplier" label="Suppliers">
          <Cable className="h-5 w-5" />
        </NavItem>
        <NavItem href="/customers" label="Customers">
          <Contact className="h-5 w-5" />
        </NavItem>

        {user?.role_name === "admin" && (
          <NavItem href="/users" label="Users">
            <Users className="h-5 w-5" />
          </NavItem>
        )}
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error("Error parsing user:", err);
    }
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          </Link>

          <Link href="/" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link href="/orders" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link href="/products" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
            <Package className="h-5 w-5" />
            Products
          </Link>
          <Link href="/supplier" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
            <Cable className="h-5 w-5" />
            Suppliers
          </Link>
          <Link href="/customers" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
            <Contact className="h-5 w-5" />
            Customers
          </Link>

          {user?.role_name === "admin" && (
            <Link href="/users" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
              <Users className="h-5 w-5" />
              Users
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  const path = usePathname();

  if (path === "/") {
    return (
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const pathname = path.charAt(1).toUpperCase() + path.slice(2);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={path}>{pathname}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

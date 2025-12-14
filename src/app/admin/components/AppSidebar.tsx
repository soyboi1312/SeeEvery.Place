'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart3,
  Lightbulb,
  CheckCircle,
  Settings,
  Mail,
  ArrowLeft,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';

import { useDarkMode } from '@/lib/hooks/useDarkMode';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: Home,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Suggestions',
    url: '/admin/suggestions',
    icon: Lightbulb,
  },
  {
    title: 'Data Health',
    url: '/admin/data-health',
    icon: CheckCircle,
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Admin Roles',
    url: '/admin/roles',
    icon: ShieldCheck,
  },
  {
    title: 'Newsletter',
    url: '/admin/newsletter',
    icon: Mail,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const isActive = (url: string) => {
    if (url === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
          <div className="relative w-8 h-8">
            <Image
              src="/logo.svg"
              alt="See Every Place Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none">
              SeeEvery<span className="text-accent-500">.</span>Place
            </span>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to Site">
              <Link href="/">
                <ArrowLeft className="size-4" />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleDarkMode} tooltip={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

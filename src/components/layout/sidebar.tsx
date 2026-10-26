'use client';

import React, { useState, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Code2,
  Trophy,
  MessageSquare,
  GitFork,
  FolderKanban,
  GraduationCap,
  BarChart3,
  Bell,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

const navItems = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Problems', href: '/problems', icon: Code2 },
  { label: 'Contests', href: '/contests', icon: Trophy },
  { label: 'Discussions', href: '/discussions', icon: MessageSquare },
  { label: 'Open Source', href: '/opensource', icon: GitFork },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Placements', href: '/placements', icon: GraduationCap },
  { label: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
];

const bottomItems = [
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProviderProps {
  children: React.ReactNode;
  user?: {
    display_name: string;
    username: string;
    avatar_url: string | null;
    email: string;
  } | null;
  onSignOut?: () => void;
}

export function SidebarProvider({ children, user, onSignOut }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div className="flex h-screen overflow-hidden bg-neutral-50">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-50',
            'flex flex-col bg-white border-r border-neutral-200',
            'transition-all duration-300 ease-in-out',
            collapsed ? 'w-[68px]' : 'w-[260px]',
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          )}
        >
          {/* Logo */}
          <div className={cn(
            'flex items-center h-14 border-b border-neutral-100 shrink-0',
            collapsed ? 'justify-center px-2' : 'px-4'
          )}>
            <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 shrink-0">
                <img
                  src="/logo.png"
                  alt="MergeGrid"
                  className="w-8 h-8 object-contain"
                />
              </div>
              {!collapsed && (
                <span className="text-base font-bold text-neutral-900 tracking-tight">
                  Merge<span className="text-brand-600">Grid</span>
                </span>
              )}
            </Link>

            {/* Mobile close */}
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto lg:hidden text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-3 px-2.5">
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </nav>

          {/* Bottom Nav */}
          <div className="border-t border-neutral-100 py-3 px-2.5">
            <div className="space-y-0.5">
              {bottomItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </div>
          </div>

          {/* User section */}
          {user && (
            <div className={cn(
              'border-t border-neutral-100 p-2.5',
              collapsed ? 'flex justify-center' : ''
            )}>
              {collapsed ? (
                <Avatar name={user.display_name} src={user.avatar_url} size="sm" />
              ) : (
                <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                  <Avatar name={user.display_name} src={user.avatar_url} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {user.display_name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      @{user.username}
                    </p>
                  </div>
                  {onSignOut && (
                    <button
                      onClick={onSignOut}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                      title="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Collapse toggle (desktop only) */}
          <div className="hidden lg:flex border-t border-neutral-100 p-2.5">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                'flex items-center justify-center w-full h-8 rounded-lg',
                'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
                'transition-colors cursor-pointer'
              )}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 rounded-lg transition-all duration-150',
        collapsed ? 'justify-center w-10 h-10 mx-auto' : 'px-3 h-9',
        isActive
          ? 'bg-brand-50 text-brand-700 font-medium'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className={cn('w-[18px] h-[18px] shrink-0', isActive && 'text-brand-600')} />
      {!collapsed && <span className="text-sm truncate">{label}</span>}
    </Link>
  );
}

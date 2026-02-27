"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  AlertTriangle,
  BookOpen,
  Users,
  Menu,
  LogOut,
  Shield,
  ScrollText,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Requests", href: "/requests", icon: GitBranch },
  { name: "Red Tags", href: "/red-tags", icon: AlertTriangle },
  { name: "Decisions", href: "/decisions", icon: BookOpen },
  { name: "Accountability", href: "/accountability", icon: Shield },
  { name: "Team", href: "/team", icon: Users },
  { name: "Audit Log", href: "/audit", icon: ScrollText },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter() {
  const { data: session } = useSession();

  const name = session?.user?.name ?? "User";
  const role = (session?.user as any)?.role ?? "MEMBER";
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="border-t p-3">
      <div className="flex items-center justify-between rounded-lg px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium leading-none">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sign out</span>
        </Button>
      </div>
    </div>
  );
}

function BrandHeader() {
  return (
    <div className="flex h-14 items-center border-b px-4">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          L
        </div>
        <span>Labyrinth OS</span>
      </Link>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-background md:flex md:flex-col">
      <BrandHeader />
      <NavLinks />
      <UserFooter />
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
          <BrandHeader />
          <NavLinks onNavigate={() => setOpen(false)} />
          <UserFooter />
        </SheetContent>
      </Sheet>
      <Separator orientation="vertical" className="h-6" />
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
          L
        </div>
        <span className="text-sm">Labyrinth OS</span>
      </Link>
    </header>
  );
}

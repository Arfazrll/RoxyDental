import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  ClipboardList,
  DollarSign,
  UserCircle,
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

const doctorMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
  { title: "Daftar Pasien", icon: Users, path: "/doctor/patients" },
  { title: "Rekam Medis", icon: FileText, path: "/doctor/medical-records" },
  { title: "Jadwal Praktik", icon: Calendar, path: "/doctor/calendar" },
  { title: "Laporan", icon: DollarSign, path: "/doctor/reports" },
];

const nurseMenuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/nurse/dashboard" },
  { title: "Antrian Pasien", icon: ClipboardList, path: "/nurse/queue" },
  { title: "Daftar Pasien", icon: Users, path: "/nurse/patients" },
  { title: "Rekam Medis", icon: FileText, path: "/nurse/medical-records" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const user = auth.getUser();
  const menuItems = user?.role === "dokter" ? doctorMenuItems : nurseMenuItems;

  const { data: notifications } = useQuery<number>({
    queryKey: ['/api/notifications/unread/count'],
    enabled: !!user,
  });

  const handleLogout = () => {
    auth.clearUser();
    window.location.href = "/";
  };

  const userInitials = user?.fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">POLADC</h2>
            <p className="text-xs text-muted-foreground">Klinik Gigi</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={
                      location === item.path
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : ""
                    }
                    data-testid={`nav-${item.title.toLowerCase().replace(/ /g, "-")}`}
                  >
                    <Link href={item.path}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3">Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    location === "/profile"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }
                  data-testid="nav-profile"
                >
                  <Link href="/profile">
                    <UserCircle className="w-4 h-4" />
                    <span>Profil Saya</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={
                    location === "/settings"
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }
                  data-testid="nav-settings"
                >
                  <Link href="/settings">
                    <Settings className="w-4 h-4" />
                    <span>Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover-elevate active-elevate-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.photoUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role === "dokter" ? "Dokter Gigi" : "Perawat"}
              </p>
            </div>
            {notifications && notifications > 0 && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                {notifications}
              </Badge>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover-elevate active-elevate-2 rounded-lg"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

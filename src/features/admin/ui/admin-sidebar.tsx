"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import type { User } from "@supabase/supabase-js";
import { AtSign, ChevronUp, Disc3, User2 } from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "about",
    url: "/admin/about",
    icon: AtSign,
  },
  {
    title: "records",
    url: "/admin/records",
    icon: Disc3,
  },
];

interface AdminSidebarProps {
  user: User | null;
}

function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <span>AllRecords</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-50 cursor-pointer">
                <DropdownMenuItem>
                  <span>{user?.user_metadata.name}</span>
                </DropdownMenuItem>
                <Link
                  href="/api/auth/logout"
                  onClick={() => {
                    localStorage.removeItem("kakao_provider_token");
                    localStorage.removeItem("kakao_provider_refresh_token");
                  }}
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;

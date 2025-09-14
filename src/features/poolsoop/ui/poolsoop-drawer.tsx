"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

function PoolsoopDrawer() {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "left"}>
      <DrawerTrigger className="cursor-pointer">Open</DrawerTrigger>
      <DrawerContent
        topClassName="rounded-none border-none hidden group-data-[vaul-drawer-direction=bottom]/drawer-content:hidden"
        className="rounded-none border-none data-[vaul-drawer-direction=bottom]:rounded-t-none data-[vaul-drawer-direction=bottom]:border-t-0"
      >
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerClose>X</DrawerClose>
          </div>
          <DrawerDescription className="hidden">
            This action cannot be undone.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default PoolsoopDrawer;

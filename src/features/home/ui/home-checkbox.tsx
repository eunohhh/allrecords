"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HomeCheckboxProps {
  label: string;
  id: string;
}

function HomeCheckbox({ label, id }: HomeCheckboxProps) {
  return (
    <div className="flex items-center justify-center gap-1 min-w-16">
      <Checkbox id={id} defaultChecked />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

export default HomeCheckbox;

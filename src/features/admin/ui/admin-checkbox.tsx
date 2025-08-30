"use client";

import type { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "../model/admin.store";

interface AdminCheckboxProps {
  label: string;
  id: "poolsoop" | "ilsang" | "grim";
}

function AdminCheckbox({ label, id }: AdminCheckboxProps) {
  const { category, setCategory } = useAdminStore();
  const checked = category.includes(id);

  const handleChange = (checked: CheckedState) => {
    if (checked) {
      setCategory([...category, id]);
    } else {
      setCategory(category.filter((c) => c !== id));
    }
  };

  return (
    <div className="flex min-w-16 items-center justify-center gap-1">
      <Checkbox id={id} checked={checked} onCheckedChange={handleChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

export default AdminCheckbox;

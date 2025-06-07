"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";
import { useHomeStore } from "../model/home.store";

interface HomeCheckboxProps {
  label: string;
  id: string;
}

function HomeCheckbox({ label, id }: HomeCheckboxProps) {
  const { category, setCategory } = useHomeStore();
  const [checked, setChecked] = useState<CheckedState>(category.includes(id));

  const handleChange = (checked: CheckedState) => {
    setChecked(checked);
    if (checked) {
      setCategory([...category, id]);
    } else {
      setCategory(category.filter((c) => c !== id));
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 min-w-16">
      <Checkbox id={id} checked={checked} onCheckedChange={handleChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

export default HomeCheckbox;

"use client";

import AdminAddButton from "./admin-add-button";
import AdminDeleteButton from "./admin-delete-button";

interface AdminHeaderProps {
  title: "records" | "descs";
}

function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <h1 className="flex items-center justify-start pl-2 font-bold text-lg">
        {title === "descs" ? "about" : title}
      </h1>
      <div className="flex items-center justify-end gap-2">
        <AdminAddButton type={title} />
        <AdminDeleteButton type={title} />
      </div>
    </div>
  );
}

export default AdminHeader;

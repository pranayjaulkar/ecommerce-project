"use client";
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "size.value",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center gap-x-2">
        <div className="w-16">{row.original.color.value}</div>
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color.value }}
        ></div>
      </div>
    ),
  },
];
export default columns;

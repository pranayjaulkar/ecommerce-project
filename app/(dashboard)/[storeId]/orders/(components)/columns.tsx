"use client";
import { Product } from "@prisma/client";

const columns = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }: { row: any }) =>
      row.original.orderItems
        .map((orderItem: Product) => orderItem.name)
        .join(", "),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
];

export default columns;

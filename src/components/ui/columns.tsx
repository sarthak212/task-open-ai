"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { labels, priorities, statuses } from "../tableicons";
import { Task } from "../../validation/schema/table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import { priorityList, projectList, statusList, tagsList } from "@/data";

export const getColumns = (updateFunction: any, userData: any[]) => {
  let columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    //   cell: ({ row }) => {
    //     const id: string = row.getValue("id");
    //     return <div className="w-[80px]">{id ? `${id.substring(10)}...` : ""}</div>;
    //   },
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "title",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.status);

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">{row.getValue("title")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = statusList.find((status) => status.value === row.getValue("status"));

        if (!status) {
          return null;
        }

        return <div className="flex w-[100px] items-center">{status.label}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
      cell: ({ row }) => {
        const priority = priorityList.find(
          (priority) => priority.value === row.getValue("priority")
        );

        if (!priority) {
          return null;
        }

        return <div className="flex items-center">{priority.label}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "userid",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned" />,
      cell: ({ row }) => {
        const userIds: string[] = row.getValue("userid");
        const user: any[] = userData?.filter((e) => userIds?.includes(e.id)) || [];
        return (
          <div className="flex items-center">{user?.map((item: any) => item.email).join(", ")}</div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "project",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Project" />,
      cell: ({ row }) => {
        const project = projectList.find((e) => e.value === row.getValue("project"));

        return <div className="flex items-center">{project ? project.label : ""}</div>;
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
      cell: ({ row }) => {
        const tags: {
          label: string;
          value: string;
        }[] = row.original.tags
          ? tagsList.filter((tag) => row.original.tags?.includes(tag.value))
          : [];

        return (
          <div className="flex space-x-2">
            {tags.map((tag) => (
              <Badge key={tag.value} variant="outline">
                {tag.label}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];
  return columns;
};

"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconClipboardText,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  FlexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type Row,
  type SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import { z } from "zod";

import { useIsMobile } from "~/hooks/use-mobile";
import { useDeleteForm, useGetUserForms, useGetFormSubmissions } from "~/hooks/api/form/form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { IconExternalLink, IconInbox, IconCopy, IconCheck } from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
});

export const schema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  fieldsCount: z.number(),
  requiredCount: z.number(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  fields: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      labelKey: z.string(),
      placeholder: z.string().nullable(),
      isRequired: z.boolean(),
      type: z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]),
      index: z.string(),
    }),
  ),
});

type FormRow = z.infer<typeof schema>;

const columnHelper = createColumnHelper<typeof features, FormRow>();

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function FormSubmissionsViewer({ item }: { item: FormRow }) {
  const isMobile = useIsMobile();
  const { data, isLoading } = useGetFormSubmissions(item.id);
  const submissions = data?.submissions ?? [];

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <IconInbox className="size-3.5 text-muted-foreground" />
          Submissions
          {submissions.length > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 text-[10px]">
              {submissions.length}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-md md:max-w-lg">
        <DrawerHeader className="gap-1">
          <DrawerTitle className="flex items-center gap-2">
            <IconInbox className="size-5 text-primary" />
            {item.title} — Submissions
          </DrawerTitle>
          <DrawerDescription>
            Recorded responses for this form ({submissions.length} total).
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-2 text-sm">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : submissions.length === 0 ? (
            <Empty className="border-dashed py-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconInbox />
                </EmptyMedia>
                <EmptyTitle>No Submissions Yet</EmptyTitle>
                <EmptyDescription>
                  Share your public form link to start receiving responses.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            submissions.map(({ submission }, idx) => (
              <div
                key={submission.id}
                className="rounded-lg border bg-card p-4 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Submission #{idx + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {/* {formatDate(submission.createdAt ? String(submission.createdAt) : null)} */}
                    {submission?.createdAt
                      ? new Date(submission.createdAt!).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : null}
                  </span>
                </div>
                <div className="space-y-2">
                  {Object.entries((submission.answers as Record<string, string>) || {}).map(
                    ([key, val]) => {
                      const field = item.fields.find((f) => f.labelKey === key || f.id === key);
                      const label = field?.label || key;
                      return (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between text-xs gap-1"
                        >
                          <span className="font-medium text-foreground">{label}:</span>
                          <span className="text-muted-foreground">{val || "—"}</span>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ActionsCell({ row }: { row: Row<typeof features, FormRow> }) {
  const [copied, setCopied] = React.useState(false);
  const formId = row.original.id;
  const { deleteFormAsync, isPending: isDeleting } = useDeleteForm();

  const handleCopyLink = () => {
    const url = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <FormSubmissionsViewer item={row.original} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <IconCheck className="mr-2 size-4 text-green-500" />
            ) : (
              <IconCopy className="mr-2 size-4" />
            )}
            {copied ? "Copied Link!" : "Copy Share Link"}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/forms/${formId}`} target="_blank">
              <IconExternalLink className="mr-2 size-4" />
              Open Form Page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/forms/${formId}`}>Edit Form</Link>
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(event) => event.preventDefault()}
              >
                <IconTrash className="mr-2 size-4" />
                Delete Form
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete “{row.original.title}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently deletes the form, its fields, and all recorded submissions.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                  onClick={async () => {
                    await deleteFormAsync({ formId });
                  }}
                >
                  {isDeleting ? "Deleting..." : "Delete Form"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const columns = columnHelper.columns([
  columnHelper.display({
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.title}</span>,
    enableHiding: false,
  }),
  columnHelper.accessor("fieldsCount", {
    header: "Fields",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-muted-foreground">
          {row.original.fieldsCount} field{row.original.fieldsCount !== 1 ? "s" : ""}
        </Badge>
        {row.original.requiredCount > 0 && (
          <span className="text-xs text-muted-foreground">
            {row.original.requiredCount} required
          </span>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>
    ),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatDate(row.original.updatedAt)}</span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  }),
]);

function DraggableRow({ row }: { row: Row<typeof features, FormRow> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          <FlexRender cell={cell} />
        </TableCell>
      ))}
    </TableRow>
  );
}

function DataTableSkeleton() {
  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 mt-5">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              <TableRow>
                <TableHead className="w-8">
                  <span className="sr-only">Drag</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Fields</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="w-8">
                    <Skeleton className="size-4 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36 sm:w-56" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-14" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Skeleton className="h-8 w-24 rounded" />
                      <Skeleton className="size-8 rounded" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <Skeleton className="hidden h-4 w-20 lg:block" />
          <div className="flex w-full items-center justify-between gap-8 lg:w-fit lg:justify-end">
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Skeleton className="hidden size-8 lg:block" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="hidden size-8 lg:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataTable() {
  const { data, isLoading, isError, error } = useGetUserForms();

  const initialData: FormRow[] = React.useMemo(
    () =>
      (data?.forms ?? []).map(({ form, fields }) => ({
        id: form.id,
        title: form.title,
        description: form.description,
        fieldsCount: fields.length,
        requiredCount: fields.filter((f) => f.isRequired).length,
        createdAt: form.createdAt ? String(form.createdAt) : null,
        updatedAt: form.updatedAt ? String(form.updatedAt) : null,
        fields,
      })),
    [data],
  );

  const [tableData, setTableData] = React.useState(initialData);
  React.useEffect(() => setTableData(initialData), [initialData]);

  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData.map(({ id }) => id),
    [tableData],
  );

  const table = useTable({
    features,
    data: tableData,
    columns,
    state: { sorting, columnVisibility, columnFilters, pagination },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  if (isLoading) return <DataTableSkeleton />;

  if (isError) {
    return (
      <div className="px-4 lg:px-6">
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconClipboardText />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription>
              {error?.message || "Failed to load your forms. Please try again."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="w-full flex-col justify-start gap-6">
        <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/forms">
              <IconPlus />
              <span className="hidden lg:inline">Create Form</span>
            </Link>
          </Button>
        </div>
        <div className="px-4 lg:px-6 mt-5">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconClipboardText />
              </EmptyMedia>
              <EmptyTitle>No forms yet</EmptyTitle>
              <EmptyDescription>
                Create your first form to start collecting data.
              </EmptyDescription>
            </EmptyHeader>
            <Button asChild>
              <Link href="/dashboard/forms">Create Form</Link>
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/forms">
            <IconPlus />
            <span className="hidden lg:inline">Create Form</span>
          </Link>
        </Button>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 mt-5">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : <FlexRender header={header} />}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredRowModel().rows.length} form
            {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.state.pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.state.pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

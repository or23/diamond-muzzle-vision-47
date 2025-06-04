import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent border-slate-200 dark:border-slate-700">
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Stock #</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Shape</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 text-right">Carat</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Color</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Clarity</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Cut/Polish/Sym</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 text-right">Price</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Status</TableHead>
        <TableHead className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
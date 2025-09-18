import DataGridWithInfiniteScroll from "@/features/data-grid/component/data-grid-with-infinite-scroll";

export default function DataGridPage() {
  return (
    <main className="py-10 flex flex-col gap-4 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Data Grid Assignment</h1>
      <p className="text-sm text-gray-500">
        This is a simple data grid assignment that uses the MUI Data Grid
        component to display a list of users.
      </p>
      <DataGridWithInfiniteScroll />
    </main>
  );
}

"use client";

import { useInView } from "@/hook/use-in-view";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { columns } from "@/features/data-grid/config/column-config";
import { useQuery } from "@tanstack/react-query";
import { userOptions } from "@/service/user";

export default function DataGridWithInfiniteScroll() {
  const [page, setPage] = useState(1);
  const { data: users } = useQuery(userOptions({ page, size: 50 }));
  console.log(users);

  // const { ref, inView } = useInView({ threshold: 1 });

  return (
    <div>
      <DataGrid
        rows={users?.list}
        columns={columns}
        hideFooterPagination
        hideFooter
      />
    </div>
  );
}

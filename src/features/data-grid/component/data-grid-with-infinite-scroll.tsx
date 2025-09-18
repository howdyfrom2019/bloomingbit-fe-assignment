"use client";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { columns } from "@/features/data-grid/config/column-config";
import { useQuery } from "@tanstack/react-query";
import { userOptions } from "@/service/user";

export default function DataGridWithInfiniteScroll() {
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });
  const { data: users, isLoading } = useQuery(
    userOptions({ page: pagination.page + 1, size: pagination.pageSize })
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <DataGrid
        rows={users?.list ?? []}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        rowCount={users?.count ?? 0}
        paginationModel={pagination}
        onPaginationModelChange={setPagination}
      />
    </div>
  );
}

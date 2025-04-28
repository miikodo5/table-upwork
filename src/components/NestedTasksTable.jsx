import { useState, useEffect } from "preact/hooks";
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";

export function NestedTasksTable({ featureId, tasks, dictionaries }) {
    const [columnSizing, setColumnSizing] = useState(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem(`nestedColumnSizing_${featureId}`)
                ) || {}
            );
        } catch {
            return {};
        }
    });
    const [columnSizingInfo, setColumnSizingInfo] = useState(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem(`nestedColumnSizingInfo_${featureId}`)
                ) || {}
            );
        } catch {
            return {};
        }
    });

    // Persist nested column sizes whenever they change
    useEffect(() => {
        localStorage.setItem(
            `nestedColumnSizing_${featureId}`,
            JSON.stringify(columnSizing)
        );
    }, [columnSizing, featureId]);

    useEffect(() => {
        localStorage.setItem(
            `nestedColumnSizingInfo_${featureId}`,
            JSON.stringify(columnSizingInfo)
        );
    }, [columnSizingInfo, featureId]);
    const [sorting, setSorting] = useState([]);

    const columns = [
        {
            accessorKey: "name",
            header: "Tasks",
            size: 250,
            minSize: 100,
            // maxSize: 400,
        },
        {
            accessorKey: "id",
            header: "ID",
            size: 80,
            minSize: 50,
            // maxSize: 120,
        },
        {
            accessorKey: "status",
            header: "Status",
            size: 120,
            cell: ({ getValue }) => dictionaries.status[getValue()] || "",
            minSize: 80,
            // maxSize: 200,
        },
        {
            accessorKey: "team",
            header: "Team",
            size: 150,
            cell: ({ getValue }) => dictionaries.team[getValue()] || "",
            minSize: 100,
            // maxSize: 250,
        },
        {
            accessorKey: "owner",
            header: "Owner",
            size: 120,
            cell: ({ getValue }) => dictionaries.user[getValue()] || "",
            minSize: 80,
            // maxSize: 200,
        },
        {
            accessorKey: "iteration",
            header: "Team Iteration",
            size: 200,
            cell: ({ getValue }) =>
                dictionaries.iteration[getValue()]?.pi_text || "",
            minSize: 150,
            // maxSize: 300,
        },
        {
            accessorKey: "effort",
            header: "Effort",
            size: 80,
            minSize: 50,
            // maxSize: 120,
        },
    ];

    const table = useReactTable({
        data: tasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnSizing,
            columnSizingInfo,
            sorting,
        },
        onColumnSizingChange: setColumnSizing,
        onColumnSizingInfoChange: setColumnSizingInfo,
        onSortingChange: setSorting,
        columnResizeMode: "onChange",
    });

    return (
        <table
            style={{
                width: "auto",
                // marginTop: "8px",
                // backgroundColor: "#fafafa",
            }}
        >
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                style={{ width: header.getSize() }}
                            >
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        cursor: header.column.getCanSort()
                                            ? "pointer"
                                            : "default",
                                    }}
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: " ▲",
                                        desc: " ▼",
                                    }[header.column.getIsSorted()] ?? null}
                                </div>
                                {header.column.getCanResize() && (
                                    <div
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        className={`resizer ${
                                            header.column.getIsResizing()
                                                ? "isResizing"
                                                : ""
                                        }`}
                                    />
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={cell.id}
                                style={{
                                    width: cell.column.getSize(),
                                }}
                            >
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

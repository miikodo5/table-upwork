import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "preact/hooks";
import { NestedTasksTable } from "./NestedTasksTable";
import { IconArrow } from "./IconArrow";

export function FeatureTable({
    data,
    dictionaries,
    columnSizing,
    setColumnSizing,
    columnSizingInfo,
    setColumnSizingInfo,
}) {
    const [expandedRows, setExpandedRows] = useState({});
    const [sorting, setSorting] = useState([]);

    const columns = [
        {
            accessorKey: "name",
            header: "Feature Name",
            cell: ({ row, getValue }) =>
                row.getCanExpand() ? (
                    <span className="feature-name grey-bar">
                        <span
                            className="toggle-button"
                            onClick={() => row.toggleExpanded()}
                        >
                            {row.getIsExpanded() ? (
                                <IconArrow />
                            ) : (
                                <IconArrow right={true} />
                            )}
                        </span>
                        {getValue()}
                    </span>
                ) : null,
            size: 300,
            minSize: 300,
            maxSize: 500,
        },
        {
            accessorKey: "id",
            header: "ID",
            size: 100,
            minSize: 50,
            maxSize: 150,
        },
        {
            accessorKey: "committed",
            header: "Committed",
            cell: ({ getValue }) => (getValue() ? "Yes" : "No" || ""),
            size: 100,
            minSize: 50,
            maxSize: 150,
        },
        {
            accessorKey: "wsjf",
            header: "WSJF",
            size: 60,
            minSize: 30,
            maxSize: 100,
        },
        {
            accessorKey: "effort",
            header: "Effort",
            cell: ({ getValue }) => getValue() + "pt" || "",
            size: 80,
            minSize: 50,
            maxSize: 120,
        },
        {
            accessorKey: "done",
            header: "Done",
            cell: ({ getValue }) => (getValue() ? "Yes" : "No" || ""),
            size: 100,
            minSize: 50,
            maxSize: 150,
        },
        {
            accessorKey: "planned_pi",
            header: "Planned PI",
            size: 180,
            cell: ({ getValue }) => dictionaries.pi[getValue()] || "",
            minSize: 120,
            maxSize: 250,
        },
        {
            accessorKey: "owner",
            header: "Owner",
            size: 120,
            cell: ({ getValue }) => dictionaries.user[getValue()] || "",
            minSize: 80,
            maxSize: 200,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getSubRows: (row) => row.subRows,
        state: {
            expanded: expandedRows,
            columnSizing,
            columnSizingInfo,
            sorting,
        },
        onExpandedChange: setExpandedRows,
        onColumnSizingChange: setColumnSizing,
        onColumnSizingInfoChange: setColumnSizingInfo,
        onSortingChange: setSorting,
        columnResizeMode: "onChange",
        sortDescFirst: true,
    });

    return (
        <div className="table-container">
            <table>
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
                        <>
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

                            {row.getIsExpanded() && (
                                <tr key={`${row.id}-expanded`}>
                                    <td
                                        colSpan={columns.length}
                                        className="nested-conteiner"
                                    >
                                        <NestedTasksTable
                                            tasks={row.original.tasks}
                                            dictionaries={dictionaries}
                                        />
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

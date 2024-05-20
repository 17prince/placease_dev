import {
  MaterialReactTable,
  createMRTColumnHelper,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

const columnHelper = createMRTColumnHelper();

const columns = [
  columnHelper.accessor("enrollment", {
    header: "Enrollment",
    size: 150,
    muiTableBodyCellProps: {
      align: "left",
    },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    size: 150,
    muiTableBodyCellProps: {
      align: "left",
    },
  }),
  columnHelper.accessor("branch", {
    header: "Branch",
    size: 170,
    muiTableBodyCellProps: {
      align: "left",
    },
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    size: 120,
    muiTableBodyCellProps: {
      align: "left",
    },
  }),
  columnHelper.accessor("currentCGPA", {
    header: "Current CGPA",
    size: 150,
    muiTableBodyCellProps: {
      align: "center",
    },
  }),
  columnHelper.accessor("batchYear", {
    header: "Batch Year",
    size: 150,

    muiTableBodyCellProps: {
      align: "left",
    },
  }),
  columnHelper.accessor("dob", {
    header: "DOB",
    size: 150,
    filterVariant: "date-range",
    Cell: ({ cell }) => {
      const newDate = new Date(cell.getValue("dob"));

      return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
    },
    muiTableBodyCellProps: {
      align: "left",
    },
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export default function DataTable({ data }) {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    // muiPaginationProps: {
    //   rowsPerPageOptions: {
    //     label: "Results Per Page",
    //     value: 10,
    //   },
    // },
    positionToolbarAlertBanner: "bottom",
    layoutMode: "grid",

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "15px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
}

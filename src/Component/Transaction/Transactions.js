import * as React from "react";
import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../Table/TablePaginationActions";
import { AuthContext } from "../../TokenDetails/AuthContext";
import InventoryServices from "../../Service/InventoryServices";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const headings = ["Transaction Id", "Item Id", "Location Id", "Type", "Date"];
export default function TransactionTable() {
  const [search, setSearch] = React.useState("");
  const { TransactionData, setTransactionData } = React.useContext(AuthContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - TransactionData.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    InventoryServices.getTrasactions(
      sessionStorage.getItem("organizationId"),
      sessionStorage.getItem("token")
    )
      .then((response) => {
        setTransactionData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setTransactionData]);

  return (
    <div className="container">
      <div className=" my-4">
        <h3 variant="h3" className="text-center ">
          Transaction Details
        </h3>
      </div>

      <div className="mb-3 col-3">
        <input
          type="text"
          class="search form-control"
          placeholder="Search Transaction By ItemId"
          onChange={handleSearch}
        />
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headings.map((head) => (
                <StyledTableCell style={{ fontSize: "17px" }} align="center">
                  {head}
                </StyledTableCell>
              ))}
              <StyledTableCell style={{ fontSize: "17px" }} align="right">
                Quantity
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? TransactionData.reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .filter((element) =>
                    element.itemId.toLowerCase().includes(search)
                  )
              : TransactionData
            ).map((element) => (
              <StyledTableRow key={element.id}>
                <StyledTableCell component="th" scope="row">
                  {element.id}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {element.itemId}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {element.locationId}
                </StyledTableCell>

                <StyledTableCell align="center">{element.type}</StyledTableCell>
                <StyledTableCell align="center">{element.date}</StyledTableCell>
                <StyledTableCell align="right">
                  {element.quantity}
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={12}
                count={TransactionData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
}

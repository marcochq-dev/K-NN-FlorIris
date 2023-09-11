import { useEffect, useState } from "react";
import "./home.scss";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import axios from "axios";
import { urlGetIrisData } from "../../services/endpoints";


const rows: {id:number, sepalLargo: number; sepalAncho: number; petalLargo: number; petalAncho: number }[] = [
  {id:1, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:2, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:3, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:4, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:5, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:6, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  {id:7, sepalLargo: 1, sepalAncho: 1.1, petalLargo: 2, petalAncho: 2.2 },
  // Agrega más filas según sea necesario
];

const columns: { id: string; label: string; minWidth: number }[] = [
  { id: 'sepalLargo', label: 'Sepal Largo', minWidth: 20 },
  { id: 'sepalAncho', label: 'Sepal Ancho', minWidth: 20 },
  { id: 'petalLargo', label: 'Petal Largo', minWidth: 20 },
  { id: 'petalAncho', label: 'Petal Ancho', minWidth: 20 },
];

export default function Home() {
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    axios.get(urlGetIrisData)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="home-container">
      <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
    </div>
  );
}

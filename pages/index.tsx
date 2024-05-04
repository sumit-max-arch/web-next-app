import React, { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Pagination,
} from "@mui/material";
import styles from "../styles/ProductTable.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { authenticate } from "../utils/authenticate";

const Loader = () => (
  <div className={styles.loaderContainer}>
    <div className={styles.loader}>
      <CircularProgress />
    </div>
  </div>
);

interface Product {
  id: number;
  title: string;
  image: string;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total number of pages
  const imageRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product[]>(
          `https://fakestoreapi.com/products?limit=10&page=${page}`
        );
        setProducts(response.data);
        setLoading(false);

        // Update total pages based on response headers
        const totalPagesHeader = response.headers["x-total-pages"];
        setTotalPages(parseInt(totalPagesHeader, 10));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [page]); // Trigger fetch data when page changes

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await authenticate();

        if (!isAuthenticated) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleCellClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className={styles.tableRow}
                    onClick={() => handleCellClick(product)}
                  >
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.title}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className={styles.paginationContainer}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>

      <div className={styles.imageContainer}>
        {selectedProduct && (
          <div className={styles.gridContainer}>
            <div className={styles.title}>
              <Typography variant="h6" className={styles.selectedProductTitle}>
                Selected Product
              </Typography>
            </div>
            <div className={styles.image}>
              {loading ? (
                <Loader />
              ) : (
                <img
                  ref={imageRef}
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;

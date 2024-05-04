import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography } from '@mui/material';
import styles from '../styles/ProductTable.module.css'; 
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { authenticate } from '../utils/authenticate';

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
  const imageRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await authenticate();

        if (!isAuthenticated) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    };

    checkAuthentication();
  }, []);

  const handleCellClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
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
                  <TableRow key={product.id} onClick={() => handleCellClick(product)}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.title}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={styles.imageContainer}>
        {selectedProduct && (
          <>
            <Typography variant="h6" className={styles.selectedProductTitle}>Selected Product</Typography>
            <br/>
            {loading ? (
              <Loader />
            ) : (
              <img ref={imageRef} src={selectedProduct.image} alt={selectedProduct.title} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTable;

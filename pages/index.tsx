import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography } from '@mui/material';
import styles from '../styles/ProductTable.module.css'; 
import { useRouter } from 'next/router';
import { authenticate } from './middleware/authenticate';
interface Product {
  id: number;
  title: string;
  image: string;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`${process.env.API_BASE_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Call the authentication function
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
              {products.map((product) => (
                <TableRow key={product.id} onClick={() => handleCellClick(product)}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className={styles.imageContainer}>
        {selectedProduct && (
          <>
            <Typography variant="h6">Selected Product</Typography>
            <img ref={imageRef} src={selectedProduct.image} alt={selectedProduct.title} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductTable;

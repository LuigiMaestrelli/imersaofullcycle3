import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { Product } from '../model';
import http from '../http';

interface ProductsListPageProps {
    products: Product[];
}

const ProductsListPage: NextPage<ProductsListPageProps> = ({ products }) => {
    return (
        <div>
            <Head>
                <title>Listagem de produtos</title>
            </Head>
            <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
                Produtos
            </Typography>

            <Grid container spacing={4}>
                {products.map(product => {
                    return (
                        <Grid key={product.id} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardMedia style={{ paddingTop: '56%' }} image={product.image_url} />
                                <CardContent>
                                    <Typography component="h2" variant="h5" gutterBottom>
                                        {product.name}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Link href="/products/[slug]" as={`/products/${product.slug}`} passHref>
                                        <Button size="small" color="primary" component="a">
                                            Detalhes
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
};

export default ProductsListPage;

export const getServerSideProps: GetServerSideProps<ProductsListPageProps> = async context => {
    const response = await http.get('products');

    return {
        props: {
            products: response.data
        }
    };
};

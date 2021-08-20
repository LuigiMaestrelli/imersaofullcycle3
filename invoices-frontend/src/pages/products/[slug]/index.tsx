import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Head from 'next/head';
import axios from 'axios';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import { Product } from '../../../model';
import http from '../../../http';

interface ProductDetailPageProps {
    product: Product;
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product }) => {
    return (
        <div>
            <Head>
                <title>{product.name} - Detalhes</title>
            </Head>

            <Card key={product.id}>
                <CardHeader title={product.name.toUpperCase()} subheader={`R$ ${product.price}`} />
                <CardActions>
                    <Link href="/products/[slug]/order" as={`/products/${product.slug}/order`} passHref>
                        <Button size="small" color="primary" component="a">
                            Comprar
                        </Button>
                    </Link>
                </CardActions>
                <CardMedia style={{ paddingTop: '56%' }} image={product.image_url} />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {product.description}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductDetailPage;

export const getStaticProps: GetStaticProps<ProductDetailPageProps, { slug: string }> = async context => {
    const { slug } = context.params!;

    try {
        const response = await http.get(`products/${slug}`);

        return {
            props: {
                product: response.data
            },
            revalidate: 60 * 2 // 2 min
        };
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            return {
                notFound: true
            };
        }

        throw err;
    }
};

export const getStaticPaths: GetStaticPaths = async context => {
    const response = await http.get('products');

    const paths = response.data.map((p: Product) => ({
        params: {
            slug: p.slug
        }
    }));

    return { paths, fallback: 'blocking' };
};

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { Product } from '../model';

const products: Product[] = [
    {
        id: 'uuid',
        name: 'teste',
        description: 'produto de teste',
        price: 5.23,
        image_url: 'https://source.unsplash.com/random?product',
        slug: 'produto-teste',
        created_at: '2021-07-13T00:00:00'
    }
];

export default function ProductsListPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Listagem de produtos</title>
            </Head>
            <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
                Produtos
            </Typography>

            {products.map(product => {
                return (
                    <Card key={product.id}>
                        <CardMedia image={product.image_url} />
                        <CardContent>
                            <Typography component="h2" variant="h5" gutterBottom>
                                {product.name}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" color="primary" component="a">
                                Detalhes
                            </Button>
                        </CardActions>
                    </Card>
                );
            })}
        </div>
    );
}

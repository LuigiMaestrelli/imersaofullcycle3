import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Head from 'next/head';
import axios from 'axios';
import { NextPage, GetServerSideProps } from 'next';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';

import { Product } from '../../../model';
import http from '../../../http';

interface OrderPageProps {
    product: Product;
}

const OrderPage: NextPage<OrderPageProps> = ({ product }) => {
    const { register, handleSubmit, setValue } = useForm();

    return (
        <div>
            <Head>
                <title>Pagamento</title>
            </Head>

            <Typography component="h1" variant="h3" color="textPrimary" gutterBottom>
                Checkout
            </Typography>

            <ListItem>
                <ListItemAvatar>
                    <Avatar src={product.image_url} />
                </ListItemAvatar>
                <ListItemText primary={product.name} secondary={`R$ ${product.price}`} />
            </ListItem>

            <Typography component="h2" variant="h6" gutterBottom>
                Pague com cartão de crédito
            </Typography>

            <form>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField {...register('name')} required label="Nome" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            {...register('number')}
                            label="Numero do cartão"
                            required
                            fullWidth
                            inputProps={{ maxLength: 16 }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField {...register('cvv')} required type="number" label="CVV" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    {...register('expiration_month')}
                                    required
                                    type="number"
                                    label="Expiração mês"
                                    fullWidth
                                    onChange={e => setValue('expiration_month', parseInt(e.target.value))}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    {...register('expiration_year')}
                                    required
                                    type="number"
                                    label="Expiração ano"
                                    fullWidth
                                    onChange={e => setValue('expiration_year', parseInt(e.target.value))}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box marginTop={1}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Pagar
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<OrderPageProps, { slug: string }> = async context => {
    const { slug } = context.params!;

    try {
        const response = await http.get(`products/${slug}`);

        return {
            props: {
                product: response.data
            }
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

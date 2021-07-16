import { Avatar, Chip, Grid, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import http from '../../http';
import { Order, OrderStatus } from '../../model';

interface OrderDetailPageProps {
    order: Order;
}

const OrderDetailPage: NextPage<OrderDetailPageProps> = ({ order }) => {
    const { items } = order;

    return (
        <div>
            <Head>
                <title>Detalhes da ordem</title>
            </Head>
            <Typography component="h1" variant="h6" color="textPrimary" gutterBottom>
                Order - #{order.id}
            </Typography>
            <Chip
                label={order.status === OrderStatus.Approved ? 'Aprovado' : 'Pendente'}
                color={order.status === OrderStatus.Approved ? 'primary' : 'default'}
            />
            <ListItem alignItems="flex-start">
                {items.map(item => (
                    <>
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={item.product.image_url} />
                        </ListItemAvatar>
                        <ListItemText primary={item.product.name} secondary={`R$ ${item.price}`} />
                    </>
                ))}
            </ListItem>
            <Typography variant="h6" gutterBottom>
                Detalhes do cartão de crédito
            </Typography>
            <Grid container>
                <Grid item xs={3} sm={1}>
                    <Typography gutterBottom>Name</Typography>
                </Grid>
                <Grid item xs={9} sm={11}>
                    <Typography gutterBottom>{order.credit_card.name}</Typography>
                </Grid>
                <Grid item xs={3} sm={1}>
                    <Typography gutterBottom>Número</Typography>
                </Grid>
                <Grid item xs={9} sm={11}>
                    <Typography gutterBottom>{order.credit_card.number}</Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default OrderDetailPage;

export const getStaticProps: GetStaticProps<OrderDetailPageProps, { id: string }> = async context => {
    try {
        const { id } = context.params!;
        const { data: order } = await http.get(`orders/${id}`);

        return {
            props: {
                order
            },
            revalidate: 60 * 10 //10 min
        };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 404) {
            return { notFound: true };
        }
        throw e;
    }
};

export const getStaticPaths: GetStaticPaths = async context => {
    return { paths: [], fallback: 'blocking' };
};

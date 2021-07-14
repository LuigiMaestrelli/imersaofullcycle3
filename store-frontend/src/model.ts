export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
}

export const products: Product[] = [
    {
        id: 'uuid',
        name: 'Um produto',
        description: 'produto de teste',
        price: 5.23,
        image_url: `https://source.unsplash.com/random?product,${Math.random()}`,
        slug: 'produto-teste',
        created_at: '2021-07-13T00:00:00'
    },
    {
        id: 'uuid2',
        name: 'Outro produto',
        description:
            'produto de teste com uma descrição muito maior que a outrar para poder testar o tamanho do campo com quebra de linhas',
        price: 5.23,
        image_url: `https://source.unsplash.com/random?product,${Math.random()}`,
        slug: 'produto-teste2',
        created_at: '2021-07-13T00:00:00'
    }
];

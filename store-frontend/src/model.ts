export interface Product {
    id: string;
    name: string;
    description: string;
    image_url: string;
    slug: string;
    price: number;
    created_at: string;
}
export interface CreditCard {
    number: string;
    name: string;
    expiration_month: number;
    expiration_year: number;
    cvv: string;
}

export enum OrderStatus {
    Approved = 'approved',
    Pending = 'pending'
}

export interface OrderItem {
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    credit_card: Omit<CreditCard, 'cvv' | 'name'>;
    items: OrderItem[];
    status: OrderStatus;
}

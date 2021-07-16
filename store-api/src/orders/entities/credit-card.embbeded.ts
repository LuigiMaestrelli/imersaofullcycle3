import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

export class CreditCard {
    @Exclude()
    @Column({ name: 'credit_card_number' })
    number: string;

    @Column({ name: 'credit_card_name' })
    name: string;

    @Exclude()
    @Column({ name: 'credit_card_cvv' })
    cvv: string;

    @Exclude()
    @Column({ name: 'credit_card_expiration_month' })
    expiration_month: number;

    @Exclude()
    @Column({ name: 'credit_card_expiration_year' })
    expiration_year: number;

    @Expose({ name: 'number' })
    maskedNumber() {
        return '************' + this.number.substr(-4);
    }
}
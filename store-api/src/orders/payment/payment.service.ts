import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

interface PaymentData {
    creditCard: {
        number: string;
        name: string;
        cvv: string;
        expirationMonth: number;
        expirationYear: number;
    };
    amount: number;
    description: string;
    store: string;
}

interface PaymentGrpcService {
    payment(data: PaymentData): Observable<void>;
}

@Injectable()
export class PaymentService implements OnModuleInit {
    private paymentGrpcService: PaymentGrpcService;

    constructor(@Inject('PAYMENT_PACKAGE') private readonly clientGrpc: ClientGrpc) {}

    onModuleInit() {
        this.paymentGrpcService = this.clientGrpc.getService<PaymentGrpcService>('PaymentService');
    }

    async payment(data: PaymentData) {
        try {
            const source = this.paymentGrpcService.payment(data);
            return await lastValueFrom(source);
        } catch (e) {
            throw new RpcException({
                code: e.code,
                message: e.message
            });
        }
    }
}

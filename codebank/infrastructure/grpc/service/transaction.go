package service

import (
	"context"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/luigimaestrelli/codebank/dto"
	"github.com/luigimaestrelli/codebank/infrastructure/grpc/pb"
	"github.com/luigimaestrelli/codebank/usecase"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}

func (t *TransactionService) Payment(ctx context.Context, in *pb.PaymentRequest) (*empty.Empty, error) {
	transactionDto := dto.Transaction {
		Name: in.GetCreditCard().Name,
		Number: in.GetCreditCard().GetNumber(),
		ExpirationMonth: in.GetCreditCard().GetExpirationMonth(),
		ExpirationYear: in.GetCreditCard().GetExpirationYear(),
		CVV: in.GetCreditCard().GetCvv(),
		Amount: in.GetAmount(),
		Store: in.GetStore(),
		Description: in.GetDescription(),
	}

	transacion, err := t.ProcessTransactionUseCase.ProcessTransaction(transactionDto)
	if err != nil {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, err.Error())
	}

	if transacion.Status != "approved" {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, "Transaction rejected by the bank")
	}

	return &empty.Empty{}, nil
}
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/luigimaestrelli/codebank/infrastructure/grpc/server"
	"github.com/luigimaestrelli/codebank/infrastructure/kafka"
	"github.com/luigimaestrelli/codebank/infrastructure/repository"
	"github.com/luigimaestrelli/codebank/usecase"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error readind .env file " + err.Error())
	}
}

func main() {
	fmt.Println("Iniciando banco de dados")

	db := setupDb();
	defer db.Close() //defer vai fazer rodar esse comando no final de tudo

	fmt.Println("Iniciando Kafka producer")

	producer := setupKafkaProducer()
	processTransactionUseCase := setupTransactionUseCase(db, producer)

	fmt.Println("Iniciando gRPC")

	serverGRPC(processTransactionUseCase)
}

func setupTransactionUseCase(db *sql.DB, producer kafka.KafkaProducer) usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	useCase.KafkaProducer = producer

	return useCase
}

func setupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer(os.Getenv("KafkaBootstrapServers"));

	return producer
}

func setupDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("host"),
		os.Getenv("port"),
		os.Getenv("user"),
		os.Getenv("password"),
		os.Getenv("dbname"),
	)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal("error connecting to the database " + err.Error())
	}

	return db
}

func serverGRPC(processTransactionUseCase usecase.UseCaseTransaction) {
	grcpServer := server.NewGRPCServer()
	grcpServer.ProcessTransactionUseCase = processTransactionUseCase
	grcpServer.Serve()
}
package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"obatin/config"
	"obatin/database"
	"obatin/server"
)

func main() {
	c, err := config.NewConfig()
	if err != nil {
		log.Fatalf("error loading config: %s", err.Error())
	}

	db, err := database.ConnectDB(c)
	if err != nil {
		log.Fatalf("error connection db: %s", err.Error())
	}
	defer db.Close()

	router := server.Init(db, c)

	srv := http.Server{
		Handler: router,
		Addr:    c.ServerPort(),
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
}

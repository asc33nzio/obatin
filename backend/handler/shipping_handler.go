package handler

import (
	"fmt"
	"net/http"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/dto"
	"obatin/usecase"
	"sync"

	"github.com/gin-gonic/gin"
)

type ShippingHandler struct {
	shippingUsecase usecase.ShippingUsecase
	config          *config.Config
}

func NewShippingHandler(shippingUsecase usecase.ShippingUsecase, config *config.Config) *ShippingHandler {
	return &ShippingHandler{
		shippingUsecase: shippingUsecase,
		config:          config,
	}
}

func (h *ShippingHandler) AvailableShippingsPerPharmacy(ctx *gin.Context) {
	var body dto.AvailableShippingsReq
	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	shippings, err := h.shippingUsecase.AvailableShippingsPerPharmacy(ctx, body.PharmacyId)
	if err != nil {
		ctx.Error(err)
		return
	}

	resCh := make(chan *dto.RajaOngkirCostRes, len(shippings))
	errCh := make(chan error, len(shippings))
	var rajaOngkirRes []*dto.RajaOngkirCostRes
	var wg sync.WaitGroup

	for _, shipping := range shippings {
		if shipping.ShippingMethod.Code == appconstant.RajaOngkirJne ||
			shipping.ShippingMethod.Code == appconstant.RajaOngkirTiki ||
			shipping.ShippingMethod.Code == appconstant.RajaOngkirPos {
			originId := fmt.Sprintf("%v", *shipping.Pharmacy.City.Id)
			destinationId := fmt.Sprintf("%v", body.DestinationCityId)
			wg.Add(1)
			go rajaOngkirCalculateCost(
				rajaOngkirCalculateCostArgs{
					ctx: ctx,
					body: dto.RajaOngkirCostReq{
						Origin:      originId,
						Destination: destinationId,
						Weight:      body.Weight,
						Courier:     shipping.ShippingMethod.Code,
					},
					config: h.config,
					resCh:  resCh,
					errCh:  errCh,
					wg:     &wg,
				},
			)
		}
	}

	go func() {
		defer close(resCh)
		for range shippings {
			roRes := <-resCh
			rajaOngkirRes = append(rajaOngkirRes, roRes)
		}
	}()

	wg.Wait()
	close(errCh)

	for err := range errCh {
		if err != nil {
			ctx.Error(err)
			return
		}
	}

	res := dto.ToAvailableShippingsRes(shippings, rajaOngkirRes, body)
	ctx.JSON(http.StatusOK, dto.APIResponse{
		Message: appconstant.ResponseOkMsg,
		Data:    res,
	})
}

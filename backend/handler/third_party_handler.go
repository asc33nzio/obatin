package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"obatin/appconstant"
	"obatin/apperror"
	"obatin/config"
	"obatin/dto"
	"strconv"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
)

type ThirdPartyHandler struct {
	config *config.Config
}

type rajaOngkirCalculateCostArgs struct {
	ctx    context.Context
	body   dto.RajaOngkirCostReq
	config *config.Config
	resCh  chan<- *dto.RajaOngkirCostRes
	errCh  chan<- error
	wg     *sync.WaitGroup
}

func NewThirdPartyHandler(config *config.Config) *ThirdPartyHandler {
	return &ThirdPartyHandler{
		config: config,
	}
}

func (h *ThirdPartyHandler) RajaOngkirCost(ctx *gin.Context) {
	var body dto.RajaOngkirCostReq

	err := ctx.ShouldBindJSON(&body)
	if err != nil {
		ctx.Error(apperror.ErrInvalidReq(err))
		return
	}

	resCh := make(chan *dto.RajaOngkirCostRes)
	errCh := make(chan error)
	var wg sync.WaitGroup
	wg.Add(1)

	go rajaOngkirCalculateCost(rajaOngkirCalculateCostArgs{
		ctx:    ctx,
		body:   body,
		config: h.config,
		resCh:  resCh,
		errCh:  errCh,
		wg:     &wg,
	})

	go func() {
		wg.Wait()
		close(resCh)
		close(errCh)
	}()

	select {
	case err := <-errCh:
		if err != nil {
			ctx.Error(err)
			return
		}
	case result := <-resCh:
		ctx.JSON(http.StatusOK, dto.APIResponse{
			Message: appconstant.ResponseOkMsg,
			Data:    result,
		})
	}
}

func rajaOngkirCalculateCost(r rajaOngkirCalculateCostArgs) {
	defer r.wg.Done()
	requestData := url.Values{
		appconstant.OriginKey:      {r.body.Origin},
		appconstant.DestinationKey: {r.body.Destination},
		appconstant.WeightKey:      {strconv.Itoa(r.body.Weight)},
		appconstant.CourierKey:     {r.body.Courier},
	}

	client := http.Client{}
	req, err := http.NewRequestWithContext(r.ctx, http.MethodPost, r.config.RajaOngkirCostApiUrl(), strings.NewReader(requestData.Encode()))
	if err != nil {
		r.errCh <- apperror.NewInternal(err)
		return
	}

	req.Header.Set(appconstant.ContentTypeKey, appconstant.ApplicationForm)
	req.Header.Set(appconstant.KeyKey, r.config.RajaOngkirApiKey())

	resp, err := client.Do(req)
	if err != nil {
		r.errCh <- apperror.NewInternal(err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		r.errCh <- apperror.NewInternal(apperror.ErrStlUnexpectedError)
		return
	}

	var costResponse dto.RajaOngkirCostRes
	err = json.NewDecoder(resp.Body).Decode(&costResponse)
	if err != nil {
		r.errCh <- apperror.NewInternal(err)
		return
	}

	r.resCh <- &costResponse
}

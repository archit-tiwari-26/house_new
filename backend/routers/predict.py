from fastapi import APIRouter
from schemas import PredictRequest
from model_loader import predict_price

router = APIRouter()

@router.post("/")
def predict(req: PredictRequest):
    price = predict_price(req.data)
    return {"predicted_price": price}

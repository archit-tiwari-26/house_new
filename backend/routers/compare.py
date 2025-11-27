from fastapi import APIRouter
from schemas import CompareRequest
from model_loader import predict_price

router = APIRouter()

@router.post("/")
def compare(req: CompareRequest):
    p1 = predict_price(req.house1)
    p2 = predict_price(req.house2)

    diff = p1 - p2

    return {
        "house1_price": p1,
        "house2_price": p2,
        "difference": diff,
        "higher": "House 1" if p1 > p2 else "House 2"
    }

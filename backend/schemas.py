from pydantic import BaseModel
from typing import Dict, List, Any


class PredictRequest(BaseModel):
    data: Dict[str, Any]


class CompareRequest(BaseModel):
    house1: Dict[str, Any]
    house2: Dict[str, Any]





class ChartRequest(BaseModel):
    feature: str

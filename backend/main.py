from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import dropdowns
from routers.predict import router as predict_router
from routers.compare import router as compare_router
from routers.charts import router as charts_router   # keep this
# REMOVE: from routers.analytics import router as analytics_router

app = FastAPI(
    title="Delhi House Price Prediction API",
    version="1.1.0",
    description="Predict, compare, visualize houses."
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "API running"}

# Register Routers
app.include_router(predict_router, prefix="/predict", tags=["Prediction"])
app.include_router(compare_router, prefix="/compare", tags=["Compare Houses"])
app.include_router(charts_router, prefix="/charts", tags=["Charts & Analytics"])
app.include_router(dropdowns.router, prefix="/dropdowns", tags=["Dropdowns"])

# REMOVE:
# app.include_router(analytics_router, prefix="/api")

# backend/routers/charts.py
from fastapi import APIRouter
import pandas as pd
from model_loader import df_global

router = APIRouter()

@router.get("/analytics")
def analytics():
    df = df_global.copy()

    # --- 1. PRICE DISTRIBUTION ---
    bins = [0, 25, 50, 75, 100, 150, 200, 300, 9999]
    labels = ["0-25", "25-50", "50-75", "75-100", "100-150", "150-200", "200-300", "300+"]
    df["price_bin"] = pd.cut(df["Price_in_Lakhs"], bins=bins, labels=labels, include_lowest=True)

    price_dist = df["price_bin"].value_counts().sort_index().to_dict()

    # --- 2. BHK AVERAGE PRICE ---
    bhk_avg = df.groupby("BHK")["Price_in_Lakhs"].mean().to_dict()

    # --- 3. TOP 10 LOCALITY AVERAGE PRICE ---
    locality_avg = (
        df.groupby("Locality")["Price_in_Lakhs"]
        .mean()
        .sort_values(ascending=False)
        .head(10)
        .to_dict()
    )

    # --- 4. SCATTER DATA (limit for performance)
    scatter_df = df[["Size_in_SqFt", "Price_in_Lakhs"]].dropna().head(5000)
    scatter_data = scatter_df.to_dict(orient="records")

    return {
        "price_distribution": price_dist,
        "bhk_avg_price": bhk_avg,
        "locality_avg_price": locality_avg,
        "scatter_data": scatter_data,
    }

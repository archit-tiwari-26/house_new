import os
import json
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from xgboost import XGBRegressor
from sklearn.ensemble import (
    RandomForestRegressor,
    ExtraTreesRegressor,
    HistGradientBoostingRegressor
)

# ============================================================
# 1. Paths
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "delhi_housing_synthetic.csv")
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

os.makedirs(MODELS_DIR, exist_ok=True)

# ============================================================
# 2. Load Data
# ============================================================

df = pd.read_csv(DATA_PATH)
print("Loaded dataset:", df.shape)

# ============================================================
# 3. Clean Basic Columns
# ============================================================

clean_cols = [
    "Furnished_Status", "Parking_Space", "Facing",
    "Owner_Type", "Availability_Status", "Locality", "Property_Type"
]

for col in clean_cols:
    df[col] = df[col].astype(str).str.strip()

df["Security"] = df["Security"].map({"Yes": 1, "No": 0}).fillna(0).astype(int)

df["Public_Transport_Accessibility"] = df["Public_Transport_Accessibility"].astype(int)

# ============================================================
# 4. Amenities Parsing + Feature Engineering
# ============================================================

def parse_amenities(a):
    if not isinstance(a, str) or a.strip() == "":
        return []
    return [x.strip().lower() for x in a.split(",")]

df["Amenities_list"] = df["Amenities"].apply(parse_amenities)
df["Amenities_count"] = df["Amenities_list"].apply(len)

amenity_flags = ["pool", "gym", "garden", "clubhouse", "playground"]

for flag in amenity_flags:
    df[f"has_{flag}"] = df["Amenities_list"].apply(lambda x, f=flag: 1 if f in x else 0)

# ============================================================
# 5. Feature Lists
# ============================================================

categorical = [
    "Locality", "Property_Type", "Furnished_Status",
    "Parking_Space", "Facing", "Owner_Type", "Availability_Status"
]

numeric = [
    "BHK", "Size_in_SqFt", "Floor_No", "Total_Floors",
    "Age_of_Property", "Nearby_Schools", "Nearby_Hospitals",
    "Public_Transport_Accessibility", "Security", "Amenities_count"
] + [f"has_{f}" for f in amenity_flags]

target = "Price_in_Lakhs"
features = categorical + numeric

# ============================================================
# 6. Prepare X, y
# ============================================================

X = df[features].copy()
y = df[target].copy()

# numeric cleanup
for col in numeric:
    X[col] = pd.to_numeric(X[col], errors="coerce").fillna(X[col].median())

for col in categorical:
    X[col] = X[col].fillna("Unknown")

# ============================================================
# 7. Train-test split
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# ============================================================
# 8. Preprocessor
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical),
        ("num", StandardScaler(), numeric)
    ]
)

# ============================================================
# 9. Define Models
# ============================================================

models = {
    "XGBoost": XGBRegressor(
        n_estimators=700,
        learning_rate=0.05,
        max_depth=8,
        subsample=0.8,
        colsample_bytree=0.7,
        reg_lambda=1.2,
        random_state=42,
        tree_method="hist"
    ),
    "RandomForest": RandomForestRegressor(
        n_estimators=500, max_depth=None, random_state=42, n_jobs=-1
    ),
    "ExtraTrees": ExtraTreesRegressor(
        n_estimators=600, max_depth=None, random_state=42, n_jobs=-1
    ),
    "HistGradientBoosting": HistGradientBoostingRegressor(
        max_depth=8, learning_rate=0.07, random_state=42
    )
}

# ============================================================
# 10. Train + Evaluate All Models
# ============================================================

results = {}
best_model_name = None
best_r2 = -999
best_pipeline = None

def evaluate(name, model, pipeline):
    pred_train = pipeline.predict(X_train)
    pred_test = pipeline.predict(X_test)

    train_mae = mean_absolute_error(y_train, pred_train)
    test_mae = mean_absolute_error(y_test, pred_test)

    train_rmse = mean_squared_error(y_train, pred_train) ** 0.5
    test_rmse = mean_squared_error(y_test, pred_test) ** 0.5

    train_r2 = r2_score(y_train, pred_train)
    test_r2 = r2_score(y_test, pred_test)

    results[name] = {
        "Train_R2": train_r2,
        "Test_R2": test_r2,
        "Test_MAE": test_mae,
        "Test_RMSE": test_rmse
    }

    global best_model_name, best_r2, best_pipeline
    if test_r2 > best_r2:
        best_r2 = test_r2
        best_model_name = name
        best_pipeline = pipeline

print("\n================ TRAINING MODELS ================\n")

for name, model in models.items():
    print(f"Training {name}...")
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", model)
    ])
    pipeline.fit(X_train, y_train)
    evaluate(name, model, pipeline)
    print(f"{name} done.\n")

# ============================================================
# 11. Show Ranked Results
# ============================================================

print("\n================ MODEL PERFORMANCE COMPARISON ================\n")

df_results = pd.DataFrame(results).T
df_results = df_results.sort_values(by="Test_R2", ascending=False)
print(df_results)

print("\nBest Model:", best_model_name)

# ============================================================
# 12. Save Best Model + Metadata
# ============================================================

joblib.dump(best_pipeline, os.path.join(MODELS_DIR, "best_model.pkl"))

meta = {
    "best_model": best_model_name,
    "features": features,
    "categorical": categorical,
    "numeric": numeric,
    "amenity_flags": amenity_flags
}

with open(os.path.join(MODELS_DIR, "model_meta.json"), "w") as f:
    json.dump(meta, f, indent=2)

print("\nSaved BEST model:", best_model_name)
print("Files saved to:", MODELS_DIR)

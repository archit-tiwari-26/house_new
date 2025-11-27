# backend/model_loader.py
import joblib
import json
import numpy as np
import pandas as pd
import os
from typing import Dict, Any

# --------------------------
# Paths (relative to this file)
# --------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")
META_PATH = os.path.join(BASE_DIR, "models", "model_meta.json")
DATA_PATH = os.path.join(BASE_DIR, "data", "delhi_housing_synthetic.csv")  # optional, used by analytics

# --------------------------
# Global holders
# --------------------------
model = None
meta = None
FEATURES = []
CATEGORICAL = []
NUMERIC = []
AMENITY_FLAGS = []
df_global = None

# --------------------------
# Load model and metadata
# --------------------------
def _load_model_and_meta():
    global model, meta, FEATURES, CATEGORICAL, NUMERIC, AMENITY_FLAGS

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}. Run training to create best_model.pkl")

    if not os.path.exists(META_PATH):
        raise FileNotFoundError(f"Model metadata not found at {META_PATH}. Make sure model_meta.json exists")

    # load model
    try:
        model_local = joblib.load(MODEL_PATH)
    except Exception as e:
        raise RuntimeError(f"Failed to load model from {MODEL_PATH}: {e}")

    # load meta
    try:
        with open(META_PATH, "r") as f:
            meta_local = json.load(f)
    except Exception as e:
        raise RuntimeError(f"Failed to load meta from {META_PATH}: {e}")

    # basic validation
    if "features" not in meta_local:
        raise KeyError("model_meta.json missing 'features' key")

    # assign globals
    model = model_local
    meta = meta_local
    FEATURES = meta_local.get("features", [])
    CATEGORICAL = meta_local.get("categorical", [])
    NUMERIC = meta_local.get("numeric", [])
    AMENITY_FLAGS = meta_local.get("amenity_flags", [])

# load once at import-time (fail fast)
_load_model_and_meta()

# --------------------------
# Load dataset (optional)
# --------------------------
def _load_dataset():
    global df_global
    if os.path.exists(DATA_PATH):
        try:
            df_global = pd.read_csv(DATA_PATH)
        except Exception:
            # If dataset is malformed, keep df_global as None but don't crash
            df_global = None
    else:
        df_global = None

_load_dataset()

# --------------------------
# Helpers
# --------------------------
def get_model_metadata() -> Dict[str, Any]:
    """Return loaded model metadata (safe copy)."""
    return meta.copy() if meta is not None else {}

def get_df():
    """Return loaded dataframe (or None)."""
    return df_global

# --------------------------
# Preprocessing for single-row prediction
# --------------------------
def preprocess_single_row(data_dict: Dict[str, Any]) -> pd.DataFrame:
    """
    Prepare a single input dict into a dataframe with same columns & dtypes expected by model.
    - Fills missing columns with sensible defaults (0 or 'Unknown')
    - Converts numeric-like strings to numeric types
    - Builds Amenities_count and amenity flags
    - Returns dataframe with columns ordered as FEATURES
    """
    if not isinstance(data_dict, dict):
        raise ValueError("Input must be a dict of feature->value")

    # start with a DataFrame with the user's keys (so pandas infers dtypes)
    df = pd.DataFrame([data_dict])

    # Ensure all expected columns exist in the df (so indexing later won't KeyError)
    for col in FEATURES:
        if col not in df.columns:
            # fill with 0 for simplicity; categorical columns will be converted to "Unknown" below
            df[col] = 0

    # ---- Amenities parsing ----
    # create Amenities_count and flags for known amenity keywords
    try:
        raw_amenities = data_dict.get("Amenities", "")
        if isinstance(raw_amenities, str) and raw_amenities.strip() != "":
            ams = [a.strip().lower() for a in raw_amenities.split(",") if a.strip() != ""]
        elif isinstance(raw_amenities, (list, tuple)):
            ams = [str(a).strip().lower() for a in raw_amenities]
        else:
            ams = []
    except Exception:
        ams = []

    df["Amenities_count"] = len(ams)
    for f in AMENITY_FLAGS:
        df[f"has_{f}"] = 1 if f in ams else 0

    # ---- Numeric columns: coerce strings to numbers and fillna with median/0 ----
    for col in NUMERIC:
        # attempt conversion
        df[col] = pd.to_numeric(df[col], errors="coerce")
        # if entire column is NaN, fill with 0 else median
        if df[col].isna().all():
            df[col] = df[col].fillna(0)
        else:
            df[col] = df[col].fillna(df[col].median())

    # ---- Categorical columns: ensure string and fill missing ----
    for col in CATEGORICAL:
        df[col] = df[col].astype(str).fillna("Unknown")

    # Reorder columns to match FEATURES exactly. If some FEATURES are missing still, create them as 0.
    for col in FEATURES:
        if col not in df.columns:
            df[col] = 0

    df = df[FEATURES].copy()

    return df

# --------------------------
# Predict price
# --------------------------
def predict_price(data_dict: Dict[str, Any]) -> float:
    """
    Accept a single-row input dict, preprocess and return predicted price (float).
    """
    if model is None:
        raise RuntimeError("Model not loaded")

    processed = preprocess_single_row(data_dict)

    # model.predict expects 2D array-like
    try:
        preds = model.predict(processed)
    except Exception as e:
        # include a helpful message
        raise RuntimeError(f"Model prediction failed: {e}")

    # return the first prediction as float
    return float(np.array(preds).ravel()[0])

# --------------------------
# Optional: reload model (useful in dev)
# --------------------------
def reload_model():
    _load_model_and_meta()
    _load_dataset()
    return True

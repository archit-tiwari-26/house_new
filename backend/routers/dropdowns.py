import pandas as pd
from fastapi import APIRouter

DF_PATH = "data/delhi_housing_synthetic.csv"
df = pd.read_csv(DF_PATH)

router = APIRouter()

@router.get("/")
def get_dropdown_values():
    response = {
        "Locality": sorted(df["Locality"].dropna().unique().tolist()),
        "Property_Type": sorted(df["Property_Type"].dropna().unique().tolist()),
        "Furnished_Status": sorted(df["Furnished_Status"].dropna().unique().tolist()),
        "Parking_Space": sorted(df["Parking_Space"].dropna().unique().tolist()),
        "Facing": sorted(df["Facing"].dropna().unique().tolist()),
        "Owner_Type": sorted(df["Owner_Type"].dropna().unique().tolist()),
        "Availability_Status": sorted(df["Availability_Status"].dropna().unique().tolist()),
        
        # Numeric ranges
        "BHK": sorted(df["BHK"].dropna().unique().tolist()),
        "Size_in_SqFt": sorted(df["Size_in_SqFt"].dropna().unique().tolist()),
        "Floor_No": sorted(df["Floor_No"].dropna().unique().tolist()),
        "Total_Floors": sorted(df["Total_Floors"].dropna().unique().tolist()),
        "Age_of_Property": sorted(df["Age_of_Property"].dropna().unique().tolist()),
        "Nearby_Schools": sorted(df["Nearby_Schools"].dropna().unique().tolist()),
        "Nearby_Hospitals": sorted(df["Nearby_Hospitals"].dropna().unique().tolist()),
        "Public_Transport_Accessibility": sorted(df["Public_Transport_Accessibility"].dropna().unique().tolist()),
        "Security": [0, 1],

        # Amenities list
        "Amenities": sorted(
            list(
                set(
                    am.strip().lower()
                    for sublist in df["Amenities"].fillna("").str.split(",")
                    for am in sublist if am.strip() != ""
                )
            )
        ),
    }

    return response

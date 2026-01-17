import pandas as pd

# Load both files
categorized = pd.read_csv("./data/product_info_categorized.csv")
complete = pd.read_csv("./data/product_info_complete.csv")

# Keep only name + ingredients from the source
ingredients_map = categorized[["name", "ingredients"]]

# Merge ingredients back into complete
complete = complete.merge(
    ingredients_map,
    on="name",
    how="left",
    suffixes=("", "_restored")
)

# If an ingredients column already exists but is empty, overwrite it
if "ingredients_restored" in complete.columns:
    complete["ingredients"] = complete["ingredients"].fillna(
        complete["ingredients_restored"]
    )
    complete.drop(columns=["ingredients_restored"], inplace=True)

# Save
complete.to_csv("./data/product_info_complete.csv", index=False)

print("✅ Ingredients column restored successfully")

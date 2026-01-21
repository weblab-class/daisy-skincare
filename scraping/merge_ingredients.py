import pandas as pd

categorized = pd.read_csv("./data/product_info_categorized.csv")
complete = pd.read_csv("./data/product_info_complete.csv")

ingredients_map = categorized[["name", "ingredients"]]

complete = complete.merge(
    ingredients_map,
    on="name",
    how="left",
    suffixes=("", "_restored")
)

if "ingredients_restored" in complete.columns:
    complete["ingredients"] = complete["ingredients"].fillna(
        complete["ingredients_restored"]
    )
    complete.drop(columns=["ingredients_restored"], inplace=True)

# Save
complete.to_csv("./data/product_info_complete.csv", index=False)

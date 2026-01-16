import pandas as pd
import re

df = pd.read_csv("data/product_info_cleaned.csv")

def clean_highlighted(text):
    if pd.isna(text):
        return text

    # 1️⃣ Stop once ingredients list starts
    cutoff_patterns = [
        r"\bWater/Aqua/Eau\b",
        r"\bWater\b",
        r"\bIngredients\b"
    ]

    cutoff_regex = re.compile("|".join(cutoff_patterns), re.I)
    match = cutoff_regex.search(text)
    if match:
        text = text[:match.start()]

    # 2️⃣ Extract dash-prefixed highlighted ingredients ONLY
    highlights = re.findall(r"-\s*[^.]+?\.", text)
    return " ".join(h.strip() for h in highlights)

df["highlighted_ingredients"] = df["highlighted_ingredients"].apply(clean_highlighted)

df.to_csv("data/product_info_cleaned.csv", index=False)

print("✅ highlighted_ingredients cleaned correctly")

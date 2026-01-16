import pandas as pd
from fuzzywuzzy import fuzz, process

df = pd.read_csv('./data/product_info_final.csv')

'''
main categories: moisturizers, lip balms & treatments, treatments, masks, cleansers, sunscreens, eye care

subcategories
moisturizer: face cream, mists & essences, night creams, face oils, decollete & neck creams
lip balms & treatments: no sub (just put lip balms & treatments)
treatments: face serums, blemish & acne treatmets, facial peels, exfoliators, toners
masks: no sub
cleansers: makeup removers, face wash & cleasers, face wipes
sunscreens: spf over 30, spf 30 and under
eye care: eye masks, eye creams & treatments

'''

categories = {
    "moisturizers": {
        "face cream": ["face cream", "cream", "moisturizer", "hydrating cream"],
        "mists & essences": ["mist", "essence", "facial spray"],
        "night creams": ["night cream", "overnight cream"],
        "face oils": ["face oil", "facial oil"],
        "decollete & neck creams": ["neck cream", "décolleté", "neck & chest"]
    },

    "lip balms & treatments": {
        "lip balms & treatments": ["lip balm", "lip treatment", "lip mask", "lip oil", "lip scrub"]
    },

    "treatments": {
        "face serums": ["serum", "ampoule", "booster"],
        "blemish & acne treatments": ["acne", "blemish", "spot treatment"],
        "facial peels": ["peel", "peeling"],
        "exfoliators": ["exfoliant", "exfoliating", "aha", "bha", "scrub"],
        "toners": ["toner", "tonic"]
    },

    "masks": {
        "masks": ["mask", "sheet mask", "clay mask", "sleeping mask", "overnight mask"]
    },

    "cleansers": {
        "makeup removers": ["makeup remover", "micellar"],
        "face wash & cleansers": ["cleanser", "cleansing", "face wash"],
        "face wipes": ["wipe", "cleansing wipe"]
    },

    "sunscreens": {
        "spf over 30": ["spf 40", "spf 45", "spf 50", "spf 60", "spf 70"],
        "spf 30 and under": ["spf 15", "spf 20", "spf 30", "spf 35",]
    },

    "eye care": {
        "eye masks": ["eye mask"],
        "eye creams & treatments": ["eye cream", "eye serum", "eye gel", "eye treatment"]
    }
}


def categorize_product(name, threshold=70):
    if pd.isna(name) or not name:
        return "Unknown", "Unknown"

    name = name.lower()

    best_score = 0
    best_category = "Other"
    best_subcategory = None

    for category, subs in categories.items():
        for subcategory, keywords in subs.items():
            for kw in keywords:
                score = fuzz.token_set_ratio(kw, name)

                if kw in name:
                    score = 100

                if score > best_score:
                    best_score = score
                    best_category = category
                    best_subcategory = subcategory

    if best_score < threshold:
        return "Other", None

    return best_category, best_subcategory


df[['category', 'subcategory']] = df['name'].apply(
    lambda x: pd.Series(categorize_product(x))
)


df.to_csv('./data/product_info_final_categorized.csv', index=False)


other_products = df[df['category'] == 'Other']
print(f"\n saved'")

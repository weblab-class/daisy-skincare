import pandas as pd
from fuzzywuzzy import fuzz

df = pd.read_csv('./data/product_info_categorized.csv')

category_keywords = {
    'Cleanser': [
        'cleanser', 'cleansing', 'face wash', 'facial wash', 'gel cleanser',
        'foam cleanser', 'cleansing balm', 'cleansing oil', 'makeup remover',
        'micellar water', 'exfoliating cleanser'
    ],
    'Moisturizer': [
        'moisturizer', 'cream', 'lotion', 'hydrating cream', 'face cream',
        'day cream', 'night cream', 'gel cream', 'water cream', 'hydrator',
        'moisturising', 'moisturising cream'
    ],
    'Serum': [
        'serum', 'essence', 'concentrate', 'treatment', 'ampoule',
        'booster', 'facial oil serum'
    ],
    'Face Mask': [
        'mask', 'face mask', 'sheet mask', 'clay mask', 'sleeping mask',
        'overnight mask', 'peel-off mask', 'gel mask'
    ],
    'Oil': [
        'facial oil', 'face oil', 'oil', 'beauty oil', 'treatment oil',
        'nourishing oil', 'dry oil'
    ],
    'Toner': [
        'toner', 'tonic', 'refresher', 'mist', 'facial spray', 'essence water'
    ],
    'Eye Care': [
        'eye cream', 'eye serum', 'eye gel', 'under eye', 'eye treatment',
        'eye balm', 'eye mask'
    ],
    'Lip Care': [
        'lip', 'lip balm', 'lip treatment', 'lip mask', 'lip oil',
        'lip scrub', 'lip gloss'
    ],
    'Body': [
        'body lotion', 'body cream', 'body oil', 'body wash', 'body scrub',
        'body butter', 'hand cream', 'foot cream'
    ],
    'Exfoliator': [
        'exfoliant', 'exfoliating', 'scrub', 'peel', 'aha', 'bha',
        'chemical exfoliant', 'physical exfoliant'
    ],
    'Neck & Décolleté': [
        'neck cream', 'neck serum', 'décolleté', 'neck and chest',
        'neck treatment', 'jawline'
    ]
}

subcategory_keywords = {
    'Sunscreen': ['sunscreen', 'spf', 'sun protection', 'uv protection', 'broad spectrum'],
    'Anti-Aging': ['anti-aging', 'anti aging', 'wrinkle', 'fine lines', 'peptide', 'retinol', 'firming', 'lifting'],
    'Brightening': ['brightening', 'dark spot', 'vitamin c', 'hyperpigmentation', 'even tone', 'radiance'],
    'Acne': ['acne', 'blemish', 'breakout', 'salicylic', 'spot treatment', 'clarifying'],
    'Hydrating': ['hydrating', 'hydration', 'hyaluronic', 'moisture', 'plumping', 'quenching'],
    'Soothing': ['soothing', 'calming', 'sensitive', 'redness', 'barrier repair', 'ceramide'],
    'Exfoliating': ['exfoliating', 'aha', 'bha', 'glycolic', 'lactic', 'peel', 'resurfacing'],
    'Pore Care': ['pore', 'minimizing', 'refining', 'tightening pores'],
    'Oil Control': ['oil control', 'mattifying', 'sebum', 'shine control'],
    'Nourishing': ['nourishing', 'rich', 'intensive', 'repair', 'restorative'],
}

def categorize_product(product_name, fuzzy_threshold=70):
    if pd.isna(product_name) or product_name == '':
        return 'Unknown'

    product_name_lower = product_name.lower()

    best_score = 0
    best_category = 'Other'

    for category, keywords in category_keywords.items():
        for keyword in keywords:
            score = fuzz.token_set_ratio(keyword, product_name_lower)

            # Boost for exact substring match
            if keyword in product_name_lower:
                score = max(score, 95)

            if score > best_score:
                best_score = score
                best_category = category

    if best_score >= fuzzy_threshold:
        return best_category
    else:
        return 'Other'

def get_subcategories(product_name, fuzzy_threshold=65):
    if pd.isna(product_name) or product_name == '':
        return ''

    product_name_lower = product_name.lower()
    matching_subcategories = []


    for subcategory, keywords in subcategory_keywords.items():
        for keyword in keywords:
            score = fuzz.token_set_ratio(keyword, product_name_lower)

            if keyword in product_name_lower:
                score = max(score, 95)

            if score >= fuzzy_threshold:
                matching_subcategories.append(subcategory)
                break  # Don't add same subcategory twice

    return ', '.join(matching_subcategories) if matching_subcategories else ''

print("Categorizing products...")
df['category'] = df['name'].apply(categorize_product)
df['subcategory'] = df['name'].apply(get_subcategories)

df.to_csv('./data/product_info_categorized.csv', index=False)


subcats = df['subcategory'].str.split(', ').explode()
subcats = subcats[subcats != '']
if len(subcats) > 0:
    print(subcats.value_counts())
else:
    print("No subcategories assigned")


for idx, row in df.head(15).iterrows():
    cat = row['category']
    subcat = row['subcategory'] if row['subcategory'] else '-'
    name = row['name'][:50] if pd.notna(row['name']) else 'Unknown'
    print(f"{cat:<20} | {subcat:<30} | {name}")


other_products = df[df['category'] == 'Other']
if len(other_products) > 0:
    for idx, row in other_products.iterrows():
        print(f"  - {row['name']}")
else:
    print("  None - all products categorized!")


no_subcat = df[df['subcategory'] == '']
if len(no_subcat) > 0:
    for idx, row in no_subcat.head(10).iterrows():
        print(f"  [{row['category']}] {row['name']}")
    if len(no_subcat) > 10:
        print(f"  ... and {len(no_subcat) - 10} more")
else:
    print("  All products have subcategories!")

print(f"\n✅ Saved to './data/product_info_subcategorized.csv'")
print(f"Total products processed: {len(df)}")

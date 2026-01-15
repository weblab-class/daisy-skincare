import pandas as pd
from fuzzywuzzy import fuzz, process

# Read the CSV
df = pd.read_csv('./data/product_info.csv')

# Define category keywords with their associated categories
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
    'Sunscreen': [
        'sunscreen', 'spf', 'sun protection', 'uv protection', 'broad spectrum'
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

def categorize_product(product_name, fuzzy_threshold=70):
    """
    Categorize a product based on its name using fuzzy matching.

    Args:
        product_name: The product name to categorize
        fuzzy_threshold: Minimum similarity score (0-100) to consider a match

    Returns:
        Category name or 'Other' if no match found
    """
    if pd.isna(product_name) or product_name == '':
        return 'Unknown'

    product_name_lower = product_name.lower()

    # Track best matches
    best_score = 0
    best_category = 'Other'

    # Check each category
    for category, keywords in category_keywords.items():
        for keyword in keywords:
            # Use token_set_ratio for better partial matching
            score = fuzz.token_set_ratio(keyword, product_name_lower)

            # Also check if keyword is directly in the name (exact substring match)
            if keyword in product_name_lower:
                score = max(score, 95)  # Boost score for exact substring matches

            if score > best_score:
                best_score = score
                best_category = category

    # Only assign category if confidence is above threshold
    if best_score >= fuzzy_threshold:
        return best_category
    else:
        return 'Other'

# Apply categorization
df['category'] = df['name'].apply(categorize_product)

# Save the updated CSV
df.to_csv('./data/product_info_categorized.csv', index=False)

# Print category distribution
print("\n=== Category Distribution ===")
print(df['category'].value_counts())

print("\n=== Sample Categorizations ===")
for idx, row in df.head(15).iterrows():
    print(f"{row['category']:20} | {row['name'][:60]}")

# Show products categorized as 'Other' for review
print("\n=== Products Categorized as 'Other' ===")
other_products = df[df['category'] == 'Other']
if len(other_products) > 0:
    for idx, row in other_products.iterrows():
        print(f"  - {row['name']}")
else:
    print("  None!")

print(f"\n✅ Saved to './data/product_info_categorized.csv'")

import pandas as pd
import re

# Read the CSV
df = pd.read_csv('./data/product_info_complete.csv')

print("Cleaning up data...")
print("="*80)

# ===== CLEAN SIZE COLUMN =====
def clean_size(size):
    """Clean and standardize size format to 'fl. oz / mL' or 'oz / g'"""
    if pd.isna(size) or size == '':
        return ''

    # Remove "Size:" prefix and extra whitespace
    size = re.sub(r'^Size:\s*', '', size, flags=re.IGNORECASE)
    size = size.strip()

    # Detect if it's a liquid (has mL or ml) or solid (has g)
    has_ml = bool(re.search(r'\bm[lL]\b', size))
    has_grams = bool(re.search(r'\bg\b', size, flags=re.IGNORECASE))

    # Extract numbers and units
    # Pattern to match various formats like "1.7 oz/50 mL", "30g / 1 oz", etc.

    if has_ml:
        # It's a liquid - format as "X fl. oz / Y mL"

        # Extract oz value
        oz_match = re.search(r'([\d.]+)\s*(?:fl\.?\s*)?oz', size, flags=re.IGNORECASE)
        oz_value = oz_match.group(1) if oz_match else None

        # Extract mL value
        ml_match = re.search(r'([\d.]+)\s*m[lL]', size)
        ml_value = ml_match.group(1) if ml_match else None

        if oz_value and ml_value:
            return f"{oz_value} fl. oz / {ml_value} mL"
        elif oz_value:
            return f"{oz_value} fl. oz"
        elif ml_value:
            return f"{ml_value} mL"

    elif has_grams:
        # It's a solid/powder - format as "X oz / Y g"

        # Extract oz value (remove "fl." if present)
        oz_match = re.search(r'([\d.]+)\s*(?:fl\.?\s*)?oz', size, flags=re.IGNORECASE)
        oz_value = oz_match.group(1) if oz_match else None

        # Extract g value
        g_match = re.search(r'([\d.]+)\s*g\b', size, flags=re.IGNORECASE)
        g_value = g_match.group(1) if g_match else None

        if oz_value and g_value:
            return f"{oz_value} oz / {g_value} g"
        elif oz_value:
            return f"{oz_value} oz"
        elif g_value:
            return f"{g_value} g"

    else:
        # No ml or g found - might be just oz, or other units
        # Standardize oz format
        size = re.sub(r'\bfl\.?\s*oz\b', 'fl. oz', size, flags=re.IGNORECASE)
        size = re.sub(r'\boz\b', 'oz', size, flags=re.IGNORECASE)

        # Clean up slashes and spaces
        size = re.sub(r'\s*/\s*', ' / ', size)
        size = re.sub(r'\s+', ' ', size)

        return size.strip()

    # Fallback
    return size

df['size'] = df['size'].apply(clean_size)
print("✓ Cleaned and standardized size column")

# ===== SPLIT INGREDIENTS COLUMN =====
def extract_highlighted_ingredients(ingredients_text):
    """Extract text that starts with dashes (highlighted ingredients)"""
    if pd.isna(ingredients_text) or ingredients_text == '':
        return ''

    # Find all lines that start with dash
    highlighted = []
    lines = ingredients_text.split('\n')

    for line in lines:
        line = line.strip()
        if line.startswith('-'):
            highlighted.append(line)
        else:
            # Stop when we hit the actual ingredient list
            if highlighted:  # If we've already found some highlighted ingredients
                break

    return ' '.join(highlighted)

def extract_actual_ingredients(ingredients_text):
    """Extract the actual chemical ingredient list (after the highlighted ones)"""
    if pd.isna(ingredients_text) or ingredients_text == '':
        return ''

    # Split by the pattern: ingredient name starting with capital letter after a period or dash section
    # Look for the part that starts with chemical names (Water, Aqua, etc.)

    # First, try to find where highlighted ingredients end
    match = re.search(r'(-[^-]+?:\s*.+?\.?\s*)+(Water|Aqua|[A-Z][a-z]+\s+[A-Z])', ingredients_text, re.DOTALL)

    if match:
        # Get everything from the chemical ingredient start
        start_pos = match.end() - len(match.group(2))
        actual_ingredients = ingredients_text[start_pos:].strip()

        # Remove any remaining dash-prefixed text at the start
        actual_ingredients = re.sub(r'^-[^-]+?:\s*.+?\.\s*', '', actual_ingredients, flags=re.DOTALL)

        return actual_ingredients.strip()
    else:
        # If no highlighted ingredients found, return as-is
        # But check if it starts with dashes - if not, it's probably all actual ingredients
        if not ingredients_text.strip().startswith('-'):
            return ingredients_text.strip()
        return ''

df['highlighted_ingredients_from_full'] = df['ingredients'].apply(extract_highlighted_ingredients)
df['ingredients_cleaned'] = df['ingredients'].apply(extract_actual_ingredients)

# Update the ingredients column
df['ingredients'] = df['ingredients_cleaned']
df.drop('ingredients_cleaned', axis=1, inplace=True)

# Merge highlighted ingredients (prefer the new extraction, fallback to existing column)
if 'highlighted_ingredients' in df.columns:
    df['highlighted_ingredients'] = df.apply(
        lambda row: row['highlighted_ingredients_from_full'] if row['highlighted_ingredients_from_full']
        else row['highlighted_ingredients'],
        axis=1
    )
else:
    df['highlighted_ingredients'] = df['highlighted_ingredients_from_full']

df.drop('highlighted_ingredients_from_full', axis=1, inplace=True)
print("✓ Split ingredients into highlighted and actual ingredients")

# ===== CLEAN WHAT_IT_IS COLUMN =====
def clean_what_it_is(text):
    """Remove 'What it is:' prefix"""
    if pd.isna(text) or text == '':
        return ''

    # Remove "What it is:" at the beginning
    text = re.sub(r'^What it is:\s*', '', text, flags=re.IGNORECASE)

    return text.strip()

if 'what_it_is' in df.columns:
    df['what_it_is'] = df['what_it_is'].apply(clean_what_it_is)
    print("✓ Cleaned 'what_it_is' column")

# ===== CLEAN SKIN_TYPE COLUMN =====
def clean_skin_type(text):
    """Remove 'Skin Type:' prefix"""
    if pd.isna(text) or text == '':
        return ''

    # Remove "Skin Type:" at the beginning
    text = re.sub(r'^Skin Type:\s*', '', text, flags=re.IGNORECASE)

    return text.strip()

if 'skin_type' in df.columns:
    df['skin_type'] = df['skin_type'].apply(clean_skin_type)
    print("✓ Cleaned 'skin_type' column")

# ===== CLEAN SKINCARE_CONCERNS COLUMN =====
def clean_skincare_concerns(text):
    """Remove 'Skincare Concerns:' prefix"""
    if pd.isna(text) or text == '':
        return ''

    # Remove "Skincare Concerns:" at the beginning
    text = re.sub(r'^Skincare Concerns:\s*', '', text, flags=re.IGNORECASE)

    return text.strip()

if 'skincare_concerns' in df.columns:
    df['skincare_concerns'] = df['skincare_concerns'].apply(clean_skincare_concerns)
    print("✓ Cleaned 'skincare_concerns' column")

# Save the cleaned CSV
df.to_csv('./data/product_info_cleaned.csv', index=False)

print("\n" + "="*80)
print("CLEANING SUMMARY")
print("="*80)

# Show samples
print("\n--- SIZE FORMATTING EXAMPLES ---")
for idx in range(min(10, len(df))):
    if df.loc[idx, 'size']:
        print(f"  {df.loc[idx, 'size']}")

print("\n--- HIGHLIGHTED INGREDIENTS EXAMPLES ---")
for idx in range(min(3, len(df))):
    highlighted = df.loc[idx, 'highlighted_ingredients']
    if highlighted:
        print(f"  {highlighted[:100]}...")

print("\n--- ACTUAL INGREDIENTS EXAMPLES ---")
for idx in range(min(3, len(df))):
    ingredients = df.loc[idx, 'ingredients']
    if ingredients:
        print(f"  {ingredients[:100]}...")

if 'what_it_is' in df.columns:
    print("\n--- WHAT IT IS EXAMPLES ---")
    for idx in range(min(3, len(df))):
        what_it_is = df.loc[idx, 'what_it_is']
        if what_it_is:
            print(f"  {what_it_is[:100]}...")

if 'skin_type' in df.columns:
    print("\n--- SKIN TYPE EXAMPLES ---")
    for idx in range(min(5, len(df))):
        skin_type = df.loc[idx, 'skin_type']
        if skin_type:
            print(f"  {skin_type}")

if 'skincare_concerns' in df.columns:
    print("\n--- SKINCARE CONCERNS EXAMPLES ---")
    for idx in range(min(5, len(df))):
        concerns = df.loc[idx, 'skincare_concerns']
        if concerns:
            print(f"  {concerns}")

print(f"\n✅ Saved cleaned data to './data/product_info_cleaned.csv'")
print(f"Total products: {len(df)}")

# import requests
# from bs4 import BeautifulSoup
# import pandas as pd

# # Fetch the webpage content
# url = requests.get("https://www.sephora.my/categories/skincare?currentPage=2")
# soup = BeautifulSoup(url.text, 'html.parser')

# # Find all product cards
# product_cards = soup.find_all('div', class_='product-card')

# # Initialize empty lists to store product details
# names = []
# prices = []
# image_urls = []
# labels = []
# stars = []  # This should be a list to append the ratings
# reviews_count = []
# variants_count = []
# brands = []

# for product in product_cards:
#     # Extract product details
#     product_name = product.find('div', class_='product-name').text.strip() if product.find('div', class_='product-name') else 'N/A'
#     product_price = product.find('div', class_='prices').text.strip() if product.find('div', class_='prices') else 'N/A'
#     product_image_url = product.find('a', class_='product-card-image-link').get('href') if product.find('a', class_='product-card-image-link') else 'N/A'
#     label = product.find('div', class_='labels').text.strip() if product.find('div', class_='labels') else 'N/A'
#     star_style = product.find('div', class_='stars').get('style') if product.find('div', class_='stars') else 'N/A'
#     reviews_count_text = product.find('span', class_='reviews-count').text.strip() if product.find('span', class_='reviews-count') else 'N/A'
#     variants_count_text = product.find('div', class_='variants-count').text.strip() if product.find('div', class_='variants-count') else 'N/A'
#     brand = product.find('div', class_='brand').text.strip() if product.find('div', class_='brand') else 'N/A'

#     # Append product details to the lists
#     names.append(product_name)
#     prices.append(product_price)
#     image_urls.append(product_image_url)
#     labels.append(label)
#     stars.append(star_style)  # Append the star rating
#     reviews_count.append(reviews_count_text)
#     variants_count.append(variants_count_text)
#     brands.append(brand)

# # Create a DataFrame to store the product details
# df = pd.DataFrame({
#     'Product Name': names,
#     'Price': prices,
#     'Image URL': image_urls,
#     'Label': labels,
#     'Stars': stars,
#     'Reviews Count': reviews_count,
#     'Variants Count': variants_count,
#     'Brand': brands
# })

# df.to_csv("./data/product_links.csv")

# # Display all records
import requests
import json
import pandas as pd
import os
from bs4 import BeautifulSoup

os.makedirs("data", exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9"
}

BASE_URL = "https://www.sephora.com/shop/skincare"

all_products = []
page = 1

while True:
    print(f"Fetching page {page}...")

    r = requests.get(
        BASE_URL,
        headers=HEADERS,
        params={"currentPage": page},
        timeout=20
    )
    print(r.status_code)
    print(r.text[:500])

    if r.status_code != 200:
        print("Blocked or failed request")
        break

    soup = BeautifulSoup(r.text, "html.parser")

    # Find embedded Next.js data
    script = soup.find("script", id="__NEXT_DATA__")
    if not script:
        print("No embedded JSON found — stopping")
        break

    data = json.loads(script.string)

    # Navigate JSON structure
    products = (
        data["props"]["pageProps"]["catalog"]["products"]
    )

    if not products:
        break

    for p in products:
        all_products.append({
            "product_id": p.get("productId"),
            "product_name": p.get("displayName"),
            "brand": p.get("brandName"),
            "price": p.get("currentSku", {}).get("listPrice"),
            "rating": p.get("rating"),
            "reviews": p.get("reviews")
        })

    page += 1

# Save results
df = pd.DataFrame(all_products)
df.to_csv("data/us_skincare_products.csv", index=False)

print(f"Saved {len(df)} products")

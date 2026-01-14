import time
import requests
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://www.sephora.my"
CATEGORY_URL = "https://www.sephora.my/categories/skincare"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

OUTPUT_FILE = "data/sephora_my_skincare_products.csv"


def scrape_page(page_num: int):
    url = f"{CATEGORY_URL}?page={page_num}"
    response = requests.get(url, headers=HEADERS, timeout=20)

    if response.status_code != 200:
        print(f"⚠️ Page {page_num}: HTTP {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    cards = soup.find_all("div", class_="product-card")

    products = []

    for card in cards:
        name = card.find("div", class_="product-name")
        brand = card.find("div", class_="brand")
        price = card.find("div", class_="prices")
        link = card.find("a", class_="product-card-image-link")

        if not link:
            continue

        product_url = urljoin(BASE_URL, link["href"])
        slug = product_url.rstrip("/").split("/")[-1]

        products.append({
            "name": name.text.strip() if name else None,
            "brand": brand.text.strip() if brand else None,
            "price": price.text.strip() if price else None,
            "my_url": product_url,
            "slug": slug
        })

    return products


def scrape_all_pages():
    all_products = []
    page = 1

    while True:
        print(f"📄 Scraping page {page}")
        products = scrape_page(page)

        if not products:
            print("✅ No more products found.")
            break

        all_products.extend(products)
        page += 1
        time.sleep(1.5)

    return pd.DataFrame(all_products)


if __name__ == "__main__":
    import os
    os.makedirs("data", exist_ok=True)

    df = scrape_all_pages()
    df.drop_duplicates(subset="slug", inplace=True)
    df.to_csv(OUTPUT_FILE, index=False)

    print(f"\n🎉 Saved {len(df)} skincare products to {OUTPUT_FILE}")

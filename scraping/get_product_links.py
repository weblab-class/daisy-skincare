import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
from urllib.parse import urlparse

from urllib.parse import urlparse

def build_skincare_urls(txt_path):
    skincare_urls = []

    with open(txt_path, "r") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue

            parsed = urlparse(line)
            parts = parsed.path.split("/")

            if len(parts) >= 3 and parts[1] == "brand":
                brand_slug = parts[2]
                skincare_url = f"https://www.sephora.com/brand/{brand_slug}/skincare"
                skincare_urls.append(skincare_url)

    return skincare_urls

def setup_driver():
    """Set up undetected Chrome driver."""
    options = uc.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')

    driver = uc.Chrome(options=options, use_subprocess=True)
    return driver


def click_show_more_until_all_loaded(driver, expected_total=2643):
    """
    Keep clicking 'Show More Products' button until all products are loaded.
    """
    click_count = 0

    while True:
        try:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight - 1000);")
            time.sleep(1)

            button = None

            try:
                buttons = driver.find_elements(By.TAG_NAME, "button")
                for btn in buttons:
                    if "show more" in btn.text.lower():
                        button = btn
                        break
            except:
                pass

            if not button:
                try:
                    button = driver.find_element(By.CSS_SELECTOR, "[data-at*='load_more']")
                except:
                    pass

            if not button:
                try:
                    button = driver.find_element(By.XPATH, "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'show more')]")
                except:
                    pass

            if button and button.is_displayed() and button.is_enabled():
                try:
                    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
                    time.sleep(0.5)
                    driver.execute_script("arguments[0].click();", button)
                    click_count += 1

                    time.sleep(3)

                    soup = BeautifulSoup(driver.page_source, 'html.parser')

                    results_text = soup.find('p', class_='css-1kuti8o')
                    if results_text:
                        text = results_text.get_text()
                        print(f'\rClicked {click_count} times | Current: {text}', end='')
                    else:
                        product_count = len([link for link in soup.find_all('a', href=True) if '/product/' in link['href']])
                        print(f'\rClicked {click_count} times | Products loaded: {product_count}/{expected_total}', end='')

                except Exception as e:
                    print(f"\nError clicking button: {e}")
                    break
            else:
                print(f"\nNo more 'Show More' button found or button is disabled")
                break

        except Exception as e:
            print(f"\nFinished loading (no more button found)")
            break

    return click_count


def scrape_all_skincare_products(driver):
    url_list = build_skincare_urls("/Users/sophiasong/Desktop/weblab project/ssong3200-erslaugh-gracec32/scraping/brand_link.txt")

    product_link = []

    for url in url_list:
        try:
            driver.get(url)
            time.sleep(5)

            soup = BeautifulSoup(driver.page_source, 'html.parser')
            results_text = soup.find('p', class_='css-1kuti8o')
            if results_text:
                print(f"Initial: {results_text.get_text()}\n")

            print("Clicking 'Show More Products' button...")
            clicks = click_show_more_until_all_loaded(driver, expected_total=2643)

            print(f"\n\nTotal 'Show More' clicks: {clicks}")
            print("Parsing all product links...")

            time.sleep(3)

            soup = BeautifulSoup(driver.page_source, 'html.parser')

            product_links = set()
            for link in soup.find_all('a', href=True):
                href = link['href']
                if '/product/' in href:
                    if href.startswith('http'):
                        full_url = href.split('?')[0].split('#')[0]
                    else:
                        full_url = f"https://www.sephora.com{href.split('?')[0].split('#')[0]}"
                    product_links.add(full_url)

            print(f"✓ Found {len(product_links)} unique product links")
            product_link.extend(list(product_links))

        except Exception as e:
            print(f"\n✗ Error: {e}")
            continue

    return product_link


def main():
    """Main scraping function."""
    os.makedirs('data', exist_ok=True)

    driver = setup_driver()

    try:
        # Scrape all products
        products = scrape_all_skincare_products(driver)

        if products:
            # Save results
            print(f"\n{'='*70}")
            print("SCRAPING COMPLETE")
            print(f"{'='*70}")
            print(f"Total unique products: {len(products)}")

            csv_path = 'data/skincare_product_links.csv'

            products = filter_existing_products(products, csv_path)

            if products:
                df = pd.DataFrame({'product_link': products})

                if os.path.exists(csv_path):
                    df.to_csv(csv_path, mode='a', header=False, index=False)
                else:
                    df.to_csv(csv_path, index=False)

                print(f"✓ Updated CSV: {csv_path}")
            else:
                print("No new products to add")


            with open('data/skincare_product_links.txt', 'w') as f:
                for link in products:
                    f.write(f"{link}\n")

            print(f"{'='*70}")
        else:
            print("\n No products collected")

    finally:
        print("\nClosing browser...")
        driver.quit()

def filter_existing_products(new_links, csv_path):
    """Remove product links that already exist in CSV."""
    if not os.path.exists(csv_path):
        return new_links

    existing_df = pd.read_csv(csv_path)
    if 'product_link' not in existing_df.columns:
        return new_links

    existing_links = set(existing_df['product_link'].dropna())
    filtered = [link for link in new_links if link not in existing_links]


    return filtered


if __name__ == "__main__":
    main()

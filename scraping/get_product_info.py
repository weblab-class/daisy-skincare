import re
import pandas as pd
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import os

def expand_all_accordions(driver):
    buttons = driver.find_elements(By.CSS_SELECTOR, 'button[data-at="accordion_button"]')
    for btn in buttons:
        try:
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", btn)
            time.sleep(0.2)
            if btn.get_attribute("aria-expanded") == "false":
                btn.click()
                time.sleep(0.4)
        except:
            pass

def get_data(product_link, driver):
    """Get product information including name, price, ingredients, and category"""
    data_dic = {
        'product_link': product_link,
        'product_name': None,
        'category': None,
        'price': None,
        'size_and_item': None,
        'ingredients': None
    }

    try:

        driver.get(product_link)
        time.sleep(4)

        expand_all_accordions(driver)

        time.sleep(1.5)
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        try:
            title_tag = soup.find('title')
            if title_tag:
                data_dic['product_name'] = title_tag.get_text(strip=True).replace(' | Sephora', '')

        except:
            pass

        try:
            breadcrumbs = soup.find_all('a', attrs={'data-at': 'pdp_bread_crumb'})
            if breadcrumbs:
                cat_list = [bc.get_text(strip=True) for bc in breadcrumbs]
                data_dic['category'] = cat_list[-1]
        except:
            pass

        try:
            price_tag = soup.find('b', class_='css-0')
            if price_tag:
                data_dic['price'] = price_tag.get_text(strip=True)
        except:
            data_dic['price'] = None

        try:
            size_box = soup.find(attrs={"data-comp": "SizeAndItemNumber Box "})
            if size_box:
                size_text = size_box.get_text(separator=' ', strip=True)
                data_dic['size_and_item'] = size_text
        except:
            data_dic['size_and_item'] = None


        try:
            ingredients_div = soup.find('div', id='ingredients')
            if ingredients_div:
                print("method 1")
                ingredients_text = ingredients_div.get_text(strip=True)
                data_dic['ingredients'] = ingredients_text


            if not data_dic['ingredients']:
                print("method 2")
                ingredients_section = soup.find(attrs={"data-comp": "Ingredients"})
                if ingredients_section:
                    data_dic['ingredients'] = ingredients_section.get_text(strip=True)

            if not data_dic['ingredients']:
                print("method 3")
                try:
                    buttons = driver.find_elements(By.TAG_NAME, "button")
                    for btn in buttons:
                        if 'ingredient' in btn.text.lower():
                            driver.execute_script("arguments[0].click();", btn)
                            time.sleep(2)

                            soup = BeautifulSoup(driver.page_source, 'html.parser')
                            ingredients_div = soup.find('div', id='ingredients')
                            if ingredients_div:
                                data_dic['ingredients'] = ingredients_div.get_text(strip=True)
                            break
                except:
                    pass

            if data_dic['ingredients']:
                ingredients = data_dic['ingredients']
                ingredients = re.sub(r'\s+', ' ', ingredients)
                ingredients = re.sub(r'^Ingredients:?\s*', '', ingredients, flags=re.IGNORECASE)
                ingredients = ingredients.replace('<br>', ', ')
                ingredients = re.sub(r'The list of ingredients.*$', '', ingredients, flags=re.IGNORECASE)
                data_dic['ingredients'] = ingredients.strip()

        except Exception as e:
            print(f"  Ingredients error: {e}")

        # Summary
        has_ingredients = "✓" if data_dic['ingredients'] else "✗"
        name_preview = data_dic['product_name'][:30] if data_dic['product_name'] else "N/A"
        print(f"  ✓ {name_preview}... | Ingr: {has_ingredients}")
        return data_dic

    except Exception as e:
        print(f"Error: {e}")
        return data_dic


def main():
    """Main scraping function"""
    os.makedirs('data', exist_ok=True)

    product_links = ["https://www.sephora.com/product/lip-sleeping-mask-P420652?skuId=2895316"]

    print(f"Total products to scrape: {len(product_links)}\n")

    result = []

    # Check for existing progress
    try:
        existing_df = pd.read_csv('data/pd_info.csv')
        result = existing_df.to_dict('records')
        start_index = len(result)
        print(f"✓ Resuming from product {start_index + 1}\n")
    except:
        start_index = 0
        print("Starting fresh\n")

    # Setup driver
    print("Setting up Chrome driver...")

    try:
        driver = uc.Chrome()
    except:
        options = uc.ChromeOptions()
        driver = uc.Chrome(options=options)

    time.sleep(3)

    try:
        try:
            page_source = driver.page_source
            if 'access denied' in page_source.lower():
                print("\n Access denied. Try using a VPN.")
                driver.quit()
                return
        except Exception as e:
            print(f"\nError: {e}")
            driver.quit()
            return

        print("✓ Access granted\n")

        for i, link in enumerate(product_links[start_index:], start=start_index):
            print(f'[{i + 1}/{len(product_links)}]', end=' ')

            data = get_data(link, driver)
            result.append(data)

            if (i + 1) % 5 == 0:
                pd_df = pd.DataFrame(result)
                pd_df.to_csv('data/pd_info.csv', index=False)

            time.sleep(2)

        pd_df = pd.DataFrame(result)
        pd_df.to_csv('data/pd_info.csv', index=False)

        print(f"\n{'='*70}")
        print(f"SCRAPING COMPLETE")
        print(f"{'='*70}")
        print(f"Total products: {len(result)}")

        with_name = sum(1 for r in result if r['product_name'])
        with_price = sum(1 for r in result if r['price'])
        with_ingredients = sum(1 for r in result if r['ingredients'])
        with_category = sum(1 for r in result if r['category'])

        print(f"\nData completeness:")
        print(f"  Names: {with_name}/{len(result)}")
        print(f"  Prices: {with_price}/{len(result)}")
        print(f"  Categories: {with_category}/{len(result)}")
        print(f"  Ingredients: {with_ingredients}/{len(result)}")
        print(f"\nSaved to: data/pd_info.csv")

    except Exception as e:
        print(f"\nFatal error: {e}")
        if result:
            pd_df = pd.DataFrame(result)
            pd_df.to_csv('data/pd_info.csv', index=False)
            print(f"Saved {len(result)} products before crash")

    finally:
        try:
            driver.quit()
        except:
            pass


if __name__ == "__main__":
    main()

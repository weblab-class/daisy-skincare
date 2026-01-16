import pandas as pd
import re
import time
from bs4 import BeautifulSoup

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# =========================
# Load CSV
# =========================
df = pd.read_csv('./data/product_info_categorized.csv')
OUTPUT_PATH = "./data/product_info_complete.csv"


# =========================
# Stealth Chrome (REAL)
# =========================
options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--start-maximized")
options.add_argument(
    "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)

driver = uc.Chrome(options=options)
wait = WebDriverWait(driver, 20)

def extract_section(soup, label):
    label_re = re.compile(rf"^{label}\s*:?", re.I)

    strong = soup.find("strong", string=label_re)
    if strong:
        texts = []
        for elem in strong.next_elements:
            if elem == strong:
                continue
            if getattr(elem, "name", None) == "strong":
                break
            if isinstance(elem, str):
                t = elem.strip()
                if t:
                    texts.append(t)
        return " ".join(texts).strip()

    for b in soup.find_all("b"):
        if label_re.match(b.get_text(strip=True)):
            collected = []
            for sib in b.next_siblings:
                if getattr(sib, "name", None) == "b":
                    break
                if isinstance(sib, str):
                    t = sib.strip()
                    if t:
                        collected.append(t)
            return " ".join(collected).strip()

    return ""



def extract_main_image(soup):
    # Most reliable selector
    img = soup.select_one('[data-at="product_image"] img')
    if img:
        srcset = img.get("srcset", "")
        if srcset:
            return srcset.split(",")[-1].split(" ")[0]
        return img.get("src", "")

    # Fallback: any product image
    img = soup.select_one('img[src*="productimages"]')
    return img.get("src", "") if img else ""



for i, row in df.iloc[81:82].iterrows():
    url = row['url']
    print(f"[{i+1}/{len(df)}] {url}")

    data = {
        "what_it_is": "",
        "skin_type": "",
        "skincare_concerns": "",
        "main_image_url": ""
    }

    try:
        driver.get(url)

        try:
            wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, 'h2[data-at="about_the_product_title"]')
                )
            )
        except TimeoutException:
            print("  ⚠ About section not found")
            continue

        time.sleep(2)
        soup = BeautifulSoup(driver.page_source, "html.parser")


        data["main_image_url"] = extract_main_image(soup)
        if data["main_image_url"]:
            print(f"  ✓ Image: {data['main_image_url']}...")

        # about the product section
        data["what_it_is"] = extract_section(soup, "What it is")
        data["skin_type"] = extract_section(soup, "Skin Type")
        data["skincare_concerns"] = extract_section(soup, "Skincare Concerns")


    except Exception as e:
        print(f"Error: {e}")

    # add to dataframe
    df.at[i, "what_it_is"] = data["what_it_is"]
    df.at[i, "skin_type"] = data["skin_type"]
    df.at[i, "skincare_concerns"] = data["skincare_concerns"]
    df.at[i, "main_image_url"] = data["main_image_url"]

    # save every 40
    if (i + 1) % 40 == 0:
        df.to_csv(OUTPUT_PATH, index=False)
        print(f" Checkpoint saved at {i+1} products")


    print(" Saved progress")
    time.sleep(1.2)

driver.quit()


df.to_csv(OUTPUT_PATH, index=False)

print("\n Saved to ./data/product_info_complete.csv")

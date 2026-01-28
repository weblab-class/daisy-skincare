// server/scrapers/brandWebsite.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// Common brand website patterns
const BRAND_WEBSITES = {
  'cerave': 'https://www.cerave.com',
  'la roche-posay': 'https://www.laroche-posay.us',
  'la roche posay': 'https://www.laroche-posay.us',
  'the ordinary': 'https://theordinary.com',
  'drunk elephant': 'https://www.drunkelephant.com',
  'youth to the people': 'https://www.youthtothepeople.com',
  'glossier': 'https://www.glossier.com',
  'paula\'s choice': 'https://www.paulaschoice.com',
  'paulas choice': 'https://www.paulaschoice.com',
  'tatcha': 'https://www.tatcha.com',
  'fresh': 'https://www.fresh.com',
  'summer fridays': 'https://www.summerfridays.com',
  'glow recipe': 'https://www.glowrecipe.com',
  'krave beauty': 'https://kravebeauty.com',
  'innisfree': 'https://www.innisfree.com',
  'laneige': 'https://www.laneige.com',
  'sulwhasoo': 'https://www.sulwhasoo.com',
  'sk-ii': 'https://www.sk-ii.com',
  'clinique': 'https://www.clinique.com',
  'estee lauder': 'https://www.esteelauder.com',
  'origins': 'https://www.origins.com',
  'kiehl\'s': 'https://www.kiehls.com',
  'kiehls': 'https://www.kiehls.com',
  'neutrogena': 'https://www.neutrogena.com',
  'aveeno': 'https://www.aveeno.com',
  'vanicream': 'https://www.vanicream.com',
  'cosrx': 'https://www.cosrx.com',
  'some by mi': 'https://global.somebymi.com',
  'benton': 'https://bentoncosmetic.us',
  'mixsoon': 'https://mixsoon.us',
  'beauty of joseon': 'https://beautyofjoseon.com',
};

// Try to find brand website using Google search if not in our list
async function findBrandWebsite(brandName, page) {
  try {
    const searchQuery = `${brandName} official website`;
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
      waitUntil: 'networkidle0',
      timeout: 15000
    });

    // Get first search result
    const firstLink = await page.evaluate(() => {
      const result = document.querySelector('#search a[href^="http"]');
      return result ? result.href : null;
    });

    if (firstLink) {
      const url = new URL(firstLink);
      return `${url.protocol}//${url.hostname}`;
    }

    return null;
  } catch (err) {
    console.error('Error finding brand website:', err);
    return null;
  }
}

async function scrapeBrandWebsite(productName, brandName) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    // Get brand website
    const brandLower = brandName.toLowerCase();
    let brandWebsite = BRAND_WEBSITES[brandLower];

    if (!brandWebsite) {
      console.log(`Brand website not in list, searching for ${brandName}...`);
      brandWebsite = await findBrandWebsite(brandName, page);
    }

    if (!brandWebsite) {
      console.log(`Could not find website for brand: ${brandName}`);
      await browser.close();
      return null;
    }

    console.log(`Found brand website: ${brandWebsite}`);

    // Add delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to find search functionality
    await page.goto(brandWebsite, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Look for search input/button (common patterns)
    const searchSelectors = [
      'input[type="search"]',
      'input[placeholder*="Search" i]',
      'input[aria-label*="search" i]',
      'input.search-input',
      'input#search',
      '.search-input',
      '[data-testid="search-input"]'
    ];

    let searchInput = null;
    for (const selector of searchSelectors) {
      searchInput = await page.$(selector);
      if (searchInput) {
        console.log(`Found search input with selector: ${selector}`);
        break;
      }
    }

    // If no search input found, try clicking search icon first
    if (!searchInput) {
      const searchButtonSelectors = [
        'button[aria-label*="search" i]',
        'a[aria-label*="search" i]',
        '.search-toggle',
        '.search-icon',
        '[data-testid="search-button"]'
      ];

      for (const selector of searchButtonSelectors) {
        const searchButton = await page.$(selector);
        if (searchButton) {
          console.log(`Clicking search button: ${selector}`);
          await searchButton.click();
          await page.waitForTimeout(1000);

          // Try to find input again
          for (const inputSelector of searchSelectors) {
            searchInput = await page.$(inputSelector);
            if (searchInput) break;
          }

          if (searchInput) break;
        }
      }
    }

    if (!searchInput) {
      // Fallback: try direct URL patterns
      console.log('No search found, trying direct URL patterns...');
      const urlPatterns = [
        `${brandWebsite}/products/${productName.toLowerCase().replace(/\s+/g, '-')}`,
        `${brandWebsite}/shop/${productName.toLowerCase().replace(/\s+/g, '-')}`,
        `${brandWebsite}/search?q=${encodeURIComponent(productName)}`
      ];

      for (const url of urlPatterns) {
        try {
          await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
          const content = await page.content();

          // Check if we got a valid product page (not 404)
          if (!content.includes('404') && !content.includes('not found')) {
            console.log(`Found product at: ${url}`);
            break;
          }
        } catch (err) {
          continue;
        }
      }
    } else {
      // Use search input
      console.log(`Searching for: ${productName}`);
      await searchInput.type(productName, { delay: 100 });
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);

      // Click first product result
      const productLinkSelectors = [
        '.product-item a',
        '.product-card a',
        '.search-result-item a',
        '[data-testid="product-link"]',
        'a[href*="/product"]',
        'a[href*="/products"]'
      ];

      let productLink = null;
      for (const selector of productLinkSelectors) {
        productLink = await page.$(selector);
        if (productLink) {
          console.log(`Found product link with selector: ${selector}`);
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
            productLink.click()
          ]);
          break;
        }
      }
    }

    // Extract product data from page
    const productData = await page.evaluate(() => {
      const data = {};

      // Product name - try multiple selectors
      const nameSelectors = [
        'h1.product-title',
        'h1.product-name',
        '.product-title h1',
        'h1[itemprop="name"]',
        '[data-testid="product-title"]',
        'h1'
      ];

      for (const selector of nameSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.name = el.textContent.trim();
          break;
        }
      }

      // Image
      const imageSelectors = [
        '.product-image img',
        '.product-gallery img',
        'img[itemprop="image"]',
        '[data-testid="product-image"] img',
        'img.main-image',
        'picture img'
      ];

      for (const selector of imageSelectors) {
        const el = document.querySelector(selector);
        if (el && el.src) {
          data.image_url = el.src;
          break;
        }
      }

      // Price
      const priceSelectors = [
        '.product-price',
        '[itemprop="price"]',
        '.price',
        '[data-testid="product-price"]',
        '.price-value'
      ];

      for (const selector of priceSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const priceText = el.textContent.trim();
          const priceMatch = priceText.match(/[\d.]+/);
          if (priceMatch) {
            data.price = parseFloat(priceMatch[0]);
            break;
          }
        }
      }

      // Size/Volume
      const sizeSelectors = [
        '.product-size',
        '[data-testid="product-size"]',
        '.size',
        '.volume'
      ];

      for (const selector of sizeSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.size = el.textContent.trim();
          break;
        }
      }

      // Description
      const descSelectors = [
        '.product-description',
        '[itemprop="description"]',
        '.description',
        '[data-testid="product-description"]',
        '.product-details p'
      ];

      for (const selector of descSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim().length > 20) {
          data.what_it_is = el.textContent.trim();
          break;
        }
      }

      // Ingredients
      const ingredientSelectors = [
        '.ingredients',
        '[data-testid="ingredients"]',
        '.ingredient-list',
        '[class*="ingredient"]'
      ];

      for (const selector of ingredientSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          const ingredientsText = el.textContent.trim();
          if (ingredientsText.length > 10) {
            // Split by common delimiters
            data.ingredients = ingredientsText
              .split(/,|;|\n/)
              .map(i => i.trim())
              .filter(i => i.length > 0 && i.length < 100);
            break;
          }
        }
      }

      // Skin concerns/benefits
      const benefitSelectors = [
        '.benefits li',
        '.concerns li',
        '[data-testid="benefits"] li',
        '.product-benefits li'
      ];

      for (const selector of benefitSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          data.skincare_concerns = Array.from(elements)
            .map(el => el.textContent.trim())
            .filter(text => text.length > 0);
          break;
        }
      }

      // Skin type
      const skinTypeText = document.body.textContent.toLowerCase();
      const skinTypes = [];
      if (skinTypeText.includes('dry skin') || skinTypeText.includes('for dry')) skinTypes.push('Dry');
      if (skinTypeText.includes('oily skin') || skinTypeText.includes('for oily')) skinTypes.push('Oily');
      if (skinTypeText.includes('combination skin') || skinTypeText.includes('for combination')) skinTypes.push('Combination');
      if (skinTypeText.includes('sensitive skin') || skinTypeText.includes('for sensitive')) skinTypes.push('Sensitive');
      if (skinTypeText.includes('normal skin') || skinTypeText.includes('for normal')) skinTypes.push('Normal');

      if (skinTypes.length > 0) {
        data.skin_type = skinTypes;
      }

      // Get category from page content/breadcrumbs
      const breadcrumbSelectors = [
        '.breadcrumb a',
        '[data-testid="breadcrumb"] a',
        'nav[aria-label="breadcrumb"] a'
      ];

      for (const selector of breadcrumbSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          const categories = Array.from(elements)
            .map(el => el.textContent.trim())
            .filter(text => text.length > 0);
          if (categories.length > 0) {
            data.rawCategory = categories[categories.length - 1];
            break;
          }
        }
      }

      data.url = window.location.href;

      return data;
    });

    await browser.close();

    if (productData && productData.name) {
      // Categorize the product
      productData.brand = brandName;
      productData.category = categorizeProduct(productData.rawCategory || productData.name);
      productData.subcategory = determineSubcategory(productData.category, productData.rawCategory || productData.name);

      console.log('Successfully scraped from brand website:', productData);
      return productData;
    }

    console.log('Could not extract product data from brand website');
    return null;

  } catch (err) {
    console.error("Brand website scraping error:", err);
    if (browser) await browser.close();
    return null;
  }
}

// Categorization helper
function categorizeProduct(productTypeText) {
  const text = (productTypeText || '').toLowerCase();

  const categoryMap = {
    'moisturizer': 'moisturizers',
    'moisturiser': 'moisturizers',
    'cream': 'moisturizers',
    'lotion': 'moisturizers',
    'hydrat': 'moisturizers',
    'gel': 'moisturizers',
    'lip': 'lip balms & treatments',
    'balm': 'lip balms & treatments',
    'serum': 'treatments',
    'treatment': 'treatments',
    'peel': 'treatments',
    'exfoliat': 'treatments',
    'toner': 'treatments',
    'essence': 'treatments',
    'acne': 'treatments',
    'blemish': 'treatments',
    'spot treatment': 'treatments',
    'mask': 'masks',
    'masque': 'masks',
    'cleanser': 'cleansers',
    'wash': 'cleansers',
    'foam': 'cleansers',
    'oil cleanser': 'cleansers',
    'sunscreen': 'Sunscreens',
    'spf': 'Sunscreens',
    'sun protection': 'Sunscreens',
    'sun care': 'Sunscreens',
    'eye': 'eye care',
    'body': 'Body care',
  };

  for (const [key, category] of Object.entries(categoryMap)) {
    if (text.includes(key)) {
      return category;
    }
  }

  return 'Uncategorized';
}

// Subcategory helper
function determineSubcategory(category, productTypeText) {
  const text = (productTypeText || '').toLowerCase();

  const subcategoryMap = {
    'moisturizers': {
      'cream': 'face cream',
      'gel': 'face cream',
      'mist': 'mists & essences',
      'essence': 'mists & essences',
      'spray': 'mists & essences',
      'oil': 'face oils',
      'facial oil': 'face oils',
    },
    'lip balms & treatments': {
      'default': 'lip balms & treatments'
    },
    'treatments': {
      'serum': 'face serums',
      'acne': 'blemish & acne treatments',
      'blemish': 'blemish & acne treatments',
      'spot': 'blemish & acne treatments',
      'peel': 'facial peels',
      'exfoliat': 'exfoliators',
      'scrub': 'exfoliators',
      'toner': 'toners',
    },
    'masks': {
      'default': 'masks'
    },
    'cleansers': {
      'default': 'face wash & cleansers'
    },
    'Sunscreens': {
      'spf 30': 'spf over 30',
      'spf 40': 'spf over 30',
      'spf 50': 'spf over 30',
      'spf 15': 'spf under 30',
      'spf 20': 'spf under 30',
      'spf 25': 'spf under 30',
      'default': 'spf under 30',
    },
    'eye care': {
      'mask': 'eye masks',
      'patch': 'eye masks',
      'cream': 'eye creams & treatments',
      'serum': 'eye creams & treatments',
      'gel': 'eye creams & treatments',
      'default': 'eye creams & treatments',
    },
    'Body care': {
      'default': 'Body lotions'
    }
  };

  const subMap = subcategoryMap[category];
  if (!subMap) return null;

  for (const [key, subcat] of Object.entries(subMap)) {
    if (key === 'default') continue;
    if (text.includes(key)) {
      return subcat;
    }
  }

  return subMap.default || null;
}

module.exports = { scrapeBrandWebsite, BRAND_WEBSITES };

"""
Copyright (C) 2021 SE Slash - All Rights Reserved
You may use, distribute and modify this code under the
terms of the MIT license.
You should have received a copy of the MIT license with
this file. If not, please write to: secheaper@gmail.com

"""

"""
The scraper module holds functions that actually scrape the e-commerce websites
"""

import requests
import formattr
from bs4 import BeautifulSoup

def httpsGet(URL):
    """
    The httpsGet funciton makes HTTP called to the requested URL with custom headers
    """
    headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,'
                    '*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'dpr': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    page = requests.get(URL, headers=headers)
    soup1 = BeautifulSoup(page.content, "html.parser")
    return BeautifulSoup(soup1.prettify(), "html.parser") 

def searchAmazon(query):
    """
    The searchAmazon function scrapes amazon.com using Unwrangle API
    """
    headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,'
                    '*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'dpr': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    
    query = formattr.formatSearchQuery(query)
    URL = f'https://data.unwrangle.com/api/getter/?platform=amazon_search&search={query}&country_code=us&page=1&api_key=71d4ee34a8d0af74569979211cd2eb8a69374987'
    
    try:
        response = requests.get(URL, headers=headers)
        data = response.json()
        products = []
        
        for item in data.get('results', []):
            try:
                product = {
                    'title': formattr.formatTitle(item.get('name', 'No Title')),
                    'price': f"${item.get('price', 'N/A')}" if item.get('price') else "Price Unavailable",
                    'link': item.get('url', '#'),
                    'website': 'amazon',
                    'image': item.get('thumbnail', ''),
                    'rating': str(item.get('rating', 'N/A')) if item.get('rating') else "Rating Unavailable",
                    'total_reviews': item.get('total_ratings', 'No reviews'),
                    'brand': item.get('brand', 'N/A'),
                    'currency': item.get('currency', 'USD'),
                    'is_prime': item.get('is_prime', False),
                    'seller': item.get('seller_info', 'N/A')
                }
                products.append(product)
            except Exception as e:
                print(f"Error processing Amazon item: {str(e)}")
                continue
            
        return products
        
    except Exception as e:
        print(f"Error scraping Amazon: {str(e)}")
        return []

def searchWalmart(query):
    """
    The searchWalmart function scrapes walmart.com
    """
    headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,'
                    '*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'dpr': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    query = formattr.formatSearchQuery(query)
    URL = f'https://www.walmart.com/search?q={query}'
    # Get the page content
    response = requests.get(URL, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    page = httpsGet(URL)
    results = page.findAll("div", {"data-item-id":True})
    products = []
    for res in results:
        titles, prices, links = res.select("span.lh-title"), res.select("div.lh-copy"), res.select("a")
        images = res.get("images", [])
        image_url = images[0] if images else None
        product = formattr.formatResult("walmart", titles, prices, links, images=image_url, ratings=None)
        products.append(product)
        
    
    # print(products)
    return products

def searchTarget(query):
    """
    The searchTarget function scrapes target.com
    """
    headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,'
                    '*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'dpr': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    query = formattr.formatSearchQuery(query)
    URL = f'https://data.unwrangle.com/api/getter/?search={query}'
    
    # Get the page content
    response = requests.get(URL, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    page = httpsGet(URL)
    results = page.findAll("div", {"data-item-id":True})
    products = []
    for res in results:
        titles, prices, links = res.select("span.lh-title"), res.select("div.lh-copy"), res.select("a")
        images = res.get("images", [])
        image_url = images[0] if images else None
        product = formattr.formatResult("target", titles, prices, links, images=image_url, ratings=None)
        products.append(product)
    
    return products

def searchHomedepot(query):
    """
    The searchHomedepot function scrapes homedepot.com using Unwrangle API
    """
    headers = {'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,'
                    '*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
        'dpr': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'}
    
    query = formattr.formatSearchQuery(query)
    URL = f'https://data.unwrangle.com/api/getter/?search={query}'
    
    try:
        response = requests.get(URL, headers=headers)
        data = response.json()
        products = []
        
        for item in data.get('results', []):
            product = {
                'title': formattr.formatTitle(item.get('name', 'No Title')),
                'price': f"${item.get('price', 'N/A')}" if item.get('price') else "Price Unavailable",
                'link': item.get('url', '#'),
                'website': 'homedepot',
                'image': item.get('thumbnails', [''])[0],  # Get first thumbnail if available
                'rating': str(item.get('rating', 'N/A')),
                'reviews': str(item.get('total_reviews', '0')),
                'brand': item.get('brand', 'N/A'),
                'model_no': item.get('model_no', 'N/A'),
                'in_stock': True if item.get('inventory_quantity', 0) > 0 else False
            }
            products.append(product)
            
        return products
        
    except Exception as e:
        print(f"Error scraping Home Depot: {str(e)}")
        return []

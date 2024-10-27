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
    The searchAmazon function scrapes amazon.com
    """
    query = formatter.formatSearchQuery(query)
    URL = f'https://www.amazon.com/s?k={query}'
    page = httpsGet(URL)
    results = page.findAll("div", {"data-component-type":"s-search-result"})
    products = []
    for res in results:
        titles, prices, links = res.select("h2 a span"), res.select("span.a-price span"), res.select("h2 a.a-link-normal")
        product = formatter.formatResult("amazon",  titles, prices, links)
        products.append(product)
    return products

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

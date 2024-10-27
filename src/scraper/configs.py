# package imports
from datetime import datetime
import requests
from ebaysdk.finding import Connection

# local imports
from scraper.formattr import formatTitle


COSTCO = {
    'site': 'costco',
    'url': 'https://www.costco.com/CatalogSearch?dept=All&keyword=',
    'item_component': 'div',
    'item_indicator': {
        'class': 'product-tile-set'
    },
    'title_indicator': 'span a',
    'price_indicator': 'div.price',
    'link_indicator': 'span.description a',
    'image_indicator': 'div.product-img-holder a.product-image-url img.img-responsive',
    'rating_indicator': 'div.c-ratings-reviews p.visually-hidden'
}

BESTBUY = {
    'site': 'bestbuy',
    'url': 'https://www.bestbuy.com/site/searchpage.jsp?st=',
    'item_component': 'li',
    'item_indicator': {
        'class': 'sku-item',
    },
    'title_indicator': 'h4.sku-title a',
    'title': 'div.sku-title h4.sku-header a',
    'price_indicator': 'div.pricing-price div.priceView-hero-price span',
    'link_indicator': 'a.image-link',
    'image_indicator': 'a.image-link img',
    'rating_indicator': 'div.c-ratings-reviews p.visually-hidden'
}
# idividual scrapper
def scrape_amazon(query):
    """Scrape Amazon's api for data

    https://www.rainforestapi.com/docs/product-data-api/overview

    Parameters
    ----------
    query: str
        Item to look for in the api

    Returns
    ----------
    items: list
        List of items from the dict
    """

    api_url = 'https://api.rainforestapi.com/request'

    page = '/s/' + query

    params = {
    'api_key': '84BD3C8D7AF74C4C9D11FF1AE0A700C1',
    'type': 'search',
    'amazon_domain': 'amazon.com',
    'search_term': query,
    'sort_by': 'price_high_to_low'
    }
    
    data = requests.get(api_url, params=params).json()

    items = []
    for p in data['search_results']:
        if 'price' in p and 'rating' in p:
            item = {
                'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                'title': formatTitle(p['title']),  
                'price': '$' + str(p['price']['value']),
                'website': 'amazon',
                'link': p['link'],
                'image': p['image'],
                'rating':str(p['rating'])
            }
            items.append(item)
        
    return items

# individual scrapers
def scrape_walmart(query):
    """Scrape Walmart's API for data

    Parameters
    ----------
    query: str
        Item to look for in the API.

    Returns
    ----------
    items: list
        List of items from the API response.
    """

    params = {
        'api_key': 'cd4751c06a818e259b3d4d89237d957736656ebe',
        'search': query,
        'platform': 'walmart_search'
    }
    # print("Using config.py scrape_walmart function")
    response = requests.get('https://data.unwrangle.com/api/getter/', params=params)
    data = response.json()  # Convert response to JSON format

    items = []
    for p in data.get('results', []):  # Updated to iterate through 'results'
        item = {
            'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            'title': formatTitle(p['name']),
            'price': f"${p['price']}" if p.get('price') else "Price Unavailable",
            'website': 'walmart',
            'link': p['url'],
            'image': p['image_url'],
            'rating': str(p['rating']) if p.get('rating') else "Rating Unavailable",
            'total_reviews': p.get('total_reviews', 'No reviews'),
            'in_stock': p.get('in_stock', False),
            'model_no': p.get('model_no', 'N/A'),
            'est_delivery_date': p.get('est_delivery_date', 'Unknown')
        }
        items.append(item)

    return items


# individual scrapers
def scrape_target(query):
    """Scrape Target's api for data

    https://www.redcircleapi.com/docs/target-product-data-api/overview
    https://api.redcircleapi.com/request?api_key=35C450DAD7CB44A894C1DA0B6A62C7A6&search_term=highlighter+pens&category_id=5zja3&type=search

    Parameters
    ----------
    query: str
        Item to look for in the api

    Returns
    ----------
    items: list
        List of items from the dict
    """

    api_url = 'https://api.redcircleapi.com/request'

    page = '/s/' + query
    
    params = {
    'api_key': '8AA0D45E8C9142CEA86618549017210A',
      'search_term': query,
      'type': 'search'
    }

    data = requests.get(api_url, params=params).json()

    items = []
    for p in data['search_results']:
        if 'price' in p['offers']['primary'] and 'rating' in p['product']:
            item = {
                'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                'title': formatTitle(p['product']['title']),
                'price': '$' + str(p['offers']['primary']['price']),
                'website': 'target',
                'link': p['product']['link'],
                'image': p['product']['main_image'],
                'rating': str(p['product']['rating'])
            }
            items.append(item)   
    return items


def scrape_ebay(query):
    """Scrape Target's api for data

    https://www.countdownapi.com/docs/ebay-product-data-api/overview

    Parameters
    ----------
    query: str
        Item to look for in the api

    Returns
    ----------
    items: list
        List of items from the dict
    """

    EBAY_APP = 'BradleyE-slash-PRD-2ddd2999f-2ae39cfa'

    try:
        api = Connection(appid=EBAY_APP, config_file=None, siteid='EBAY-US')
        response = api.execute('findItemsByKeywords', {'keywords': query})
    except ConnectionError as e:
        print(e)
        return []

    data = response.dict()

    items = []
    for p in data['searchResult']['item']:
        item = {
            'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            'title': formatTitle(p['title']),
            'price': '$' + p['sellingStatus']['currentPrice']['value'],
            'website': 'ebay',
            'link': p['viewItemURL'],
            'image': p['galleryURL'],
            'rating':'Not Available'
        }
        items.append(item)

    return items

def scrape_homedepot(query):
    """Scrape Target's api for data

    https://app.bigboxapi.com/playground
    https://api.bigboxapi.com/request?api_key=087D131F8B774985BD8268E1ADBAB6D1&search_term=lawn+mower&type=search

    Parameters
    ----------
    query: str
        Item to look for in the api

    Returns
    ----------
    items: list
        List of items from the dict
    """

    params = {
    'api_key': '4231AED3DC3D46E8AB3DE7264AD44BDF',
    'search_term': query,
    'type': 'search'
    }

    # make the http GET request to BigBox API
    data = requests.get('https://api.bigboxapi.com/request', params).json()
    
    items = []
    for p in data['search_results']:
        if 'rating' in p['product']:
            item = {
                'timestamp': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
                'title': formatTitle(p['product']['title']),
                'price': '$' + str(p['offers']['primary']['price']),
                'website': 'homedepot',
                'link': p['product']['link'],
                'image': p['product']['primary_image'],
                'rating':str(p['product']['rating'])
            }

        items.append(item)

    return items


CONFIGS = [COSTCO, BESTBUY]

#Dependencies
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import time
import pymongo


def init_browser():
    return Browser('chrome', headless = False)

def scrape():
    browser = init_browser()
    mars_news = {}

    url = "https://mars.nasa.gov/news/"
    browser.visit(url)

    html = browser.html
    soup = BeautifulSoup(html, "html.parser")

    news_title = soup.find('div', class_="content_title").text
    news_p = soup.find('div', class_="rollover_description_inner").text

    mars_news['news_title'] = news_title
    mars_news['news_p'] = news_p

    jpl = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(jpl)
    time.sleep(5)

    browser.click_link_by_partial_text('FULL IMAGE')

    time.sleep(5)

    browser.click_link_by_text('more info     ')

    img_html = browser.html
    
    soup = BeautifulSoup(img_html, "html.parser")
    img_path = soup.find('figure', class_='lede').find('img')['src']
    featured_image_url = "https://www.jpl.nasa.gov/" + img_path

    mars_news['featured_image_url'] = featured_image_url

    weather = "https://twitter.com/marswxreport?lang=en"
    browser.visit(weather)

    weather_html = browser.html
    soup = BeautifulSoup(weather_html, "html.parser")
    mars_weather = soup.find('div', class_="js-tweet-text-container").text.strip()

    mars_news['mars_weather'] = mars_weather

    mars_facts_url = 'https://space-facts.com/mars/'
    tables_df = pd.read_html(mars_facts_url)[0]
    tables_df.columns = ["Description", "Value"]
    html_table = tables_df.to_html(index = False)

    mars_news['mars_facts'] = html_table
    

    usgs_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(usgs_url)

    usgs_html = browser.html
    soup = BeautifulSoup(usgs_html, "html.parser")

    hemisphere_urls = []

    hemispheres = soup.find('div', class_="collapsible results").find_all('a')
    
    
    print(hemispheres)
    for hemisphere in hemispheres:
        
        full_image = hemisphere.get('href')
            
        browser.visit("https://astrogeology.usgs.gov/" + full_image)
        time.sleep(5)
        

        soup_object = BeautifulSoup(browser.html, 'html.parser')
        img_title = browser.find_by_css('h2.title').text
        img_url = ("https://astrogeology.usgs.gov/" + soup_object.find('img', class_='wide-image').get('src'))
    

        hemisphere_dict={'title':img_title, 'img_url':img_url}

        hemisphere_urls.append(hemisphere_dict)

        browser.back()

    mars_news["hemispheres"] = hemisphere_urls

    return mars_news

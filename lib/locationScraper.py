from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time

# Setup Chrome options for headless browsing
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")

# IDs to scrape
idArray = [4698, 2364]
url = "https://spx.sg/service-point/detail"

def scrape():
    print("Scraping with Selenium...")
    output = []

    driver = webdriver.Chrome(options=chrome_options)

    for i in range(2):  # Limit to first for testing
        full_url = f"{url}/{idArray[i]}"
        print(f"Opening {full_url}")
        driver.get(full_url)

        # Wait for JavaScript to render (you can increase if needed)
        time.sleep(5)

        # Get page source after JS has run
        soup = BeautifulSoup(driver.page_source, "html.parser")

        # Try to find the main container (e.g., div with service info)
        content = soup.find("div", id="root")  # Adjust class as needed

        if content:
            notice = content.find("span", class_="only-content")
            if notice:
                print(f"Notice: {notice.text.strip()}")
                output.append({
                    "id": idArray[i],
                    "avail": True
                })
            else:
                print("Notice not found, check class name.")
                output.append({
                    "id": idArray[i],
                    "avail": False
                })
        else:
            print("Content not found, check class name.")
    

    driver.quit()
    return output

print(scrape())

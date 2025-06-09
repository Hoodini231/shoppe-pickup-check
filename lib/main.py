from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from locationScraper import scrape  # assuming your function is in location_scraper.py

app = FastAPI()

# Allow CORS for your frontend domain (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/availability", response_model=List[Dict[str, object]])
async def get_availability():
    result = scrape()  # call your scraping function
    return result

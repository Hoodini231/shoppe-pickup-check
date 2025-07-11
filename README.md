# Megan Personal Shoppee Pickup Point Status Checker
> **My friend Megan asked me to make her something to make her life easier so here it is**
<img width="878" height="709" alt="Megan" src="https://github.com/user-attachments/assets/bd2b7a53-b7dd-4840-b7d4-cd6914d02850" />


---

## 📦 Overview

This project helps **Megan** check the availability status of her preferred **SPX Shopee Pickup Points** near her home easily rather than going into the app and checking out.  

When a pickup point becomes available AND Megan opts to be notified, the aws automatically sends an email notification to inform Megan, so she never misses the chance to select a convenient pickup point.

Because I hate myself rather than going with a simple backend API hosted on render making backend super easy to do I went with a serverless implementation! (This sounds easy until I realized I need selenium and to install chrome and chromedriver using a bash script in my docker container Fml).

---

## ⚙️ Features

- ✅ Check real-time (every 10min) status of selected Shopee SPX Pickup Points
- ✅ Automatic email alert when a point becomes available
- ✅ Fully serverless
---

## 🗂️ Tech Stack

- **AWS Lambda** – Runs backend logic.
- **AWS ECR** – Hosts my lil old web scrapping container.
- **Docker** – Containerise external libraries and technologies to support web scrapping lambda function.
- **Selenium** – Allows to scrape data when wait time is needed.
- **Python** – Lambda function runtime.

---

## Architecture
<img width="1176" height="646" alt="image" src="https://github.com/user-attachments/assets/0fad124b-ecc4-4cc4-99c6-27dcc868a55e" />

## 📌 Challenges
- **Getting container to support chrome and chrome driver** - Had to use a bash script to install chrome and chromedriver in my container and had issues with amd64 and arm64 nonsense
- **IAM and CORS setting** - Yeah forgot to add a allow in my statement so couldn't invoke or access my other lambdas

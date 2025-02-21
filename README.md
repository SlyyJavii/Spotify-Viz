# Explore Web - Spotify Data Visualizer

A web application that visualizes Spotify data and allows users to search for artists and explore music trend.  

## Technologies Used
- Frontend: HTML, CSS, JavaScript, Chart.js
- Backend: Node.js, Express
- APIs: Spotify Web API
- Deployment: Netlify (frontend), Render (backend)

## Troubleshooting
- If the artist search is slow, the backend might be cold starting (takes ~30s)
- Make sure your Spotify API credentials are correctly set up
- Check CORS settings if testing locally

## Live Demo
- Frontend: https://spotify-viz.netlify.app/

Backend API Endpoints Example:
- Search Artists: https://spotify-viz-n08w.onrender.com/api/search/artist?artist=taylor%20swift
- Search Albums: https://spotify-viz-n08w.onrender.com/api/search/albums?artist=taylor%20swift

Note: Direct backend URL access will show "Cannot GET" - this is normal for API servers.

## Project Overview
This project takes a large dataset of music information and organizes it into interactive visualizations:
- Most Common Genre (Bar Graph)
- Most Average Year Song Release (Pie Chart)
- Loudest Song in Decibels (Linear Graph)
- Search (Artist)

## Setup Local Environment

### Prerequisites
- Node.js installed
- Spotify Developer account
- Git

### Backend Setup
1. Clone the repository

    git clone https://github.com/SlyyJavii/Spotify-Viz.git

2. Install dependencies

    bash  
    cd server  
    npm install  

3. Create a .env file in the root directory

    env  
    SPOTIFY_CLIENT_ID=your_spotify_client_id  
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret  

4. Start the server

    bash  
    npm start  
    Server will run on http://localhost:3000  

### Frontend Setup
1. Open public/index.html in your browser
- Using VS Code Live Server
- Or any local server of your choice

## Project Structure
Spotify-Viz/  
├── public/ # Frontend files  
│ ├── index.html  
│ ├── script.js  
│ ├── style.css  
│ └── spotify_top_hits_clean.js  
│  
└── server/ # Backend files  
├── server.js  
├── package.json  
└── .env.example  

## Design Elements

Favicon 
    <link href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAA
    AAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAhMRoAAAAAABkgGQAUExkAYdkeABQUGQBh2h4ARpUcAFzNHgBf1B4AExA
    ZAFnFHQAzZRsAYNceAAAAAAAAAAAAERERERERERERER3d3dEREREd3d3d3dEREd3d3d3d3RER3d3d3d3dER3dWd3
    FXd3RHd3bIE3Y3dEd3X3d01Xd0R3dVVVa3d3RHd3d3d1lXdEd1VVVVVXd0RHd3d3d3d0REd3d3d3d3RERHd3d3d3
    RERERHd3d0RERERERERERERH//wAA+B8AAOAHAADAAwAAwAMAAIABAACAAQAAgAEAAIABAACAAQAAgAEAAMADAADAAwAA4AcAAPgfAAD//wAA"
    rel="icon" type="image/x-icon"> <!--Favicon-->

Text:  
Welcome to the Spotify Data Visualizer. This project takes a large data set of music information and organizes it into categories you can select!

Most Common Genre (Bar Graph)  
Most Average Year Song Release (Pie Chart)  
Loudest Song in Decibles (Linear Graph)   
Search (Artist)  

Colors:  
    Spotify Green: #1ED760  
    Site background: #121212  
    Section backgrounds: #1E1E1E  
    Text: #B3B3B3  
    Font: 'Inter', sans-serif  
    Borders: #282828  
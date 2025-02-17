const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Spotify API credentials from environment variables
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let currentAccessToken = null;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//handle artist search
app.get('/api/search/artist', async (req, res) => {
    const artist = req.query.artist;

    if(!artist){
        return res.status(400).json({ error: 'Missing required parameter "artist"' });
    }

    if(!currentAccessToken){
        return res.status(500).json({ error: 'Missing Spotify Access token' });
    }

    try{
        //make the api request to spotify
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: artist,
                type: 'artist',
                limit: 10,
            },
            headers: {
                Authorization: `Bearer ${currentAccessToken}`,
            },
        });

        //send the response back to the client
        res.json(response.data.artists.items);
    } catch (error) {
        console.error('Error searching for artist:', error);
        res.status(error.response.status || 500).json({ error: 'Failed to fetch artist data' });
    }
});

// Function to refresh the token
async function refreshSpotifyToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        
        if (data.access_token) {
            currentAccessToken = data.access_token;
            return data;
        } else {
            throw new Error('Failed to get access token');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

// Set up automatic token refresh every 55 minutes
setInterval(async () => {
    try {
        await refreshSpotifyToken();
        console.log('Token refreshed successfully');
    } catch (error) {
        console.error('Failed to refresh token:', error);
    }
}, 55 * 60 * 1000); // 55 minutes in milliseconds

// Route to get current access token
app.get('/access-token', (req, res) => {
    if (currentAccessToken) {
        res.json({ access_token: currentAccessToken });
    } else {
        res.status(404).json({ error: 'No access token available' });
    }
});

// Initial token fetch when server starts
refreshSpotifyToken().catch(error => {
    console.error('Initial token fetch failed:', error);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

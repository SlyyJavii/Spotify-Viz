import {songList} from './spotify_top_hits_clean.js';

function showForm(){
    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    const artistSearch = document.createElement('div')
    artistSearch.innerHTML =
        `
    <form id="artist-search-form">
        <label for="artist-input">Search for an artist</label>
        <input type="text" name="artist" id="artist-input" placeholder="Taylor Swift">
        <button type="submit" id="submit-button">Search</button>
    </form>
        `
    resultCard.prepend(artistSearch)
        
    const form = document.getElementById('artist-search-form')
    form.addEventListener('submit', handleSubmit)
}

const handleSubmit = async (event) => {
    event.preventDefault()

    const artistInput = document.getElementById('artist-input');
    const artistName = artistInput.value.trim();

    if(!artistName){
        alert('Please enter an artist name');
        return;
    }

    try{
        console.log('Searching for artist:', artistName);
        const artists = await searchArtists(artistName);

        if(artists.length === 0){
            alert('No artists found');
        }else {
            displayArtistsCards(artists);
        }
    }catch(error){
        console.error('Error searching for artist:', error);
        alert('Failed to search for artist');
    }
}

async function searchArtists(artist) {//search for an artist using sporitfy API
    const requestURL = `http://localhost:3000/api/search/artist?artist=${encodeURIComponent(artist)}`;

    try{
        const response = await fetch(requestURL)
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const artists = await response.json();
        console.log(artists);

        return artists;
    }catch (error){
        console.error('Error searching for artist:', error);
        throw error;
    } 
}


function displayArtistsCards(artistDetails) {//displays the artists found to the screen

    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    showForm()

    console.log("Artist details : ", artistDetails)

    const cardsContainer = document.createElement('div')
    artistDetails.forEach((artist) => {

        const followers = artist.followers.total;
        const formattedFollowers = followers.toLocaleString();
        const card = document.createElement('div')
        card.innerHTML = 
            `
            <div class="card-container">
            <div class="detail-container">
                <div class="img-container">
                    <img src=${artist.images.length > 0 ? artist.images[0].url : 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'} alt=${artist.name}/>
                </div>
                <div class="info-container">
                    <h4>
                        ${artist.name}
                    </h4>
                    <div>
                        <span>${artist.genres && artist.genres.length > 0 ? artist.genres.join(', ') : 'No genre available'} ◆ </span>
                        <span>${formattedFollowers} Followers ◆ </span>
                        <span>Popularity ${artist.popularity}</span>
                    </div>
                </div>
            </div>
            <h6 class="visit-link"><a href="${artist.external_urls.spotify}" target="_blank">Visit Artist</a></h6>
            </div>
            `;
            
            //card.addEventListener('click', () => {handleArtistClick(artist.id)})
            cardsContainer.appendChild(card);
        });
        
        resultCard.append(cardsContainer);
}


document.addEventListener('DOMContentLoaded', () => {
    //variables 
    const buttons = document.querySelectorAll('.result-button');
    const resultCard = document.getElementById('result-card');

    //text when hovering over button
    //for each is like for loop
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;

            if(buttonText === 'Most Common Genre') {
                createGenreChart();
            } else if (buttonText === 'Year Song Release'){
                createYearChart();
            } else if (buttonText === 'Loudest Song'){
                createLoudestSongChart();
            } else if (buttonText === 'Search'){
                showForm();
            }
        });
    });

    //hashmap type of thing
    function createGenreChart(){
        const genreCounts = {};

        //takes out extra space with trim and maps it and splits it by genre
        for (const song of songList) {
            
            const genres = song.genre.split(',').map(g => g.trim());

            for (const genre of genres) {
                genreCounts[genre] = (genreCounts[genre] || 0) + 1;
            }
        }
    
        //keys a d values for the hashmap
        const labels = Object.keys(genreCounts);
        const data = Object.values(genreCounts);

        //
        const canvas = document.createElement('canvas');
        canvas.id = 'genreChart';
        resultCard.innerHTML = '';
        resultCard.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Songs',
                    data: data,
                    backgroundColor: 'rgba(35,255, 64,0.8)',
                    borderColor: 'rgb(0,0,0)',
                    borderWidth: 2
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 200,
                            autoSkip: false,
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                    }
                }
            }
            },
        }); 
    }

    function createYearChart(){
       
        const yearCounts = {};
        
        songList.forEach(song => {
            const year = song.year;
            yearCounts[year] = (yearCounts[year] || 0) + 1;
        });
        
        const labels = Object.keys(yearCounts);
        const data = Object.values(yearCounts);
        
        const canvas = document.createElement('canvas');
        canvas.id = 'yearChart';
        resultCard.innerHTML = '';
        resultCard.appendChild(canvas)
        
        const ctx = canvas.getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgb(23, 255, 23)',  // Spotify green
                        'rgb(4, 83, 8)',
                        'rgb(12, 207, 29)'
                    ],
                    borderWidth: 1,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    title: {
                        display: true,
                        text: 'Songs by Year',
                        color: 'white'
                    },
                    legend: {
                        position: 'top',
                    }
                },
            }
        });
    }

    function createLoudestSongChart() {
        // Sort songs by loudness in descending order and take top 10
        const loudestSongs = songList
            .sort((a, b) => b.loudness - a.loudness)
            .slice(0, 10);

        // Prepare data for chart
        const labels = loudestSongs.map(song => `${song.artist} - ${song.song}`);
        const data = loudestSongs.map(song => song.loudness); 

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'loudnessChart';
        resultCard.innerHTML = '';
        resultCard.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Loudness (dB)',
                    data: data,
                    backgroundColor: 'rgba(35,255, 64,0.8)',
                    borderColor: 'rgb(0,0,0)',
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: 'y', // Makes it a horizontal bar chart
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Loudness (dB)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

})
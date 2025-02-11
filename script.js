import {songList} from './spotify_top_hits_clean.js';

//API
const API_KEY = "BQAhAdOWw0taSvyIodZHQ4GqNrGaBwp7lv7F7NMp-5Tv6Ufa9jAfWItf0ryYqpXYf620-3QfUglGJy3R1nsakjXihk-K8ZM1RPwcIkadiLicwwgaBSn2x_kVdkFrQ0DCSO4sWn9faMQ";

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

    const inputForm = document.getElementById('artist-input')
    const artistRequested = inputForm.value

    const artists = await searchArtists(artistRequested)
    displayArtistsCards(artists)
}

function displayAlbums(albumDetails) { //displays the found albums to the screen
    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    showForm()
    
    console.log("Album details : ", albumDetails)
    
    const cardsContainer = document.createElement('div')
    albumDetails.forEach((album) => {
        const card = document.createElement('div')
        card.innerHTML = 
            `
            <div class="card-container">
                <div class="detail-container">
                    <div class="img-container">
                        <img src=${album.image ? album.image : 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'} alt=${album.name}/>
                    </div>
                    <div class="info-container">
                        <h4>
                            ${album.name}
                        </h4>
                        <div>
                            <span>${album.numTracks} Tracks ◆ </span>
                            <span> Released ${album.released} ◆ </span>
                            <span>${album.type}</span>
                        </div>
                    </div>
                </div>
            <h6 class="visit-link"><a href=${album.link}>Visit Album</a></h6>
            </div>
                `
        card.addEventListener('click', () => {handleAlbumClick(album)})
        cardsContainer.appendChild(card)
    })
        
    resultCard.append(cardsContainer)
}

function displayTracks(trackDetails, image) { //displays the tracks of a selected album
    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    showForm()
    
    console.log("Track details : ", trackDetails)
    
    const cardsContainer = document.createElement('div')
    trackDetails.forEach((track) => {
        const card = document.createElement('div')
        card.innerHTML = 
        `
            <div class="card-container">
                <div class="detail-container">
                    <div class="img-container">
                        <img src=${image ? image : 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'} alt=${track.name}/>
                    </div>
                    <div class="info-container">
                        <h4>
                        ${track.name}
                        </h4>
                        <div>
                            <span>${Math.floor(track.duration / 60000)} minutes ◆ </span>
                            <span>${track.artists.map((artist) => (" " + artist.name))}</span>
                        </div>
                    </div>
                </div>
                <div class="button-container">
                    <h6 class="visit-link" style="text-align:center"><a href=${track.link}>Visit Song</a></h6>
                    <button class="visit-link add-btn" id="add-button">Add Song to Dataset</button>
                </div>
            </div>
                    `
            const addButton = card.getElementsByClassName('add-btn').item(0)
            addButton.addEventListener('click', () => {addTrackToData(track.id)})
            cardsContainer.appendChild(card)
        })
        
        resultCard.append(cardsContainer)
}

async function searchArtists(artist) {//search for an artist using sporitfy API
    const requestURL = `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=5&offset=0`
    const details = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_KEY}`
        }
    }

    const result = await fetch(requestURL, details)
    const json = await result.json()
    console.log(json)

    const retrievedArtists = json.artists.items
    const cleanedArtistData = retrievedArtists.map((artist) => (
        {
            id: artist.id,
            name: artist.name,
            link: artist.external_urls.spotify,
            followers: artist.followers.total,
            popularity: artist.popularity,
            genre: artist.genres.join(", "),
            image: (artist.images.length > 0 ? artist.images[0].url : '')
        }
    ))

    return cleanedArtistData
}

function displayArtistsCards(artistDetails) {//displays the artists found to the screen

    const resultCard = document.getElementById('result-card')
    resultCard.innerHTML = ''
    showForm()

    console.log("Artist details : ", artistDetails)

    const cardsContainer = document.createElement('div')
    artistDetails.forEach((artist) => {
        const card = document.createElement('div')
        card.innerHTML = 
            `
            <div class="card-container">
            <div class="detail-container">
                <div class="img-container">
                    <img src=${artist.image ? artist.image : 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'} alt=${artist.name}/>
                </div>
                <div class="info-container">
                    <h4>
                        ${artist.name}
                    </h4>
                    <div>
                        <span>${artist.genre} ◆ </span>
                        <span>${artist.followers} Followers ◆ </span>
                        <span>Popularity ${artist.popularity}</span>
                    </div>
                </div>
            </div>
            <h6 class="visit-link"><a href=${artist.link}>Visit Artist</a></h6>
            </div>
            `
            
            //card.addEventListener('click', () => {handleArtistClick(artist.id)})
            cardsContainer.appendChild(card)
        })
        
        resultCard.append(cardsContainer)
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
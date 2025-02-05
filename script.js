

import {songList} from './spotify_top_hits_clean.js';

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
            } else if (buttonText === 'Year Song Released'){
                createYearChart();
            } else if (buttonText === 'Loudest Song'){
                createLoudestSongChart();
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
                }
            }
        }); 
    }

})
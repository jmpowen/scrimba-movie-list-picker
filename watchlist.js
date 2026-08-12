const containerDiv = document.querySelector('#container')

function renderWatchlist() {
    const existingData = localStorage.getItem('watchlist')
    const wl = existingData ? JSON.parse(existingData) : null

    if (!wl) {
       return
    }

    wl.forEach(async item => {
        const data = await fetch(`http://www.omdbapi.com/?apikey=fd5e6173&i=${item}`)
            .then(res => res.json())
            
        const movieDiv = document.createElement('div')
        movieDiv.classList.add('movie-div')
        const moviePoster = document.createElement('img')
        moviePoster.classList.add('poster')
        moviePoster.src = data.Poster
        movieDiv.append(moviePoster)

        const movieInfo = document.createElement('div')
        
        const movieTitleInfo = document.createElement('div')
        movieTitleInfo.classList.add("line-items")
        const movieTitle = document.createElement('h2')
        movieTitle.textContent = data.Title
        const movieStars = document.createElement('p')
        movieStars.classList.add('stars')
        movieStars.textContent = data.star ? data.star : 'No rating yet'
        movieTitleInfo.append(movieTitle, movieStars)

        const movieBottomInfo = document.createElement('div')
        movieBottomInfo.classList.add("line-items")
        const movieYear = document.createElement('p')
        movieYear.textContent = data.Year

        const addToWatchlistContainer = document.createElement('div')
        addToWatchlistContainer.classList.add('svg-container')
        const addToWatchlist = document.createElement('button')
        addToWatchlist.classList.add('watchlist-button')
        addToWatchlist.innerHTML = `
            <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
        `
        addToWatchlist.addEventListener('click', () => {
            const existingData = localStorage.getItem('watchlist')
            const watchlist = existingData ? JSON.parse(existingData) : []

            if (watchlist.includes(data.imdbID)) {
                watchlist.splice(watchlist.indexOf(data.imdbID), 1)
            } else {
                watchlist.push(data.imdbID)
                addToWatchlist.innerHTML = `
                    <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
                `
            }

            localStorage.setItem('watchlist', JSON.stringify(watchlist))
            
            containerDiv.replaceChildren()
            renderWatchlist()
        })

        addToWatchlistContainer.appendChild(addToWatchlist)
        


        movieBottomInfo.append(movieYear, addToWatchlistContainer)

        movieInfo.append(movieTitleInfo, movieBottomInfo)
        movieDiv.append(movieInfo)

        containerDiv.append(movieDiv)
    })
}

renderWatchlist()
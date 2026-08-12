const searchBtn = document.querySelector('#search-button')
const searchInput = document.querySelector('#search-text')
const containerDiv = document.querySelector('#container')

searchBtn.addEventListener('click', async (e) => {
    e.preventDefault()

    if (searchInput.value === "") {
        containerDiv.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-movie"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" /><path d="M8 4l0 16" /><path d="M16 4l0 16" /><path d="M4 8l4 0" /><path d="M4 16l4 0" /><path d="M4 12l16 0" /><path d="M16 8l4 0" /><path d="M16 16l4 0" /></svg>
            <h2>Start exploring</h2>
        `
    }
    
    const data = await fetch(`http://www.omdbapi.com/?apikey=fd5e6173&
s=${searchInput.value}`)
        .then(res => res.json())

    containerDiv.replaceChildren()

    if (data.Search) {
        data.Search.forEach(item => {
            const data = localStorage.getItem('watchlist')
            const wl = data ? JSON.parse(data) : []

            const movieDiv = document.createElement('div')
            movieDiv.classList.add('movie-div')
            const moviePoster = document.createElement('img')
            moviePoster.classList.add('poster')
            moviePoster.src = item.Poster
            movieDiv.append(moviePoster)

            const movieInfo = document.createElement('div')
            
            const movieTitleInfo = document.createElement('div')
            movieTitleInfo.classList.add("line-items")
            const movieTitle = document.createElement('h2')
            movieTitle.textContent = item.Title
            const movieStars = document.createElement('p')
            movieStars.classList.add('stars')
            movieStars.textContent = item.star ? item.star : 'No rating yet'
            movieTitleInfo.append(movieTitle, movieStars)

            const movieBottomInfo = document.createElement('div')
            movieBottomInfo.classList.add("line-items")
            const movieYear = document.createElement('p')
            movieYear.textContent = item.Year

            const addToWatchlistContainer = document.createElement('div')
            addToWatchlistContainer.classList.add('svg-container')
            const addToWatchlist = document.createElement('button')
            addToWatchlist.classList.add('watchlist-button')
            addToWatchlist.innerHTML = wl.includes(item.imdbID) ? `
                <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
            ` : `
                <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
            `
            addToWatchlist.addEventListener('click', () => {
                const existingData = localStorage.getItem('watchlist')
                const watchlist = existingData ? JSON.parse(existingData) : []

                if (watchlist.includes(item.imdbID)) {
                    watchlist.splice(watchlist.indexOf(item.imdbID), 1)
                    addToWatchlist.innerHTML = `
                        <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    `
                } else {
                    watchlist.push(item.imdbID)
                    addToWatchlist.innerHTML = `
                        <svg class="scalable-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
                    `
                }

                localStorage.setItem('watchlist', JSON.stringify(watchlist))
            })

            addToWatchlistContainer.appendChild(addToWatchlist)
            


            movieBottomInfo.append(movieYear, addToWatchlistContainer)

            movieInfo.append(movieTitleInfo, movieBottomInfo)
            movieDiv.append(movieInfo)

            containerDiv.append(movieDiv)
        })
    } else {
        const noResults = document.createElement('p')
        noResults.textContent = "Unable to find what you were searching for. Please try another search."
        containerDiv.append(noResults)
    }
})
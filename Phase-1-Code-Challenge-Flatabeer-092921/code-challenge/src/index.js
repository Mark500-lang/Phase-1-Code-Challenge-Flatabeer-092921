// Code here
function beerRender(beer){
    
    // Beer info.
    console.log("render beer " + beer.id)
    console.log('---------------------------------')
    const beerName = document.querySelector('#beer-name');
    const beerImage = document.querySelector('#beer-image');
    const beerDescription = document.querySelector('#beer-description');
    // Targeting Description FORM
    const beerDescriptionForm= document.querySelector('#description-form');
    const beerEditDescription = document.querySelector('#description');
    beerDescriptionForm.reset();
    // Removing Review Lists
    const beerReviewList = document.querySelector('#review-list');
    while (beerReviewList.firstElementChild){
        beerReviewList.removeChild(beerReviewList.lastElementChild)
    };

    //review form is being targeted
    const beerReviewForm = document.querySelector('#review-form');
    const beerReviewText = document.querySelector('#review');
    
    //beer information
    beerName.textContent = beer.name,                   
    beerImage.src = beer.image_url,                     
    beerDescription.textContent = beer.description,     
    beerEditDescription.value = beer.description        
    // rendering beer reviews
    for(let review of beer.reviews){
        let beerReview = document.createElement('li');
        beerReview.textContent = review;
        beerReviewList.appendChild(beerReview);
    }

    // adding a new review    
    beerReviewForm.addEventListener('submit', (env) => {
        env.preventDefault();
        console.log(`review form ID: ${beer.id}`)
        console.log('---------------------------------')
        if(beerReviewText.value !== ''){
            
            beer.reviews.push(beerReviewText.value)
            patchBeer(beer)
        } else{
            alert('Review is empty string!!')
        }
    });
};



function patchBeer(beer){
    console.log(beer, beer.id)
    fetch(`http://localhost:3000/beers/${beer.id}`,
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(beer)
        })
        .then(response => response.json())
        .then(data => beerRender(data))
        .catch(err => console.log(`Error: ${err}`))
};

function postBeer(beer){
    fetch('http://localhost:3000/beers', {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify(beer)
    })
    .then(response => response.json())
    .then(data => beerRender(data))
    .catch(err => console.log(`Error: ${err}`))
}

function fetchData(beer=null){
    let baseURL = 'http://localhost:3000/beers/'
    return new Promise((resolve, reject) => {
        let url = beer == null ? baseURL : `${baseURL + beer}`
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(err => console.log(`Error: ${err}`));
        })
    };

function navRender(beers){
    // Navigationbar on left Beer List
    const navBeerList = document.querySelector('#beer-list');
    while (navBeerList.firstElementChild){
        navBeerList.removeChild(navBeerList.lastElementChild)
    };

    beers.forEach(beer => {
        const li = document.createElement('li');
        li.textContent = beer.name;
        li.setAttribute('index', beer.id);
        navBeerList.append(li)

        li.addEventListener('click', (env)=> {
            console.log("EventPhase: " + env.eventPhase)
            fetchData(env.target.getAttribute('index'))
            .then(beer => {
                console.log("from fetch-> beer id " + beer.id);
                beerRender(beer);
            });
        }, false);
    });


};

function init(){
    fetchData()
    .then(beers => navRender(beers))

    fetchData(1)
    .then(beers => beerRender(beers))
    
};

init()

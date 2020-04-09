window.addEventListener("load", () => {

    let startscreen = document.getElementById('startScreen');
    let submitName = document.getElementById('submitName');
    let username = document.getElementById('username');
    let nameWarning = document.getElementById('nameWarning');
    let startGame = document.getElementById('startGame');
    let userWarning = document.getElementById('userWarning');
    let black = document.getElementById('black');
    let confirmSelection = document.getElementById('confirmSelection');

    submitName.addEventListener('click', () => {
       if(username.value.trimLeft() === '') {
           username.style.borderColor = 'red';
           nameWarning.style.display = 'block';
       }else {
           username.style.borderColor = 'grey';
           nameWarning.style.display = 'none';

           //TODO: add User to db (name: username.value.trimLeft(), status=notStarted)

           startscreen.style.display = 'none';
       }
    });

    //TODO: everytime something in the users table changes, call this method
    writeNames();

    //TODO: everytime something in the candidateCards table changes, call this method
    addCandidateCard();

    //TODO: everytime the givenCard changes, call this method
    displayGivenCard();

    //TODO: everytime the handCards changes, call this method
    displayHandCards;

    startGame.addEventListener('click', () => {

        //TODO: get amount of players out of db
        let amoutOfUsers = 4;
        if (amoutOfUsers < 3) {
            userWarning.style.display = "block";
        } else {
            //TODO: set status of one user to game master
            //TODO: set status of all the other users to waiting

            drawCard(7);

            black.style.display = 'block';

            startGame.style.display = 'none';
            userWarning.style.display = 'none';

            //TODO: master sets given cards


        }
    });

    //TODO: get status of user
    let userStatus = 'master';
    if (userStatus === 'master') {
        let change = document.getElementById('change');
        change.style.display = 'block';

        change.addEventListener('click', () => {
           //TODO: swap givenCard and laidCard
        });
    }

    //region testTrigger
    //username.value = "Jonas";
    //submitName.click();
    //startGame.click();
    //endregion
});

function writeNames() {

    //TODO: get all playing Players from DB
    let userNames = "Jonas;Peter;Sepp;Andreas";

    let names = document.getElementById('names')
    let child = names.lastElementChild;

    while (child !== names.firstElementChild) {
        names.removeChild(child);
        child = names.lastElementChild;
    }

    let users = userNames.split(';');
    let score = 0;

    for (let i = 0; i < users.length; i++) {

        let nameBox = document.createElement("div");
        nameBox.setAttribute("class", "nameBox");

        let nameTag = document.createElement("p");
        let name = document.createTextNode(users[i]);

        //TODO: get score from db
        let scoreTag = document.createElement("p");
        scoreTag.setAttribute("class", "points");
        let points = document.createTextNode(score);

        nameTag.appendChild(name);
        scoreTag.appendChild(points);

        nameBox.appendChild(nameTag);
        nameBox.appendChild(scoreTag);

        names.appendChild(nameBox);

        //TODO: get status out of db
        let status = "notStarted";

        switch (status) {
            case "waiting":
                nameBox.style.borderLeftColor = '#CCCB23';
                break;

            case "ready":
                nameBox.style.borderLeftColor = '#339933';
                break;

            case "master":
                nameBox.style.borderLeftColor = '#8DB6CA';
                break;

            case "notStarted":
                nameBox.style.borderLeftColor = '#b0b0b0';
                break;
        }
    }
}

function displayHandCards() {

    //TODO: get user's cards

    let cards = document.getElementById('cards');

    let c = cards.lastElementChild;

    while (c) {
        cards.removeChild(c);
        c = cards.lastElementChild;
    }

    for (let i = 0; i < 7; i++) {

        let random = Math.floor(Math.random() * (252 - 1) ) + 1;

        let card = document.createElement('IMG');

        if (random < 10) {
            card.setAttribute("src", "./cards/1000" + random + ".png");
        } else if (random < 100) {
            card.setAttribute("src", "./cards/100" + random + ".png");
        } else {
            card.setAttribute("src", "./cards/10" + random + ".png");
        }

        card.setAttribute("class", "handCards");

        card.addEventListener('click', () => {

            //TODO: get userStatus and gameStatus
            let userStatus = 'waiting';
            let gameStatus = 'waiting';

            if((gameStatus === 'waiting' && userStatus === 'waiting') ||
                (gameStatus === 'master' && userStatus === 'master')) {

                let children = cards.children;

                for (let j = 0; j < children.length; j++) {
                    if (children[j] !== card) {
                        children[j].style.border = 'none';
                        children[j].style.margin = '3vh 1vw';
                        children[j].style.borderRadius = '0';
                    }
                }

                card.style.borderTop = '0.5vh solid';
                card.style.borderRight = '0.25vw solid';
                card.style.borderBottom = '0.5vh solid';
                card.style.borderLeft = '0.25vw solid';
                card.style.borderRadius = '12px';
                card.style.borderColor = '#329832';
                card.style.margin = '2.5vh 0.75vw';

                confirmSelection.style.display = 'block';

                confirmSelection.addEventListener('click', () => {

                    switch (userStatus) {
                        case "waiting":
                            //TODO: add 'card' to candidateCards
                            //TODO: remove 'card' from handcards
                            //TODO: set users status to 'ready'

                            break;

                        case "master":
                            //TODO: set laidCard to 'card'
                            //TODO: set gamestatus to 'waiting'

                            document.getElementById('change').style.display = 'none';
                            break;
                    }

                    //TODO: remove 'card' from handcards

                });
            }
        });

        cards.appendChild(card);
    }
}

function drawCard(amount) {

    for (let i = 0; i < amount; i++) {
        let random = Math.floor(Math.random() * (252 - 1) ) + 1;

        //TODO: add random to handcards
    }
}

function generateGivenCard() {

    let random = Math.floor(Math.random() * (252 - 1) ) + 1;
    if(random%9 === 7){
        random++;
    }

    //TODO: set givenCard in db to '10000 + random'

}

function displayGivenCard() {

    //TODO: get givenCard from DB
    let givenCard = 10001;

    let givenCardImg = document.getElementById('givenCard');

    givenCardImg.setAttribute('src', "./cards/" + givenCard + ".png");

}

function addCandidateCard() {

    let candidateCardsDiv = document.getElementById('candidateCards');
    let c = candidateCardsDiv.lastElementChild;

    while (c) {
        candidateCardsDiv.removeChild(c);
        c = candidateCardsDiv.lastElementChild;
    }

    //TODO: get amount of candidate cards & amount of players

    let amount = 3;
    let amountOfPlayers = 4;

    if(amount === amountOfPlayers){
        revealCandidateCards();
    } else {
        for (let i = 0; i < amount; i++) {
            let newCard = document.createElement('img');
            newCard.setAttribute('src', './img/back.png');

            candidateCardsDiv.appendChild(newCard);
        }
    }

}

function revealCandidateCards() {
    //TODO: get all Candidate Cards from DB
    let candidates = [10001, 10002, 10003, 1004];

    let candidateCardsDiv = document.getElementById('candidateCards');
    let c = candidateCardsDiv.lastElementChild;

    while (c) {
        candidateCardsDiv.removeChild(c);
        c = candidateCardsDiv.lastElementChild;
    }

    for (let i = 0; i < candidates.length; i++) {
        let newCard = document.createElement('img');
        newCard.setAttribute('src', './cards/' + candidates[i] + '.png');

        //TODO: get userStatus and gameStatus
        let userStatus = 'master';
        let gameStatus = 'master';

        if (gameStatus === 'master' && userStatus === 'master') {

            newCard.addEventListener('click', () => {

                let children = candidateCardsDiv.children;

                for (let j = 0; j < children.length; j++) {
                    if (children[j] !== card) {
                        children[j].style.border = 'none';
                        children[j].style.margin = '3vh 1vw';
                        children[j].style.borderRadius = '0';
                    }
                }

                newCard.style.borderTop = '0.5vh solid';
                newCard.style.borderRight = '0.25vw solid';
                newCard.style.borderBottom = '0.5vh solid';
                newCard.style.borderLeft = '0.25vw solid';
                newCard.style.borderRadius = '12px';
                newCard.style.borderColor = '#329832';
                newCard.style.margin = '2.5vh 0.75vw';

                confirmSelection.style.display = 'block';

                confirmSelection.addEventListener('click', () => {

                    //TODO: give user who laid 'newCard' a point

                });

            });
        }

        candidateCardsDiv.appendChild(newCard);
    }
}

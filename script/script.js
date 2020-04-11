window.addEventListener("load", () => {

    init();
    let startscreen = document.getElementById('startScreen');
    let submitName = document.getElementById('submitName');
    let username = document.getElementById('username');
    let nameWarning = document.getElementById('nameWarning');
    let startGame = document.getElementById('startGame');
    let userWarning = document.getElementById('userWarning');
    let black = document.getElementById('black');
    let countPlayers = 0;
    let game;
    let users = [];
    let givenCard;
    let laidCard;

    let now = sessionStorage.getItem('id');
    let handCards;

    let confirmSelection = document.getElementById('confirmSelection');
    let continueButton = document.getElementById('continue');
    let change = document.getElementById('change');

    if (now) {
        startscreen.style.display = 'none';
        nameWarning.style.display = 'none';
    }

    submitName.addEventListener('click', () => {
       if (username.value.trimLeft() === '') {
           username.style.borderColor = 'red';
           nameWarning.style.display = 'block';
       }else {

           sessionStorage.setItem('id', Date.now());
           now = sessionStorage.getItem('id');

           nameWarning.style.display = 'none';

           firebase.database().ref('users/' + now).set({
               username:username.value.trimLeft(),
               points:0,
               status:'notStarted',
               id:now
           });

           startscreen.style.display = 'none';
       }
    });

    startGame.addEventListener('click', () => {

        if (countPlayers < 3) {
            userWarning.style.display = "block";
        } else if (givenCard) {

            if(!sessionStorage.getItem('handCards')){
                sessionStorage.setItem('handCards', drawCards(7));
            }

            handCards = sessionStorage.getItem('handCards').split(',');

            displayHandCards();

            black.style.display = 'block';

            startGame.style.display = 'none';
            userWarning.style.display = 'none';

            displayGivenCard(givenCard);
        } else {
            firebase.database().ref('users/' + users[0].id).update({
                status:'master'
            });

            for (let i = 1; i < users.length; i++) {
                firebase.database().ref('users/' + users[i].id).update({
                    status:'waiting'
                });
            }

            sessionStorage.setItem('handCards', drawCards(7));
            handCards = sessionStorage.getItem('handCards').split(',');

            displayHandCards();

            black.style.display = 'block';

            startGame.style.display = 'none';
            userWarning.style.display = 'none';

            generateGivenCard();
        }
    });

    firebase.database().ref('users').on('value', snapshot => {

        const persons = [];
        users = [];

        for (const index in snapshot.val()) {

            persons.push(snapshot.val()[index]);
            users.push(snapshot.val()[index]);
        }

        countPlayers = persons.length;

        writeNames(persons);
    });

    firebase.database().ref('candidateCards').on('value', snapshot => {

        const candidates = [];

        for (const index in snapshot.val()) {

            candidates.push(snapshot.val()[index]);
        }

        if (candidates.length === users.length-1) {

            firebase.database().ref('game').update({
                status:'master'
            });

            revealCandidateCards(shuffleArray(candidates));
        } else {
            addCandidateCard(candidates.length);
        }
    });

    firebase.database().ref('game').on('value', snapshot => {

        for (const index in snapshot.val()) {

            game = snapshot.val()[index];
        }
        let me;

        for (let i = 0; i < users.length; i++) {

            if(users[i].id === now){
                me = users[i];
            }
        }
        console.log(game);
    });

    firebase.database().ref('game/givenCard').on('value', snapshot => {

        for (const index in snapshot.val()) {
            givenCard = snapshot.val()[index];
        }

        displayGivenCard(givenCard);
    });

    firebase.database().ref('game/laidCard').on('value', snapshot => {

        for (const index in snapshot.val()) {
            laidCard = snapshot.val()[index];
        }

        if (laidCard !== 'd') {
            displayLaidCard(laidCard);
        } else {
            resetLaidCard();
        }
    });

    continueButton.addEventListener('click', () => {

        let nextMasterIndex;

        for (let i = 0; i < users.length; i++) {
            if (users[i].status === 'master') {
                if (i === users.length-1) {
                    nextMasterIndex = 0
                } else {
                    nextMasterIndex = i+1;
                }
            }
        }

        for (let i = 0; i < users.length; i++) {
            firebase.database().ref('users/' + users[i].id).update({
                status:'waiting'
            });
        }

        firebase.database().ref('users/' + users[nextMasterIndex].id).update({
            status:'master'
        });

        firebase.database().ref('game').update({
            status:'master',
            laidCard:'undefined'
        });

        generateGivenCard();

        firebase.database().ref('candidateCards').remove();

        continueButton.style.display = 'none';

    });

    function writeNames(persons) {

        let names = document.getElementById('names')
        let child = names.lastElementChild;

        while (child !== names.firstElementChild) {
            names.removeChild(child);
            child = names.lastElementChild;
        }

        for (let i = 0; i < persons.length; i++) {

            let nameBox = document.createElement("div");
            nameBox.setAttribute("class", "nameBox");

            let nameTag = document.createElement("p");
            let name = document.createTextNode(persons[i].username);

            let scoreTag = document.createElement("p");
            scoreTag.setAttribute("class", "points");
            let points = document.createTextNode(persons[i].points);

            nameTag.appendChild(name);
            scoreTag.appendChild(points);

            nameBox.appendChild(nameTag);
            nameBox.appendChild(scoreTag);

            names.appendChild(nameBox);

            let status = persons[i].status;

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

        let cards = document.getElementById('cards');

        let c = cards.lastElementChild;

        while (c) {
            cards.removeChild(c);
            c = cards.lastElementChild;
        }

        for (let i = 0; i < handCards.length; i++) {

            let card = document.createElement('IMG');

            card.setAttribute("src", "./cards/" + handCards[i] + ".png");

            card.setAttribute("class", "handCards");

            card.addEventListener('click', () => {

                let userStatus;
                for (let j = 0; j < users.length; j++) {

                    if (users[j].id === now) {
                        userStatus = users[j].status;
                    }
                }

                let gameStatus = game;

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
                        let userStatus;
                        for (let j = 0; j < users.length; j++) {

                            if (users[j].id === now) {
                                userStatus = users[j].status;
                            }
                        }

                        switch (userStatus) {
                            case "waiting":

                                firebase.database().ref('candidateCards/' + now).set({
                                    cardID:handCards[i],
                                    user:now
                                });

                                firebase.database().ref('users/' + now).update({
                                    status:'ready'
                                });

                                break;

                            case "master":

                                let laidCard = drawCards(1);
                                laidCard[0] = getImgID(card);

                                firebase.database().ref('game').update({
                                    laidCard:laidCard,
                                    status:'waiting'
                                });

                                /*change.style.display = 'block';
                                continueButton.style.marginTop = '1vh';
                                confirmSelection.style.marginTop = '1vh';

                                change.addEventListener('click', () => {

                                    let lc = laidCard;
                                    let gc = givenCard;

                                    console.log(lc +"  " + gc);

                                    firebase.database().ref('game').update({
                                        givenCard:lc,
                                        laidCard:gc
                                    });

                                });*/

                                break;
                        }

                        confirmSelection.style.display = 'none';

                        removeFromHandCards(getImgID(card));

                    });
                }
            });

            cards.appendChild(card);
        }
    }

    function drawCards(amount) {

        let cards = [];

        for (let i = 0; i < amount; i++) {
            let random = Math.floor(Math.random() * (252 - 1) ) + 1;

            cards[i] = random + 10000;

        }

        return cards;
    }

    function displayGivenCard(card) {

        let givenCard = document.getElementById('givenCard');

        givenCard.setAttribute('src', './cards/' + card + '.png');

    }

    function displayLaidCard(card) {
        if (card) {
            let laidCard = document.getElementById('laidCard');

            laidCard.setAttribute('src', './cards/' + card + '.png');
        }

    }

    function resetLaidCard() {
        let laidCard = document.getElementById('laidCard');

        laidCard.setAttribute('src', './img/empty.png');
    }

    function generateGivenCard() {
        let givenCard = drawCards(1);

        if (givenCard%9 === 7){
            givenCard++;
        }

        let givenCardImg = document.getElementById('givenCard');

        givenCardImg.setAttribute('src', "./cards/" + givenCard + ".png");

        firebase.database().ref('game').set({
            status:'master',
            givenCard:givenCard
        });

    }

    function addCandidateCard(amount) {

        let candidateCardsDiv = document.getElementById('candidateCards');
        let c = candidateCardsDiv.lastElementChild;

        while (c) {
            candidateCardsDiv.removeChild(c);
            c = candidateCardsDiv.lastElementChild;
        }

        for (let i = 0; i < amount; i++) {
            let newCard = document.createElement('img');
            newCard.setAttribute('src', './img/back.png');
            candidateCardsDiv.appendChild(newCard);
        }

    }

    function revealCandidateCards(candidates) {

        let candidateCardsDiv = document.getElementById('candidateCards');
        let c = candidateCardsDiv.lastElementChild;

        while (c) {
            candidateCardsDiv.removeChild(c);
            c = candidateCardsDiv.lastElementChild;
        }

        for (let i = 0; i < candidates.length; i++) {
            let newCard = document.createElement('img');
            newCard.setAttribute('src', './cards/' + candidates[i].cardID + '.png');

            let userStatus;
            for (let j = 0; j < users.length; j++) {

                if (users[j].id === now) {
                    userStatus = users[j].status;
                }
            }

            let gameStatus = game;

            if (gameStatus === 'master' && userStatus === 'master') {

                newCard.addEventListener('click', () => {

                    let children = candidateCardsDiv.children;

                    for (let j = 0; j < children.length; j++) {
                        if (children[j] !== newCard) {
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

                        let userID = candidates[i].user;

                        let points;

                        for (let j = 0; j < users.length; j++) {
                            if (users[j].id === userID) {
                                points = users[j].points;
                            }
                        }

                        points++;

                        firebase.database().ref('users/' + userID).update({
                            points:points
                        });


                        confirmSelection.style.display = 'none';
                        continueButton.style.display = 'block';
                    });

                });
            }

            candidateCardsDiv.appendChild(newCard);
        }
    }

    function removeFromHandCards(card) {

        let cardIndex;

        for (let i = 0; i < handCards.length; i++) {
            console.log(handCards[i] + "   " + card)
            if (handCards[i] === card) {
                cardIndex = i;
            }
        }

        for (let i = cardIndex+1; i < handCards.length; i++) {
            handCards[i-1] = handCards[i];
        }

        displayHandCards();
        handCards[handCards.length-1] = drawCards(1);
        sessionStorage.setItem('handCards', handCards);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function getImgID(img) {
        let src = img.src;

        let id = src.split('/');

        id = id[id.length-1];

        id = id.split('.')[0];

        return id;
    }

});
$(document).ready(function(){


    ////////////////////
    // MAIN VARIABLES //
    ////////////////////

    // A fresh, perfect-ordered deck of cards
    const freshDeck = createDeck();
    // We will keep all players/dealers cards in this array
    var playersHand = [];
    var dealersHand = [];
    // Slice will loop through freshDeck and make a COPY of each individual element...
    // It will then put it in the new theDeck array.
    // It's COPYING it, rather than pointing back at the original
    var theDeck = freshDeck.slice();
    var money = 100;


    ////////////////////
    // EVENT HANDLERS //
    ////////////////////

    $('.deal-button').click(function(){
        // The deal stuff happens here
        // shuffleDeck();
        // console.log(theDeck);
        // console.log(freshDeck);
        reset();

        // We have a shuffled deck
        playersHand.push(theDeck.shift()); // Top card, give to player
        dealersHand.push(theDeck.shift()); // Next top card, give to dealer
        playersHand.push(theDeck.shift()); // Next top card, give to player again
        dealersHand.push(theDeck.shift()); // Next top card, give to dealer again

        //Change the DOM to add the images
        // placeCard(DOM name of who, card-x for slot, card value to send)
        placeCard('player',1,playersHand[0]);
        placeCard('player',2,playersHand[1]);

        placeCard('dealer',1,dealersHand[0]);
        placeCard('dealer',2,dealersHand[1]);

        calculateTotal(playersHand,'player');
        calculateTotal(dealersHand,'dealer');

    });

    $('.hit-button').click(function(){
        // Hit funcationality
        // Player wants a new card. This means:
        // 1. Shift OFF of theDeck
        // 2. Push on to playersHand
        // 3. Run placeCard to put the new card (image) in the DOM
        // 4. Run calculateTotal to find out the new hand total

        if(calculateTotal(playersHand,'player') < 21){
            playersHand.push(theDeck.shift()); // This covers 1 & 2
            var lastCardIndex = playersHand.length - 1;
            var slotForNewCard = playersHand.length;
            placeCard('player',slotForNewCard,playersHand[lastCardIndex]); // 3
            calculateTotal(playersHand,'player') // 4
        }
    });

    $('.stand-button').click(function(){
        // On click stand...
        // Player has given control to the dealer
        // Dealer MUST hit until dealer has 17 or more
        var dealerTotal = calculateTotal(dealersHand,'dealer');
        if(dealerTotal < 17){ // Same thing as the players 'hit'
            dealersHand.push(theDeck.shift());
            var lastCardIndex = dealersHand.length - 1;
            var slotForNewCard = dealersHand.length;
            placeCard('player',slotForNewCard,dealersHand[lastCardIndex]);
            dealerTotal = calculateTotal(dealersHand,'player')
        }
        checkWin();
    });

    $('.bet-button').click(function(){
        playerBet(10);
    });


    ///////////////////////
    // UTILITY FUNCTIONS //
    ///////////////////////

    function reset(){
        // In order to reset the game, we need to:
        // 1. Reset the deck
        theDeck = freshDeck.slice();
        shuffleDeck();
        // 2. Reset the player and dealer hand arrays
        playersHand = [];
        dealersHand = [];
        // 3. Reset the cards in the DOM
        $('.card').html('');
        // 4. Reset the totals for both players
        $('.dealer-total-number').html('0');
        $('.player-total-number').html('0');
        // 5. Reset message
        $('.message').html('&nbsp;');
    }

    function checkWin(){
        var playerTotal = calculateTotal(playersHand,'player');
        var dealerTotal = calculateTotal(dealersHand,'dealer');
        var winner = "";
        // if player > 21... player loses
        // if dealer > 21... dealer loses
        // if player > dealer, player wins
        // if dealer > player, dealer wins
        // else... tie.
        if(playerTotal > 21){
            winner = "You have busted. Dealer wins.";
        }else if(dealerTotal > 21){
            winner = "Dealer has busted. You win!";
            money += 10;
            $('.money').html('$' + money);
        }else{
            // Neither player has busted. See who won...
            if(playerTotal > dealerTotal){
                winner = "You beat the dealer!";
                money += 10;
                $('.money').html('$' + money);
            }else if(playerTotal < dealerTotal){
                winner = "Dealer has bested you. We keep your money.";
            }else{
                winner = "It's a push!";
            }
        }
        $('.message').text(winner);
    };

    function calculateTotal(hand, who){
        // hand will be an array (either players hand or dealers hand)
        // who will be what the DOM knows the player as (player or dealer)
        var totalHandValue = 0;
        var thisCardValue = 0;
        var hasAce = false;
        var totalAces = 0;
        for(let i = 0; i < hand.length; i++){
            thisCardValue = Number(hand[i].slice(0,-1)); // This will slice off the suit at the end

            if(thisCardValue > 10){
                thisCardValue = 10
            }else if(thisCardValue == 1){
                // This is an ace!
                hasAce  = true;
                totalAces++;
                thisCardValue = 11;
            }
            totalHandValue += thisCardValue;
        }
        for(let i = 0; i < totalAces; i++){
            if((totalHandValue > 21) && (hasAce)){
                totalHandValue -= 10;
            }
        }
        var totalToUpdate = '.' + who + '-total-number';
        $(totalToUpdate).text(totalHandValue);
        return totalHandValue;
    };

    function placeCard(who, where, what){
        // Find the DOM element, based on the args, that we want to change
        // i.e. Find the element we want to place the images in
        var slotForCard = '.' + who + '-cards .card-' + where;
        // console.log(slotForCard);
        var imageTag = '<img src="images/cards/'+what+'.png">';
        var deckImage = '<img src="images/cards/deck.png">';
        if((who == 'dealer') && (where != 1)){
            $(slotForCard).html(deckImage);
        }else{
            $(slotForCard).html(imageTag);
        }
    };

    function createDeck(){
        var newDeck = [];
        // Two loops, 1 for suit, 1 for card value
        var suits = ['h','s','d','c'];
        // Outter loop which iterates the suit/letter...
        for(let s = 0; s < suits.length; s++){
            // Inner loop which iterates the values/number...
            for(let c = 1; c <= 13; c++){
                // Push onto newDeck array, the value[c] + suit[s]
                newDeck.push(c+suits[s]);
            }
        }
        return newDeck;
    };

    function shuffleDeck(){
        // Swap 2 elements in the array many, many times to shuffle it.
        for(let i = 0; i < 14000; i++){
            var random1 = Math.floor(Math.random() * 52);
            var random2 = Math.floor(Math.random() * 52);
            var temp = theDeck[random1]; // Temporarily store for later
            theDeck[random1] = theDeck[random2]; // Overwrite
            theDeck[random2] = temp; // Store temp in index random2
        }
    };

    function playerBet(){
        var playersScore = calculateTotal(playersHand,'player');
        if(playersScore < 21){
            money -= 10;
            $('.money').html('$' + money);
        }else if(playersScore > 21){
            $('.message').html("You lost. You can no longer place bets.");
        }else{
            $('.message').html("You have no money to bet.");
        }
    };

});
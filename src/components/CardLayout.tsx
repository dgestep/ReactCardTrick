import React, {useEffect, useState} from "react";

/**
 * Structure to hold the card image to render and the index within the 21 deck array where the card lives.
 * This Card class would most-likely be in a separate REST layer project.
 */
class Card {
    index: number;
    imageName: string;

    constructor(index: number, imageName: string) {
        this.index = index;
        this.imageName = imageName;
    }
}

/**
 * An object which holds the model logic that knows how to deal, re-deal, and pick the correct card.
 * This logic would most-likely be in a separate REST layer project and this script would be replaced with simple REST
 * service calls.
 */
const cardTrickModel = {
    cards: [] as Array<Card>,

    /**
     * Returns a random number between 1 and the supplied max value.
     * @param max the max value.
     */
    random(max: number): number {
        return Math.floor(Math.random() * (max - 2)) + 1;
    },

    /**
     * Returns the card chosen by the player.
     * @param columnNumber the column number where the card lives.
     */
    pickCard(columnNumber: number): Card {
        let card: Card;
        if (columnNumber === 1) {
            card = cardTrickModel.cards[9];
        } else if (columnNumber === 2) {
            card = cardTrickModel.cards[10];
        } else {
            card = cardTrickModel.cards[11];
        }
        return card;
    },

    /**
     * Returns 52 deck of cards as an array of Cards.
     * @return the 52 cards.
     */
    openNewDeck(): Array<Card> {
        const suits: Array<string> = ['ace-', 'two-', 'three-', 'four-', 'five-', 'six-', 'seven-', 'eight-',
            'nine-', 'ten-', 'jack-', 'queen-', 'king-'];
        const deck: Array<Card> = [];
        for (let i = 0; i < 4; i++) {
            let folderName = process.env.PUBLIC_URL + '/Cards';
            let imageName;
            if (i === 0) {
                folderName += '/Spades';
                imageName = 'spade';
            } else if (i === 1) {
                folderName += '/Clubs';
                imageName = 'club';
            } else if (i === 2) {
                folderName += '/Diamonds';
                imageName = 'diamond';
            } else {
                folderName += '/Hearts';
                imageName = 'heart';
            }

            for (let j = 0; j < 13; j++) {
                const card: Card = new Card(deck.length, folderName + '/' + suits[j] + imageName + '.jpeg');
                deck.push(card);
            }
        }
        return deck;
    },

    /**
     * Returns 21 randomly chosen cards from a 52 card deck.
     * @return the 21 cards.
     */
    deal21(deck: Array<Card>): void {
        this.cards = [];
        const used: Set<number> = new Set<number>();
        for (let i = 0; i < 21; i++) {
            let cardIdx = -1;
            do {
                cardIdx = cardTrickModel.random(52);
            } while (used.has(cardIdx));
            used.add(cardIdx);

            const card = deck[cardIdx];
            this.cards.push(card);
        }
    },

    /**
     * Re-arranges the 21 cards, keeping the order of the cards from top to bottom and keeping the selected column in
     * the middle of the three columns.
     * @param columnNumber the column number where the chosen card lives.
     */
    reDeal21(columnNumber: number): void {
        const col1: Array<Card> = [];
        const col2: Array<Card> = [];
        const col3: Array<Card> = [];

        for (let i = 0, col1Idx = 0, col2Idx = 0, col3Idx = 0, counter = 1; i < this.cards.length; i++) {
            const card: Card = Object.assign({}, this.cards[i]);
            if (counter === 1) {
                col1[col1Idx] = card;
                counter++;
                col1Idx++;
            } else if (counter === 2) {
                col2[col2Idx] = card;
                counter++;
                col2Idx++;
            } else {
                col3[col3Idx] = card;
                counter = 1;
                col3Idx++;
            }
        }

        let rearrangedCards: Array<Card> = [];
        if (columnNumber === 1) {
            rearrangedCards = rearrangedCards.concat(col2);
            rearrangedCards = rearrangedCards.concat(col1);
            rearrangedCards = rearrangedCards.concat(col3);
        } else if (columnNumber === 2) {
            rearrangedCards = rearrangedCards.concat(col1);
            rearrangedCards = rearrangedCards.concat(col2);
            rearrangedCards = rearrangedCards.concat(col3);
        } else {
            rearrangedCards = rearrangedCards.concat(col1);
            rearrangedCards = rearrangedCards.concat(col3);
            rearrangedCards = rearrangedCards.concat(col2);
        }

        this.cards.splice(0, this.cards.length);
        this.cards = rearrangedCards;
    }
}

/**
 * Constructs a component which details the cards in a 3 x 7 table.
 * @param props the properties of the card trick.
 */
const ShowCards = (props: any) => (
    // a component needs to return a single root element. Using the fragment <></> to accomplish this.
    <>
        {props.cards.map((c: Card) => (
            <div key={c.index} className="col-4 bg-light">
                <img src={c.imageName} className="img-thumbnail card-image" alt={c.imageName}/>
            </div>
        ))}
    </>
)

/**
 * Constructs a component which shows the chosen card.
 * @param props the properties of the card trick.
 */
const ShowCard = (props: any) => (
    <>
        <br /><br />
        <p className="lead">
            <strong>
                And your card is ...
            </strong>
        </p>
        <br /><br />
        <div key={props.chosenCard.index} className="col-12 bg-light">
            <img src={props.chosenCard.imageName} className="img-thumbnail" alt={props.chosenCard.imageName}/>
        </div>
        <br />
        <small>Heh Heh Heh!!</small>
    </>
)

/**
 * Constructs a component that shows the row of column buttons.
 * @param props the properties of the card trick.
 */
const ShowColumnButtons = (props: any) => (
    <>
        <div className="col-4">
            <button type="button" className="btn btn-primary" onClick={() => props.handleColumn(1)}>Column 1</button>
        </div>
        <div className="col-4">
            <button type="button" className="btn btn-primary" onClick={() => props.handleColumn(2)}>Column 2</button>
        </div>
        <div className="col-4">
            <button type="button" className="btn btn-primary" onClick={() => props.handleColumn(3)}>Column 3</button>
        </div>
    </>
)

/**
 * Constructs a component that displays the card trick.
 * @param props the properties of the card trick.
 */
const CardLayout  = (props: any) => {
    const [cards, setCards] = useState<Card[]>([]);
    const [chosenCard, setChosenCard] = useState<Card>();
    const [clicked, setClicked] = useState<number>(0);
    const gameIsDone = clicked === 3;

    // useEffect will run after the DOM is loaded
    useEffect(() => {
        const deck: Array<Card> = cardTrickModel.openNewDeck();
        cardTrickModel.deal21(deck);
        setCards(cardTrickModel.cards);
    }, []);

    const handlePlayAgain = () => {
        props.attemptHandler();
    };

    const handleColumn = (columnNumber: number) => {
        if (clicked >= 2) {
            const card = cardTrickModel.pickCard(columnNumber);
            setChosenCard(card);
            setClicked(clicked + 1);
        } else {
            cardTrickModel.reDeal21(columnNumber);
            setCards(cardTrickModel.cards);
            setClicked(clicked + 1);
        }
    };

    return (
        gameIsDone ? (
            <div className="container">
                <ShowCard chosenCard={chosenCard} />

                <br /><br />
                <button type="button" className="btn btn-primary" onClick={() => handlePlayAgain()}>
                    Play Again
                </button>
            </div>
        ) : (
            <div className="container">
                <p className="lead">
                    <strong>
                        Pick a card but don't tell me. Instead, just click on the column button where your card lives.
                    </strong>
                </p>

                <div className="row">
                    <ShowColumnButtons handleColumn={handleColumn} />
                </div>

                <div className="row">
                    <ShowCards cards={cards}/>
                </div>

                <div className="row">
                    <ShowColumnButtons handleColumn={handleColumn} />
                </div>
            </div>
        )
    )
}

export default CardLayout;

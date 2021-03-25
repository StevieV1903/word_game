import React, { useState, useEffect } from 'react';
import './GameBoard.css';

const GameBoard = () => {
	const [ wordToGuess, setWordToGuess ] = useState('');
	const [ bankOfWords, setBankOfWords ] = useState([]);

	useEffect(() => {
		setBankOfWords([ 'cat', 'dog', 'fish', 'horse budgie' ]);
	}, []);
	useEffect(
		() => {
			getWordToGuess();
		},
		[ bankOfWords ]
	);

	const displayDashesForWordToGuess = () => {
		let dashesForWordToGuess = '';
		for (let i = 0; i < wordToGuess.length; i++) {
			if (wordToGuess.charAt(i) !== ' ') {
				dashesForWordToGuess += '_ ';
			} else {
				dashesForWordToGuess += '/ ';
			}
		}
		return dashesForWordToGuess;
	};

	const getWordToGuess = () => {
		const randomIndex = Math.floor(Math.random() * bankOfWords.length);
		setWordToGuess(bankOfWords[randomIndex]);
	};

	return (
		<div>
			<p>game board</p>
			{wordToGuess && displayDashesForWordToGuess()}
		</div>
	);
};
export default GameBoard;

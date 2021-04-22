import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard.js';
import Homepage from './components/Homepage.js';
import tmdbApiKey from './ApiKey.js';

function App() {
	const [ bankOfWords, setBankOfWords ] = useState([]);
	const [ categoryChosen, setCategoryChosen ] = useState('');
	const [ allHints, setAllHints ] = useState([]);
	const [ countriesResults, setCountriesResults ] = useState([]);

	const getCountryInfo = (type) => {
		const countryHints = [];
		fetch('https://restcountries.eu/rest/v2/all')
			.then((res) => res.json())
			.then((results) => {
				const countryNamesArray = [];
				results.forEach((result) => {
					countryNamesArray.push(result[type]);
					if (type === 'capital') {
						countryHints.push(result.name);
					} else {
						// if (result.borders[0]) {
						countryHints.push(result.borders[0]);
						// } else {
						// 	countryHints.push('Island');
						// }
					}
				});
				setBankOfWords(countryNamesArray);
				setCountriesResults(results);
				return results;
			})
			.then(() => setAllHints(countryHints))
			.catch((err) => console.error(err));
		if (type === 'name') {
			setCategoryChosen('Country Names');
		} else {
			setCategoryChosen('Capital Names');
		}
		// setAllHints(countryHints);
	};

	const getTvShowNames = (type) => {
		let genres = [];
		fetch('https://api.themoviedb.org/3/genre/' + type + '/list?api_key=' + tmdbApiKey + '&language=en-US') // fetching all possible genres and ids
			.then((res) => res.json())
			.then((data) => {
				genres = data.genres; // setting all genres array
			});
		const pageNumber = Math.floor(Math.random() * 500) + 1;
		fetch(
			'https://api.themoviedb.org/3/' +
				type +
				'/popular?api_key=' +
				tmdbApiKey +
				'&language=en-US&page=' +
				pageNumber
		)
			.then((res) => res.json())
			.then((data) => {
				const tvShowNamesArray = [];
				const genresForAllResults = []; // genres for each result, will be array of arrays
				data.results.forEach((result) => {
					if (
						result.original_language === 'en' &&
						(type === 'movie' ||
							((type === 'tv' && result.origin_country[0] === 'US') ||
								(type === 'tv' && result.origin_country[0] === 'GB'))) //filtering results for US and UK shows
					) {
						if (type === 'tv') {
							tvShowNamesArray.push(result.name);
						} else {
							tvShowNamesArray.push(result.title);
						}
						result.genre_names = []; // adding genre_names property to each TV show
						result.genre_ids.forEach((genre_id) => {
							// looping over all genre_ids for each TV show
							genres.forEach((genre) => {
								// looping over all possible genres
								if (genre.id === genre_id) {
									// checking if this show's genre_id matches, if yes push genre_name
									result.genre_names.push(genre.name);
								}
							});
						});
						genresForAllResults.push(result.genre_names);
					}
				});
				setAllHints(genresForAllResults);
				setBankOfWords(tvShowNamesArray);
				return data;
			})
			.catch((err) => console.error(err));
		if (type === 'tv') {
			setCategoryChosen('TV Shows');
		} else {
			setCategoryChosen('Movies');
		}
	};

	const getMovieStars = () => {
		const pageNumber = Math.floor(Math.random() * 500) + 1;

		fetch(
			'https://api.themoviedb.org/3/person/popular?api_key=' + tmdbApiKey + '&language=en-US&page=' + pageNumber
		)
			.then((res) => res.json())
			.then((data) => {
				const movieStarNames = [];
				let movieStarHints = [];

				data.results.forEach((result) => {
					if (result['known_for'][0].title && result['known_for'][0]['original_language'] === 'en') {
						movieStarNames.push(result.name);
						movieStarHints.push(result['known_for'][0].title);
					}
				});
				setBankOfWords(movieStarNames);
				setAllHints(movieStarHints);
			})
			.catch((err) => console.error(err));

		setCategoryChosen('Movie Stars');
	};

	const getPokemon = () => {
		const pokemonNumber = Math.floor(Math.random() * 898) + 1;
		fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonNumber)
			.then((res) => res.json())
			.then((result) => {
				setBankOfWords([ result.name ]);
				// setAllHints([ result.sprites['front_default'] ]);
				setAllHints([ result.sprites.other['official-artwork']['front_default'] ]);
			})
			.catch((err) => console.error(err));
		setCategoryChosen('Pokemon');
	};

	const getFootballTeams = () => {
		let footballTeamNames = [];
		let footballHint = [];
		let footballLeagueCodes = [ 'en.1', 'en.2', 'de.1', 'es.1', 'fr.1', 'it.1', 'nl.1', 'pt.1' ];
		const randomIndex = Math.floor(Math.random() * footballLeagueCodes.length);
		fetch(
			'https://raw.githubusercontent.com/openfootball/football.json/master/2020-21/' +
				footballLeagueCodes[randomIndex] +
				'.clubs.json'
		)
			.then((res) => res.json())
			.then((results) => {
				results.clubs.forEach((result) => {
					footballTeamNames.push(result.name);
					footballHint.push(result.country);
				});
				setBankOfWords(footballTeamNames);
				setAllHints(footballHint);
				setCategoryChosen('Football Teams');
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className="App">
			<h1>Word Game</h1>
			{bankOfWords.length === 0 && (
				<Homepage
					getTvShowNames={getTvShowNames}
					getCountryInfo={getCountryInfo}
					getMovieStars={getMovieStars}
					getPokemon={getPokemon}
					getFootballTeams={getFootballTeams}
				/>
			)}
			{/* {bankOfWords.length > 0 &&
			allHints.length > 0 && (
				<GameBoard
					setBankOfWords={setBankOfWords}
					bankOfWords={bankOfWords}
					categoryChosen={categoryChosen}
					getTvShowNames={getTvShowNames}
					allHints={allHints}
					getMovieStars={getMovieStars}
					getPokemon={getPokemon}
					setAllHints={setAllHints}
					countriesResults={countriesResults}
				/>
			)} */}

			{bankOfWords.length > 0 &&
			allHints.length > 0 && (
				<GameBoard
					setBankOfWords={setBankOfWords}
					bankOfWords={bankOfWords}
					categoryChosen={categoryChosen}
					getTvShowNames={getTvShowNames}
					allHints={allHints}
					getMovieStars={getMovieStars}
					getPokemon={getPokemon}
					setAllHints={setAllHints}
					countriesResults={countriesResults}
					getFootballTeams={getFootballTeams}
				/>
			)}
		</div>
	);
}

export default App;

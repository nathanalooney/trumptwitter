var twitter = require('twitter');
var stopwords = require('stopwords').english;

var client = new twitter({

});

var params = {screen_name: 'realDonaldTrump' ,count: '200'}

client.get('statuses/user_timeline', params, function(error, tweets, response) {
	if (!error) {
		var collection = [];
		var max_id = tweets[0].id;
		tweets.forEach(function(tweet) {
			if (tweet.id < max_id) max_id = tweet.id;
			collection.push(tweet);
		});
		params.max_id = max_id;
		getAllTweets(client, params, collection)
	} else {
		console.log(error);
	}
});

var getAllTweets = function(client, params, collection) {
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			if (!(tweets.length > 0)) {
				parseTweets(collection);
			} else {
				tweets.shift();
				var max_id = tweets[0].id;
				tweets.forEach(function(tweet) {
					if (tweet.id < max_id) max_id = tweet.id;
					collection.push(tweet);
				});
				params.max_id = max_id;
				console.log(collection.length);
				getAllTweets(client, params, collection)				
			}
		} else {
			console.log(error);
		}
	});
}

var parseTweets = function(collection) {
	var combinedText = '';
	collection.forEach(function(tweet) {
		combinedText+=tweet.text.toLowerCase();
	});
	buildDictionary(combinedText.replace(/[^\w\s]/gi, '').split(' '));
}

var buildDictionary = function(words) {
	wordCount = {};
	words.forEach(function(word) {
		if (wordCount[word] > 0) {
			wordCount[word] += 1;
		}
		else {
			wordCount[word] = 1;
		}
	});
	var listOfWords = Object.keys(wordCount).map(function(key) {
		return [key, wordCount[key]];
	});

	var filteredList = listOfWords.filter(function(word) {
		return stopwords.indexOf(word[0].toLowerCase()) < 0;
	});

	filteredList.sort(function(first, second) {
		return second[1] - first[1];
	})

	console.log(filteredList.slice(0, 200));
}











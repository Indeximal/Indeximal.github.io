const morseCodeDict = {
	'A': '.-',     'B': '-...',   'C': '-.-.', 
	'D': '-..',    'E': '.',      'F': '..-.',
	'G': '--.',    'H': '....',   'I': '..',
	'J': '.---',   'K': '-.-',    'L': '.-..',
	'M': '--',     'N': '-.',     'O': '---',
	'P': '.--.',   'Q': '--.-',   'R': '.-.',
	'S': '...',    'T': '-',      'U': '..-',
	'V': '...-',   'W': '.--',    'X': '-..-',
	'Y': '-.--',   'Z': '--..',
	
	'0': '-----',  '1': '.----',  '2': '..---',
	'3': '...--',  '4': '....-',  '5': '.....',
	'6': '-....',  '7': '--...',  '8': '---..',
	'9': '----.'
};

function getCharFromMorse(morse) {
	c = Object.keys(morseCodeDict).find(key => morseCodeDict[key] === morse);
	return c || " ";
}

$ = (id) => document.querySelector(id);

function main() {
	// https://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep/13194087
	// https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
	// https://github.com/mdn/violent-theremin/blob/gh-pages/scripts/app.js

	// create web audio api context
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();

	oscillator.connect(gainNode);
	oscillator.start();

	gainNode.gain.value = 0;
	gainNode.connect(audioCtx.destination);

	function disconnectIfIdle() {
		// console.log("attempt");
		if (gainNode.gain.value === 0) {
			gainNode.disconnect(audioCtx.destination);
			// console.log("muted");
		}
	}

	function startBeep(freq, volume, fadeIn=0) {
		gainNode.connect(audioCtx.destination);
		oscillator.frequency.value = freq;
		gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + fadeIn);
	}

	function stopBeep(fadeOut=0) {
		gainNode.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + fadeOut);
		window.setTimeout(disconnectIfIdle, fadeOut*1000*2+5);
	}

	function beep(duration, freq, volume) {
		startBeep(freq, volume);
		window.setTimeout(stopBeep, duration);
	}

	function playMorseString(mstr, unit, freq, volume) {
		if (mstr === undefined) { return; }
		tcursor = 0;
		shortBeep = () => beep(unit, freq, volume);
		longBeep = () => beep(unit * 3, freq, volume);
		for (c of mstr) {
			if (c == ".") {
				window.setTimeout(shortBeep, tcursor * unit);
				tcursor += 2;
			} else if (c == "-") {
				window.setTimeout(longBeep, tcursor * unit);
				tcursor += 4;
			} else if (c == " ") {
				tcursor += 2;
			}
		}
	}


	var currentMorse = "";
	function updateMorse() {
		document.getElementById("morse").innerHTML = currentMorse;
		if (getCharFromMorse(currentMorse) === targetChar) {

		}
	}

	var targetChar = "";
	// var charset = "abcdefghijklmnopqrstuvwxyz";
	// function updateCharset() {
	// 	charset = document.getElementById("charset").value;
	// 	// targetChar = charset[Math.floor(Math.random()*charset.length)];
	// 	// document.getElementById("targetchar").innerHTML = targetChar;
	// }

	function getSoundSettings() {
		beepUnit = Number(document.getElementById("beepunit").value);
		freq = Number(document.getElementById("frequency").value);
		volume = Number(document.getElementById("volume").value) / 100;
		return [beepUnit, freq, volume];
	}

	var charsetInput;

	function playNextCharacter() {
		charset = charsetInput.value;
		[beepUnit, freq, volume] = getSoundSettings();
		targetChar = charset[Math.floor(Math.random()*charset.length)].toUpperCase();
		playMorseString(morseCodeDict[targetChar], beepUnit, freq, volume);
		console.log(targetChar);
	}

	function setCharsetEvent(e) {
		$("#charset").value = e.target.getAttribute("charset");
	}

	window.onload = function() {
		for (button of document.getElementsByClassName("presetcharsetbutton")) {
			button.onclick = setCharsetEvent;
		}

		charsetInput = $("#charset");

		document.getElementById("buttonPlay").onclick = playNextCharacter;

		$("#charinput").addEventListener("input", function(e) {
			if (e.data.toUpperCase() == targetChar) {
				correctCounter += 1;
				targetChar = "";
				$("#counterCorrect").innerHTML = correctCounter;
				window.setTimeout(playNextCharacter, 500);
			}
			totalAttempts += 1;
			$("#counterAttempts").innerHTML = totalAttempts;
			e.target.value = "";
		});
	};

	var totalAttempts = 0;
	var correctCounter = 0;

	window.onkeydown = function (e) {
		beepUnit = document.getElementById("beepunit").value;
		freq = document.getElementById("frequency").value;
		volume = document.getElementById("volume").value / 100;
		if (e.key == " ") { // Space
			startBeep(freq, volume);
		} else if (e.key == ".") { // Dot
			currentMorse += ".";
			updateMorse()
			beep(beepUnit, freq, volume);
		} else if (e.key == "-") { // Dash
			currentMorse += "-";
			updateMorse();
			beep(beepUnit*3, freq, volume);
		} else if (e.key == "Enter") { // Enter
			beep(beepUnit, freq*2, volume);
		}
	};
	window.onkeyup = function (e) {
		if (e.key == " " || e.key == "Escape") {
			stopBeep();
		}
	};

}

main();
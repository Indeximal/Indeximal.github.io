function changeBGColor(color) {
	document.body.style = "background-color: "+color+";"
}


var bigBreakNeeded = false;

window.setInterval(function() {
	bigBreakNeeded = true;
	if (waitingforstart) {
		changeBGColor("#cc3232");
	}
}, 60*60*1000);

var waitingforstart = false;

function startIdle() {
	changeBGColor("#2dc937"); // green
	waitingforstart = false;
	window.setTimeout(function() {
		changeBGColor(bigBreakNeeded ? "#cc3232" : "#db7b2b"); // red : orange
		if (notificationsOn) {
			notifyRestDue();
		}
		waitingforstart = true;
	}, 5*60*1000);
}
startIdle();

var doneAudio = new Audio("https://notificationsounds.com/notification-sounds/light-562/download/mp3");
doneAudio.volume = 0.5;
function notifyDone() {
	doneAudio.play();
	if (Notification.permission === "granted") {
		var options = { 
			renotify: true, 
			tag: "done"
		}
		var notification = new Notification("You can continue!", options);
		notification.onclick = function(event) {
			notification.close();
		};
	}
}

var beginAudio = new Audio("https://notificationsounds.com/message-tones/appointed-529/download/mp3");
beginAudio.volume = 0.5;
function notifyRestDue() {
	beginAudio.play();
	if (Notification.permission === "granted") {
		var options = { 
			renotify: true, 
			tag: "begin"
		}
		msg = bigBreakNeeded ? "Go and rest your eyes for a minute!" : "Take a quick break!";
		var notification = new Notification(msg, options);
		notification.onclick = function(event) {
			event.preventDefault();
			notification.close();
			startRest();
		};
	}
}

function startRest() {
	if (!waitingforstart) return;

	changeBGColor("#e7b416"); // yellow
	window.setTimeout(function() {
		if (notificationsOn) {
			notifyDone();
		}
		startIdle();
	}, bigBreakNeeded ? 60*1000 : 10*1000);
	waitingforstart = false;
	bigBreakNeeded = false;
}

window.onclick = function() {
	if (waitingforstart) {
		startRest();
	}
};


var bell = document.getElementById("bell");
var bellOn = document.getElementById("bell_on");
var bellOff = document.getElementById("bell_off");

var notificationsOn = false;

bell.onclick = function() {
	if (notificationsOn) {
		bellOn.classList.add("hidden");
		bellOff.classList.remove("hidden");
		notificationsOn = false;
	} else { // Enable Notifications
		bellOn.classList.remove("hidden");
		bellOff.classList.add("hidden");
		notificationsOn = true;

		Notification.requestPermission();
	}
};







app.service('$localStorage', function ($window) {
	this.setItem = (key, value) => $window.localStorage.setItem(key, JSON.stringify(value));
	this.getItem = key => JSON.parse($window.localStorage.getItem(key));
	this.removeItem = key => $window.localStorage.removeItem(key);
});

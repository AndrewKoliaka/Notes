app.service('$errorAlert', function () {
	this.show = error => {
		alert(`Something went wrong. ${error.data}`);
		console.error(error);
	}
});

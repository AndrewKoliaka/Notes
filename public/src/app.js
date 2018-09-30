const app = angular.module('notesApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'src/views/login/login.html'
		})
		.state('sign-up', {
			url: '/sign-up',
			templateUrl: 'src/views/sign-up/sign-up.html'
		})
		.state('notes', {
			url: '/notes',
			templateUrl: 'src/views/notes/notes.html',
			onEnter($localStorage, $labels, $state, $timeout) {
				if (!$localStorage.getItem($labels.IS_LOGGED)) {
					$timeout(() => $state.go('login'));
				}
			}
		});

	$urlRouterProvider.otherwise('/notes');
});

app.service('$localStorage', function ($window) {
	this.setItem = (key, value) => $window.localStorage.setItem(key, value);
	this.getItem = key => $window.localStorage.getItem(key);
	this.removeItem = key => $window.localStorage.removeItem(key);
});

app.directive('passwordRepeat', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		replace: true,
		link($scope, elem, attrs, ctrl) {
			ctrl.$validators.passwordRepeat = modelValue => modelValue === $scope.notesScope.auth.password;
		}
	}
});

app.constant('$labels', {
	IS_LOGGED: 'notesAppLogin'
});

app.controller('notes', function ($scope, $localStorage, $labels, $state) {
	this.$onInit = () => {

		$scope.notesScope = {
			note: '',
			notes: [{
				id: 1,
				text: 'Hello',
				date: new Date().toGMTString()
			}],
			auth: {
				name: '',
				email: '',
				password: '',
				repeatedPassword: ''
			},
			noteToEdit: null
		}

		$scope.notesScope.auth.isLogged = $localStorage.getItem($labels.IS_LOGGED);
	}

	this.remove = id => {
		$scope.notesScope.notes = $scope.notesScope.notes.filter(note => note.id !== id);
	}

	this.add = () => {
		if (!$scope.notesScope.note) return;

		const note = {
			id: Date.now(),
			text: $scope.notesScope.note,
			date: new Date().toGMTString()
		};

		$scope.notesScope.notes.push(note);
		$scope.notesScope.note = '';
	}

	this.edit = id => {
		const noteToEdit = $scope.notesScope.notes.find(note => note.id === id);
		if (noteToEdit) {
			$scope.notesScope.noteToEdit = noteToEdit;
			$scope.notesScope.note = noteToEdit.text;
		}
	}

	this.update = () => {
		$scope.notesScope.noteToEdit.text = $scope.notesScope.note;
		$scope.notesScope.noteToEdit.date = new Date().toGMTString();
		$scope.notesScope.noteToEdit = null;
		$scope.notesScope.note = '';
	}

	this.login = () => {
		if ($scope.notesScope.auth.email && $scope.notesScope.auth.password) {
			$localStorage.setItem($labels.IS_LOGGED, true);
			$scope.notesScope.auth.isLogged = true;
			$state.go('notes');
			return true;
		}

		return false;
	}

	this.signUp = () => {
		if (
			$scope.notesScope.auth.email &&
			$scope.notesScope.auth.password &&
			$scope.notesScope.auth.repeatedPassword
		) {
			// Sign up logic goes here

			this.login();
			return true;
		}

		return false;
	}

	this.signOut = () => {
		if ($localStorage.getItem($labels.IS_LOGGED)) {
			$localStorage.removeItem($labels.IS_LOGGED);
			$scope.notesScope.auth.isLogged = false;
			$state.go('login');
			return true;
		}

		return false;
	}
});
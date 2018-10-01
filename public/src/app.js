const app = angular.module('notesApp', ['ui.router', 'ngResource']);

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
				if (!$localStorage.getItem($labels.LOGIN)) {
					$timeout(() => $state.go('login'));
				}
			}
		});

	$urlRouterProvider.otherwise('/notes');
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
	LOGIN: 'loginDataData'
});

app.constant('$api', {
	login: '/api/login',
	register: '/api/register',
	getNotes: '/api/users/:id/notes',
	postNote: '/api/notes',
	updateNote: '/api/notes/:id',
	deleteNote: '/api/notes/:id'
});

app.service('$localStorage', function ($window) {
	this.setItem = (key, value) => $window.localStorage.setItem(key, JSON.stringify(value));
	this.getItem = key => JSON.parse($window.localStorage.getItem(key));
	this.removeItem = key => $window.localStorage.removeItem(key);
});

app.service('$data', function ($resource, $api) {
	this.login = params => $resource($api.login).save(params).$promise;
	this.register = params => $resource($api.register).save(params).$promise;
	this.getNotes = id => $resource($api.getNotes, { id }).get().$promise;
	this.postNote = params => $resource($api.postNote).save(params).$promise;
	this.updateNote = (id, params) => $resource($api.updateNote, { id }).save(params).$promise;
	this.deleteNote = id => $resource($api.deleteNote, { id }).delete().$promise;
});

app.controller('notes', function ($scope, $localStorage, $labels, $state, $data) {
	this.$onInit = () => {

		$scope.notesScope = {
			note: '',
			notes: [],
			auth: {
				name: '',
				email: '',
				password: '',
				repeatedPassword: ''
			},
			noteToEdit: null
		}

		$scope.notesScope.loginData = $localStorage.getItem($labels.LOGIN);

		$scope.$watch(() => $state.current.name, (name) => {
			if (name === 'notes') {
				this.getNotes();
			}
		});
	}

	this.getNotes = () => {
		if ($scope.notesScope.loginData) {
			const userId = $scope.notesScope.loginData.id

			$data.getNotes(userId)
				.then(res => {
					$scope.notesScope.notes = res.notes;
				 })
				.catch(this.showErrorAlert);
		}
	}

	this.remove = id => {
		$data.deleteNote(id)
			.then(() => $scope.notesScope.notes = $scope.notesScope.notes.filter(note => note._id !== id))
			.catch(this.showErrorAlert);
	}

	this.add = () => {
		if (!$scope.notesScope.note) return;

		const note = {
			userId: $scope.notesScope.loginData.id,
			text: $scope.notesScope.note,
			date: new Date()
		};

		$data.postNote(note)
			.then(() => {
				this.getNotes();
				$scope.notesScope.note = '';
			})
			.catch(this.showErrorAlert);
	}

	this.edit = id => {
		const noteToEdit = $scope.notesScope.notes.find(note => note._id === id);
		if (noteToEdit) {
			$scope.notesScope.noteToEdit = noteToEdit;
			$scope.notesScope.note = noteToEdit.text;
		}
	}

	this.update = () => {
		const id = $scope.notesScope.noteToEdit._id;
		const text = $scope.notesScope.note;

		$data.updateNote(id, { text })
			.then(() => {
				this.getNotes();
				$scope.notesScope.noteToEdit = null;
				$scope.notesScope.note = '';
			})
			.catch(this.showErrorAlert);
	}

	this.login = () => {
		if ($scope.notesScope.auth.email && $scope.notesScope.auth.password) {
			$data.login($scope.notesScope.auth)
				.then(res => {
					const userData = {
						id: res.id,
						name: res.name,
						email: res.email
					}
					$localStorage.setItem($labels.LOGIN, userData);
					$scope.notesScope.loginData = userData;
					$state.go('notes');
				 })
				.catch(this.showErrorAlert)
		}
	}

	this.signUp = () => {
		if (
			$scope.notesScope.auth.email &&
			$scope.notesScope.auth.password &&
			$scope.notesScope.auth.repeatedPassword
		) {
			$data.register($scope.notesScope.auth)
				.then(res => {
					const userData = {
						id: res.id,
						name: res.name,
						email: res.email
					}
					$localStorage.setItem($labels.LOGIN, userData);
					$scope.notesScope.loginData = userData;
					$state.go('notes');
				})
				.catch(this.showErrorAlert);
		}
	}

	this.signOut = () => {
		if ($localStorage.getItem($labels.LOGIN)) {
			$localStorage.removeItem($labels.LOGIN);
			$scope.notesScope.loginData = null;
			$state.go('login');
		}
	}

	this.showErrorAlert = error => {
		alert(`Something went wrong. ${error.data}`);
		console.error(error);
	}
});
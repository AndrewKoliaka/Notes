const app = angular.module('notesApp', ['ui.router', 'ngResource']);

app.config(function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'src/views/login/login.html',
			controller: 'auth.controller',
			controllerAs: 'authCtrl'
		})
		.state('sign-up', {
			url: '/sign-up',
			templateUrl: 'src/views/sign-up/sign-up.html',
			controller: 'auth.controller',
			controllerAs: 'authCtrl'
		})
		.state('notes', {
			url: '/notes',
			templateUrl: 'src/views/notes/notes.html',
			controller: 'notes.controller',
			controllerAs: 'notesCtrl',
			onEnter($authData, $state, $timeout) {
				if (!$authData.isLogged()) {
					$timeout(() => $state.go('login'));
				}
			}
		});

	$urlRouterProvider.otherwise('/notes');
});
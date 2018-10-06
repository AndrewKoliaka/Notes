app.directive('passwordRepeat', function () {
	return {
		require: 'ngModel',
		restrict: 'A',
		scope: {
			model: '=passwordRepeat'
		},
		link(scope, elem, attrs, ctrl) {
			ctrl.$validators.passwordRepeat = currentValue => currentValue === scope.model;
		}
	}
});
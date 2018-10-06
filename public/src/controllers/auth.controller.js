app.controller('auth.controller', function ($scope, $errorAlert, $authData, $state) {
  this.$onInit = () => {
    $scope.auth = {
      data: {
        name: '',
        email: '',
        password: '',
        repeatedPassword: ''
      },
      isSpinner: false,
      isLogged: false
    }

    $scope.auth.isLogged = $authData.isLogged();
  }

  this._showSpinner = () => {
		$scope.auth.isSpinner = true;
	}

	this._hideSpinner = () => {
		$scope.auth.isSpinner = false;
	}

  this.login = () => {
    if (
      !$scope.auth.data.email ||
      !$scope.auth.data.password
    ) return;

    this._showSpinner();
    $authData.login($scope.auth.data)
      .then(() => {
        $scope.auth.isLogged = true;
        $state.go('notes');
      })
      .catch($errorAlert.show)
      .finally(this._hideSpinner);
  }

  this.register = () => {
    if (
      !$scope.auth.data.email ||
      !$scope.auth.data.password ||
      !$scope.auth.data.repeatedPassword
    ) return;

    this._showSpinner();
    $authData.register($scope.auth.data)
      .then(() => {
        $scope.auth.isLogged = true;
        $state.go('notes');
      })
      .catch($errorAlert.show)
      .finally(this._hideSpinner);
  }

  this.signOut = () => {
    $authData.signOut()
      .then(() => {
        $scope.auth.isLogged = false;
        $state.go('login');
      })
      .catch($errorAlert.show);
  }
});
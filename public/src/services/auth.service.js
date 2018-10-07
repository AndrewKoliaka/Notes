app.service('$authData', function ($data, $localStorage, $labels, $q) {

    this.isLogged = () => !!$localStorage.getItem($labels.LOGIN);

    this.getUserData = () => $localStorage.getItem($labels.LOGIN);

    this.login = (loginData = {}) =>
        $data.login(loginData)
        .then(res => {
            $localStorage.setItem($labels.LOGIN, {
                id: res.id
            });

            return res;
        });

    this.register = (registerData = {}) =>
        $data.register(registerData)
        .then(res => {
            $localStorage.setItem($labels.LOGIN, {
                id: res._id
            });

            return res;
        });


    this.signOut = () => {
        var deferred = $q.defer();

        if (this.isLogged()) {
            $localStorage.removeItem($labels.LOGIN);
            deferred.resolve();
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }
});

app.service('$data', function ($resource, $api) {
	this.login = params => $resource($api.login).save(params).$promise;
	this.register = params => $resource($api.register).save(params).$promise;
	this.getNotes = id => $resource($api.getNotes, { id }).get().$promise;
	this.postNote = params => $resource($api.postNote).save(params).$promise;
	this.updateNote = (id, params) => $resource($api.updateNote, { id }).save(params).$promise;
	this.deleteNote = id => $resource($api.deleteNote, { id }).delete().$promise;
});
app.controller('notes.controller', function ($scope, $data, $errorAlert, $authData) {
	this.$onInit = () => {

		$scope.notesScope = {
			note: '',
			notes: [],
			noteToEdit: null,
			isSpinner: false
		};

    this.getNotes();
	}

	this.getNotes = () => {
    if (!$authData.isLogged()) return;

    const userId = $authData.getUserData().id;

    $scope.notesScope.isSpinner = true;
    $data.getNotes(userId)
      .then(res => { $scope.notesScope.notes = res.notes; })
      .catch($errorAlert.show)
      .finally(() => { $scope.notesScope.isSpinner = false; });
	}

	this.remove = id => {
		$data.deleteNote(id)
			.then(() => $scope.notesScope.notes = $scope.notesScope.notes.filter(note => note._id !== id))
			.catch($errorAlert.show);
	}

	this.add = () => {
		if (!$scope.notesScope.note) return;

		const note = {
			userId: $authData.getUserData().id,
			text: $scope.notesScope.note,
			date: new Date()
		};

		$data.postNote(note)
			.then(() => {
				this.getNotes();
				$scope.notesScope.note = '';
			})
			.catch($errorAlert.show);
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
			.catch($errorAlert.show);
	}


});
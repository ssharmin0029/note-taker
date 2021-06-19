const noteTitle = document.querySelector('.note-title');
const noteText = document.querySelector('.note-textarea');
const saveNoteBtn = document.querySelector('.save-note');
const newNoteBtn = document.querySelector('.new-note');
const noteList = document.querySelector('.list-container');

// variable to hold the active note
let activeNote = {};

// headers to be used in all of the API calls
const headers = { 'Content-Type': 'application/json' };

// Helper method to show an element
const show = el => {
  el.style.display = 'inline';
};

// Helper method to hide an element
const hide = el => {
  el.style.display = 'none';
};

// render the active note
const renderActiveNote = () => {
  hide( saveNoteBtn );

  if ( activeNote.id ) {
		// saved notes are readonly
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
		// new notes can be edited
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// sets the activeNote and renders it
const renderSavedNote = e => {
	// get the note from the event target's dataset
  activeNote = JSON.parse( e.target.dataset.note );

  renderActiveNote();
};

// clear out the active note and render
const renderNewNote = () => {
  activeNote = {};
	
  renderActiveNote();

	noteTitle.focus();
};

// only render the save button if the forms fields are complete
const renderSaveButton = () => {
  !noteTitle.value.trim() || !noteText.value.trim()
		? hide( saveNoteBtn )
  	: show( saveNoteBtn );
};

const renderNotes = notes => {
	if ( notes.length ) {
		 // clear out the noteList
		noteList.innerHTML = '';

		notes.forEach( ( note ) => { // destructure the title property from the note
			// create an li to represent the saved note
			const liEl = document.createElement( 'li' );
			liEl.classList.add( 'list-group-item' );
			// save a JSON version of the note in the li dataset
			liEl.dataset.note = JSON.stringify( note );
			// run the renderSavedNote function on click
			liEl.addEventListener( 'click', renderSavedNote );

			// create a span
			const spanEl = document.createElement('span');
			// set it's text to the note's title
			spanEl.innerText = note.title;

			// add the span to the li
			liEl.append( spanEl );

			// create a delete button
			const delBtnEl = document.createElement('i');
			delBtnEl.classList.add( 'fas', 'fa-trash-alt', 'float-right', 'text-danger','delete-note' );
			// run the deleteNote function on click
			delBtnEl.addEventListener( 'click', deleteNote );

			// add the button to the li
			liEl.append( delBtnEl );

			// add the li to the list of notes
			noteList.append( liEl );
		});
	} else {
		noteList.innerHTML = `<li class="list-group-item"><span>No saved notes</span></li>`
	}
};

// save a new note
const saveNote = () => {
	// get the values of the inputs and create a new note object
  const note = {
    title: noteTitle.value,
    text: noteText.value,
  };

	// post the new note to the server
	fetch('/api/notes', {
    method: 'POST',
		 // shorthand for `headers: headers`
    headers,
		 // send the new note as JSON
    body: JSON.stringify( note ),
  })
		.then(newNote => {
			// call getNotes to update the list to include the newly added note
    	getNotes();

			renderNewNote();
  	})
		.catch( err => {
			console.error( err );
		});
};

// delete a note
// called with a click event
const deleteNote = e => { // destructure the traget of the event and name it 'note'
  // prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

	// get the id of the note to be deleted from the parent li's dataset
  const { id } = JSON.parse( e.target.parentElement.getAttribute( 'data-note' ) );

  if ( activeNote.id === id ) {
		 // if the note you are deleting is the active note, clear it out
    renderNewNote();
  }

	// delete the note on the server
  fetch( `/api/notes/${ id }`, {
    method: 'DELETE',
		// shorthand for `headers: headers`
    headers,
  })
		.then( () => {
			// call getNotes to update the list to not include the deleted note
    	getNotes();
  	})
		.catch( err => {
			console.error( err );
		});
};

// get all of the notes
const getNotes = () => {
	// get the notes from the server
	fetch( '/api/notes', {
		method: 'GET',
		 // shorthand for `headers: headers`
    headers,
  })
		.then( res => res.json() )
		.then( notes => {
			// pass the data into the renderNotes function
			renderNotes( notes );
		})
		.catch( err => {
			console.error( err );
			noteList.innerHTML = `<li class="list-group-item"><span>No saved notes</span></li>`
		});
};

// init function via an immediately invoked function expression (IIFE)
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
( () => {
	// add event listeners
  saveNoteBtn.addEventListener('click', saveNote);
  newNoteBtn.addEventListener('click', renderNewNote);
  noteTitle.addEventListener('input', renderSaveButton);
  noteText.addEventListener('input', renderSaveButton);

	// fetch our saved notes
	getNotes();
	// focus the user on the title input
	noteTitle.focus();
} )();


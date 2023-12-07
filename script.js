var noteIndex = 1; // Initialize note index

// Check for existing notes in local storage on page load
window.onload = function () {
    var storedNotes = JSON.parse(localStorage.getItem('notes'));
    if (storedNotes) {
        noteIndex = storedNotes.length + 1;
        storedNotes.forEach(function (note) {
            displayNote(note);
        });
    }
};

//  <======ADD NOTES=======>

function addNote() {
    var title = document.getElementById('add-title').value;
    var noteText = document.getElementById('add-notes').value;

    if (title.trim() !== '' && noteText.trim() !== '') {
        var note = {
            index: noteIndex,
            title: title,
            text: noteText,
            color: getRandomColor()
        };

        displayNote(note);
        saveNoteToLocalStorage(note);

        document.getElementById('add-title').value = '';
        document.getElementById('add-notes').value = '';

        noteIndex++;
    } else {
        alert('Please enter both title and notes before adding.');
    }
}

// function displayNote(note) {
//     var noteElement = document.createElement('div');
//     noteElement.className = 'note';
//     noteElement.style.backgroundColor = note.color;
//     noteElement.innerHTML = `
//         <div class="note-header">
//             <h3>Note ${note.index}</h3>
//             <div class="note-buttons">
//                 <button class="edit-button" onclick="editNote(${note.index})">Edit</button>
//                 <button class="delete-button" onclick="deleteNote(${note.index})">Delete</button>
//             </div>
//         </div>
//         <div class="title-notes">
//            <h3>Title:-${note.title}</h3>
//             <p>Note:-${note.text}</p>
//         </div>
//     `;

//     document.getElementById('notes-container').appendChild(noteElement);
// }

//  <======DISPLAY NOTES=======>

function displayNote(note) {
    var noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.setAttribute('data-index', note.index); // Add this line

    noteElement.style.backgroundColor = note.color;
    noteElement.innerHTML = `
        <div class="note-header">
            <h3>Note ${note.index}</h3>
            <div class="note-buttons">
                <button class="edit-button" onclick="editNote(${note.index})">Edit</button>
                <button class="delete-button" onclick="deleteNote(${note.index})">Delete</button>
            </div>
        </div>
        <div class="title-notes">
           <h3>Title:-${note.title}</h3>
            <p>Note:-${note.text}</p>
        </div>
    `;

    document.getElementById('notes-container').appendChild(noteElement);
}


function saveNoteToLocalStorage(note) {
    var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    storedNotes.push(note);
    localStorage.setItem('notes', JSON.stringify(storedNotes));
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// <======EDIT NOTES=======>

function editNote(index) {
    // Retrieve the note from local storage based on the index
    var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    var noteToEditIndex = storedNotes.findIndex(note => note.index === index);

    if (noteToEditIndex !== -1) {
        var noteToEdit = storedNotes[noteToEditIndex];

        // Populate the form fields with the existing data
        document.getElementById('add-title').value = noteToEdit.title;
        document.getElementById('add-notes').value = noteToEdit.text;

        // Ask for confirmation before updating the note
        var confirmation = confirm("Are you sure you want to update this note?");

        if (confirmation) {
            // Update the note in the stored array
            noteToEdit.title = document.getElementById('add-title').value;
            noteToEdit.text = document.getElementById('add-notes').value;

            // Update the local storage
            localStorage.setItem('notes', JSON.stringify(storedNotes));

            // Update the note with the same index in the display
            updateNoteInDisplay(noteToEdit, noteToEditIndex);
        }
    } else {
        alert('Note not found for editing.');
    }
}

function updateNoteInDisplay(updatedNote, index) {
    // Update the note element in the display based on the index
    var notesContainer = document.getElementById('notes-container');
    var noteElement = notesContainer.querySelector(`.note[data-index="${index}"]`);

    if (noteElement) {
        noteElement.querySelector('.title-notes h3').textContent = `Title:-${updatedNote.title}`;
        noteElement.querySelector('.title-notes p').textContent = `Note:-${updatedNote.text}`;
    }
}

//  <======DELETE NOTES=======>

function deleteNote(index) {
    // Retrieve the note from local storage based on the index
    var storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    var noteToDeleteIndex = storedNotes.findIndex(note => note.index === index);

    if (noteToDeleteIndex !== -1) {
        // Remove the note from the array
        storedNotes.splice(noteToDeleteIndex, 1);

        // Update local storage
        localStorage.setItem('notes', JSON.stringify(storedNotes));

        // Remove the note from the display
        deleteNoteFromDisplay(index);
    } else {
        alert('Note not found for deletion.');
    }
}

function deleteNoteFromDisplay(index) {
    // Remove the note element from the display based on the index
    var notesContainer = document.getElementById('notes-container');
    var noteElement = notesContainer.querySelector(`.note[data-index="${index}"]`);

    if (noteElement) {
        notesContainer.removeChild(noteElement);
    }
}

//  <======DISPLAY ALL NOTES=======>

function deleteAll() {
    // Ask for confirmation before deleting all notes
    var confirmation = confirm("Are you sure you want to delete all notes?");
    
    if (confirmation) {
        var notesContainer = document.getElementById('notes-container');
        // Remove all child elements (notes) from the notes container
        while (notesContainer.firstChild) {
            notesContainer.removeChild(notesContainer.firstChild);
        }

        // Clear the local storage
        localStorage.removeItem('notes');
    }
}

//   <======SEARCH NOTES=======>

function searchNotes() {
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
    var notesContainer = document.getElementById('notes-container');
    var notes = notesContainer.getElementsByClassName('note');

    for (var i = 0; i < notes.length; i++) {
        var title = notes[i].querySelector('.title-notes h3').textContent.toLowerCase();
        var text = notes[i].querySelector('.title-notes p').textContent.toLowerCase();
        var isVisible = title.includes(searchTerm) || text.includes(searchTerm);
        
        notes[i].style.display = isVisible ? 'block' : 'none';
    }
}

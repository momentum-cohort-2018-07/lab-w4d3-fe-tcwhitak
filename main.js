// import shoelace css
import 'shoelace-css/dist/shoelace.css'
import './main.css'

import request from 'superagent'

// what happens when you hit new note link
document.getElementById('newNoteLink').addEventListener('click', event => {
  if (document.getElementById('new-note-form').classList.contains('hidden')) {
    document.getElementById('new-note-form').classList.remove('hidden')
  } else {
    document.getElementById('new-note-form').classList.add('hidden')
  }
})
// what happens when you hit submit
document.getElementById('new-note-form').addEventListener('submit', event => {
  event.preventDefault()
  // get value of tags input, split on commas, trim values and place in new array of strings for import to api
  let newNoteTags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim())
  // gather data from note form in one object
  let formData = {
    title: document.getElementById('note-title').value.trim(),
    text: document.getElementById('note-text').value.trim(),
    tags: newNoteTags
  }
  // post data to api and call refresh of notes list to display note
  request.post('https://notes-api.glitch.me/api/notes')
    .auth('testUser', 'testPass')
    .send(formData)
    .then(response => {
      document.getElementById('new-note-form').reset()
      loadNotes()
    })
})
// creates dom node containing note title, body, tags, and buttons
function createNoteDOM (note) {
  let notesList = document.getElementById('notesList')
  let noteLi = document.createElement('li')
  noteLi.classList.add('note')
  noteLi.id = `${note._id}`
  noteLi.innerHTML = `<h3 class="noteTitle">${note.title}</h3> 
    <p class="noteText">${note.text}</p>`
  if (note.tags) {
    let tagsList = document.createElement('ul')
    tagsList.classList.add('tags')
    for (let tag of note.tags) {
      let tagLi = document.createElement('li')
      tagLi.classList.add('tag')
      tagLi.innerText = tag
      tagsList.appendChild(tagLi)
    }
    noteLi.appendChild(tagsList)
  }
  // create and append link that deletes note
  let deleteLink = document.createElement('a')
  deleteLink.href = '#'
  deleteLink.classList.add('deleteLink')
  deleteLink.innerHTML = '<i class="fas fa-trash"></i>'
  deleteLink.addEventListener('click', event => {
    deleteNote(note)
  })
  noteLi.appendChild(deleteLink)

  // create and append link that edits note
  let editLink = document.createElement('a')
  editLink.href = '#'
  editLink.classList.add('editLink')
  editLink.innerHTML = '<i class="fas fa-edit"></i>'
  editLink.addEventListener('click', event => {
    editNote(note)
  })
  noteLi.appendChild(editLink)

  // append note to notesList ul
  notesList.appendChild(noteLi)
}
// what happens when you click the delete link
function deleteNote (note) {
  request.delete(`https://notes-api.glitch.me/api/notes/${note._id}`)
    .auth('testUser', 'testPass')
    .then(response => {
      document.getElementById(`${note._id}`).remove()
    })
}
// what happens when you click the edit link
function editNote (note) {
  console.log('edit started')
}
// what happens on page load and called when new notes are added to refresh list
function loadNotes () {
  let notesList = document.getElementById('notesList')
  // clear list displayed
  notesList.innerHTML = ''
  // add updated list
  request.get('https://notes-api.glitch.me/api/notes')
    .auth('testUser', 'testPass')
    .then(response => {
      let notes = response.body.notes
      for (let note of notes) {
        createNoteDOM(note)
      }
    })
}

// calls loadNotes to fill page with current notes in api, *only works with "defer" in script tag on index.html*
loadNotes()

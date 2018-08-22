import request from 'superagent'

document.getElementById('new-note-form').addEventListener('submit', event => {
  event.preventDefault()
  let newNoteTags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim())
  let formData = {
    title: document.getElementById('note-title').value.trim(),
    text: document.getElementById('note-text').value.trim(),
    tags: newNoteTags
  }
  request.post('https://notes-api.glitch.me/api/notes')
    .auth('testUser', 'testPass')
    .send(formData)
    .then(response => {
      document.getElementById('new-note-form').reset()
      loadNotes()
    })
})

// document.getElementById('new-note-form').addEventListener('submit', event => {
//   event.preventDefault()

//   let text = getId('note-text').value.split(',').map(author => author.trim())

//   let formData = {
//     title:
//     text: getId('book-title').value.trim(),
//     tags: text,
//   }

//   request.post('https://notes-api.glitch.me/api/notes')
//     .send(formData)
//     .then(response => {
//       document.getElementById('new-note-form').reset()
//       let book = response.body
//       addBookToPage(book)
//     })
// })

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
  let deleteLink = document.createElement('a')
  deleteLink.href = '#'
  deleteLink.classList.add('deleteLink')
  deleteLink.innerText = 'x'
  deleteLink.addEventListener('click', event => {
    deleteNote(note)
  })
  noteLi.appendChild(deleteLink)
  notesList.appendChild(noteLi)
}

function deleteNote (note) {
  request.delete(`https://notes-api.glitch.me/api/notes/${note._id}`)
    .auth('testUser', 'testPass')
    .then(response => {
      document.getElementById(`${note._id}`).remove()
    })
}

function loadNotes () {
  let notesList = document.getElementById('notesList')
  notesList.innerHTML = ''

  request.get('https://notes-api.glitch.me/api/notes')
    .auth('testUser', 'testPass')
    .then(response => {
      let notes = response.body.notes
      for (let note of notes) {
        createNoteDOM(note)
      }
    })
}

loadNotes()

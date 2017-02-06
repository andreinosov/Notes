import React, { Component } from 'react';
import './App.css';

class Color extends Component {
  changeRed() {
    var newColor = 'red';
    this.props.onChangeColor(newColor);
  }
  changeYellow() {
    var newColor = 'yellow';
    this.props.onChangeColor(newColor);
  }
  changeBlue() {
    var newColor = 'blue';
    this.props.onChangeColor(newColor);
  }
  changePink() {
    var newColor = 'pink';
    this.props.onChangeColor(newColor);
  }
  changeOrange() {
    var newColor = 'orange';
    this.props.onChangeColor(newColor);
  }
  render() {
    return (
      <div className='change-color'>
        <button className='red' onClick={this.changeRed.bind(this)} />
        <button className='yellow' onClick={this.changeYellow.bind(this)} />
        <button className='blue' onClick={this.changeBlue.bind(this)} />
        <button className='pink' onClick={this.changePink.bind(this)} />
        <button className='orange' onClick={this.changeOrange.bind(this)} />
      </div>
    );
  }
}

class Note extends Component {
  render() {
    var styles = {backgroundColor: this.props.color};
    return (
      <div style={styles} className='note'>
        <span className='delete-note' onClick={this.props.onDelete}>x</span>
        {this.props.children}
      </div>

    );
  }
}

class NoteEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text : '',
      color : '#EC729C'
    }
  }
  handleTextChange(e) {
    this.setState({text : e.target.value})
  }
  handleNoteAdd() {
    var newNote = {
      id: Date.now(),
      text: this.state.text,
      color: this.state.color
    }
    this.props.onNoteAdd(newNote);
    this.setState({ text: '' });
  }
  handleChangeColor(newColor) {
    this.setState( {color : newColor} )
  }
  render() {
    return (
      <div className='note-editor'>
        <textarea
          placeholder="Enter your note.."
          rows={3}
          className='textarea'
          value={this.state.text}
          onChange={this.handleTextChange.bind(this)}
        />
        <Color onChangeColor={this.handleChangeColor.bind(this)} />
        <button className='add-button' onClick={this.handleNoteAdd.bind(this)}>Enter</button>
      </div>
    );
  }
}

class NotesGrid extends Component {
   /*componentDidMount() {
    var grid = this.refs.grid;
      this.msnry = new Masonry(grid, {
      itemSelector: '.note',
      columnWidth: 200,
      gutter: 15
    });
  }
  componentDidUpdate(prevProps) {
    if(this.props.notes.length !== prevProps.notes.lengt) {
      this.msnry.reloadItems();
      this.msnry.layout();
    }
  }*/
  render() {
    var onNoteDelete = this.props.onDeleteNote
    return (
      <div className='notes-grid' ref="grid">
        {this.props.notes.map(note =>
          <Note
            key={note.id}
            color={note.color}
            onDelete={onNoteDelete.bind(null, note)}
          >
            {note.text}
            </Note>)
        }
      </div>
    );
  }
}

class Search extends Component {
  render() {
    return (
      <div className='search'>
        <input
          className='input-search'
          type='text'
          placeholder='Search...'
          onChange={this.props.onSearch}
        />
      </div>
    );
  }
}

var notes = [];
class NotesApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes : notes
    }
  }
  // аргумент - новая заметка
  handleNoteAdd(newNote) {
    var newNotes = this.state.notes.slice(); // создается копия массива notes
    newNotes.unshift(newNote); // в копию добавляется newNote
    this.setState( {notes : newNotes} ); // меняется состояние
    notes = newNotes; // изменяется глобальный массив
  }
  // смотрит localStorage при запуске, если там что-то записано, то это попадает в массив заметок notes
  componentDidMount() {
    var localNotes = JSON.parse(localStorage.getItem('notes'));
    if(localNotes) {
      this.setState({notes : localNotes});
    }
  }
  handleNoteDelete(note) {
    var noteId = note.id;
    var newNotes = this.state.notes.filter(note => {
      return note.id !== noteId;
    });
    this.setState({ notes : newNotes});
    notes = newNotes; // изменяется глобальный массив
  }
  componentDidUpdate() {
    this._updateLocalStorage.bind(this);
  }
  handleSearch(e) {
    const userText = e.target.value.toLowerCase();
    /*const copyNotes = this.state.notes.slice(); // создает копию массива*/
    const newNotes = notes.filter(note => {
      const searchString = note.text.toLowerCase();
      return searchString.indexOf(userText) !== -1;
    });
    this.setState( {notes : newNotes} );
  }
  render() {
    return (
      <div className='notes-app'>
        <h2 className='app-header'>NotesApp</h2>
        <NoteEditor onNoteAdd={this.handleNoteAdd.bind(this)} />
        <Search onSearch={this.handleSearch.bind(this)} />
        <NotesGrid notes={this.state.notes} onDeleteNote={this.handleNoteDelete.bind(this)} />
      </div>
    );
  }
  _updateLocalStorage() {
    var notes = JSON.stringify(this.state.notes);
    localStorage.setItem('notes', notes);
  }
}

export default NotesApp;

import TodoList from './components/TodoList.js'
// import { model } from './model/model.js'

function App() {
  this.data = []
  this.todoList = null
  this.$todoList = document.querySelector('#todo-list')

  this.init = () => {
    // this.data = model
    this.todoList = new TodoList(this.$todoList, this.data)
  }

  this.setState = () => { }

  this.init()
}

export default App

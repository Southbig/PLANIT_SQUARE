function TodoList($container, data) {
  this.$container = $container
  this.data = data
  this.editingId = null

  // localStorage에서 데이터 가져오기
  this.loadData = () => {
    try {
      const stored = localStorage.getItem('todo-list-data')
      if (stored) {
        this.data = JSON.parse(stored)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    }
  }

  // localStorage에 데이터 저장
  this.saveData = () => {
    try {
      localStorage.setItem('todo-list-data', JSON.stringify(this.data))
    } catch (error) {
      console.error('데이터 저장 실패:', error)
    }
  }

  // 할 일 추가
  this.addTodo = (name) => {
    if (name.trim()) {
      const newTodo = {
        id: Date.now(),
        name: name.trim(),
        isCompleted: false
      }
      this.data.push(newTodo)
      this.saveData()
      this.render()
    }
  }

  // 할 일 삭제
  this.deleteTodo = (id) => {
    this.data = this.data.filter(todo => todo.id !== id)
    this.saveData()
    this.render()
  }

  // 완료 상태 토글
  this.toggleComplete = (id) => {
    this.data = this.data.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    )
    this.saveData()
    this.render()
  }

  // 할 일 수정
  this.updateTodo = (id, newName) => {
    this.data = this.data.map(todo =>
      todo.id === id ? { ...todo, name: newName.trim() } : todo
    )
    this.editingId = null
    this.saveData()
    this.render()
  }

  // 전체 완료/해제
  this.toggleAllComplete = () => {
    const allCompleted = this.data.every(todo => todo.isCompleted)
    this.data = this.data.map(todo => ({ ...todo, isCompleted: !allCompleted }))
    this.saveData()
    this.render()
  }

  // 전체 삭제
  this.deleteAll = () => {
    if (confirm('모든 할 일을 삭제하시겠습니까?')) {
      this.data = []
      this.saveData()
      this.render()
    }
  }

  this.render = function () {
    const completedCount = this.data.filter(todo => todo.isCompleted).length
    const totalCount = this.data.length

    this.$container.innerHTML = `
      <div class="todo-app">
        <h1>Todo List</h1>

        <div class="input-section">
          <input 
            type="text" 
            id="todo-input" 
            placeholder="할 일을 입력하세요"
            value="${this.editingId ? this.data.find(t => t.id === this.editingId)?.name || '' : ''}"
          >
          <button id="add-btn">${this.editingId ? '수정' : '추가'}</button>
          ${this.editingId ? '<button id="cancel-btn">취소</button>' : ''}
        </div>

        <div class="stats">
          완료: ${completedCount} / 전체: ${totalCount}
          ${totalCount > 0 ? `(${Math.round(completedCount / totalCount * 100)}%)` : ''}
        </div>

        <div class="controls">
          <button id="toggle-all-btn">전체 완료/해제</button>
          <button id="delete-all-btn">전체 삭제</button>
        </div>

        <div class="todo-list">
          ${this.data.length === 0 ?
        '<div class="empty">등록된 할 일이 없습니다.</div>' :
        `<ul>
              ${this.data.map(todo => `
                <li class="todo-item ${todo.isCompleted ? 'completed' : ''}">
                  <input 
                    type="checkbox" 
                    ${todo.isCompleted ? 'checked' : ''}
                    onchange="todoApp.toggleComplete(${todo.id})"
                  >
                  <span 
                    class="todo-name ${todo.isCompleted ? 'completed-text' : ''}"
                    onclick="todoApp.selectTodo(${todo.id})"
                  >
                    ${todo.name}
                  </span>
                  <button onclick="todoApp.deleteTodo(${todo.id})">삭제</button>
                </li>
              `).join('')}
            </ul>`
      }
        </div>
      </div>
      `

    this.bindEvents()
  }

  this.bindEvents = () => {
    const input = this.$container.querySelector('#todo-input')
    const addBtn = this.$container.querySelector('#add-btn')
    const cancelBtn = this.$container.querySelector('#cancel-btn')
    const toggleAllBtn = this.$container.querySelector('#toggle-all-btn')
    const deleteAllBtn = this.$container.querySelector('#delete-all-btn')

    // 추가/수정 버튼
    addBtn.addEventListener('click', () => {
      const value = input.value.trim()
      if (value) {
        if (this.editingId) {
          this.updateTodo(this.editingId, value)
        } else {
          this.addTodo(value)
          input.value = ''
        }
      } else {
        alert('할 일을 입력하세요.')
      }
    })

    // 엔터키로 추가/수정
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addBtn.click()
      }
    })

    // ESC 키로 편집 취소
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.editingId) {
        this.editingId = null
        this.render()
      }
    })

    // 취소 버튼
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.editingId = null
        this.render()
      })
    }

    // 전체 완료/해제
    toggleAllBtn.addEventListener('click', () => {
      this.toggleAllComplete()
    })

    // 전체 삭제
    deleteAllBtn.addEventListener('click', () => {
      this.deleteAll()
    })

    // 편집 모드일 때 입력 필드 포커스
    if (this.editingId) {
      input.focus()
      input.select()
    }
  }

  // 할 일 선택 완료/수정
  this.selectTodo = (id) => {
    const todo = this.data.find(t => t.id === id)
    if (todo.isCompleted) {
      // 완료된 항목은 토글
      this.toggleComplete(id)
    } else {
      // 미완료 항목은 수정 모드
      this.editingId = id
      this.render()
    }
  }

  this.init = () => {
    this.loadData()
    this.render()

    window.todoApp = this
  }

  this.init()
}

export default TodoList

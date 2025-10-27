// Simple To-Do app using localStorage
const STORAGE_KEY = 'todo_app_tasks_v1'
let tasks = []
let filter = 'all'

const $ = selector => document.querySelector(selector)
const $all = selector => document.querySelectorAll(selector)

const taskListEl = $('#task-list')
const taskForm = $('#task-form')
const taskInput = $('#task-input')
const countEl = $('#count')
const clearCompletedBtn = $('#clear-completed')
const filterBtns = $all('.filters button')

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    tasks = raw ? JSON.parse(raw) : []
  } catch (e) {
    tasks = []
    console.error('Failed to load tasks', e)
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function addTask(title) {
  const t = { id: uid(), title: title.trim(), completed: false, createdAt: Date.now() }
  tasks.unshift(t)
  save()
  render()
}

function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  save()
  render()
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t)
  save()
  render()
}

function updateTaskTitle(id, title) {
  tasks = tasks.map(t => t.id === id ? {...t, title} : t)
  save()
  render()
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed)
  save()
  render()
}

function filteredTasks() {
  if (filter === 'active') return tasks.filter(t => !t.completed)
  if (filter === 'completed') return tasks.filter(t => t.completed)
  return tasks
}

function setFilter(f) {
  filter = f
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === f))
  render()
}

function render() {
  taskListEl.innerHTML = ''
  const items = filteredTasks()
  for (const t of items) {
    const li = document.createElement('li')
    li.className = 'task-item' + (t.completed ? ' completed' : '')

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = !!t.completed
    checkbox.addEventListener('change', () => toggleTask(t.id))

    const title = document.createElement('div')
    title.className = 'title'
    title.textContent = t.title

    // Edit on double click
    title.addEventListener('dblclick', () => {
      const input = document.createElement('input')
      input.className = 'edit-input'
      input.value = t.title
      li.replaceChild(input, title)
      input.focus()
      input.select()
      input.addEventListener('blur', () => {
        const v = input.value.trim()
        if (v) updateTaskTitle(t.id, v)
        else removeTask(t.id)
      })
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') input.blur()
        if (e.key === 'Escape') render()
      })
    })

    const delBtn = document.createElement('button')
    delBtn.className = 'btn-icon'
    delBtn.innerHTML = '🗑️'
    delBtn.title = 'Xoá'
    delBtn.addEventListener('click', () => removeTask(t.id))

    li.appendChild(checkbox)
    li.appendChild(title)
    li.appendChild(delBtn)
    taskListEl.appendChild(li)
  }

  const remaining = tasks.filter(t => !t.completed).length
  countEl.textContent = remaining + (remaining === 1 ? ' nhiệm vụ' : ' nhiệm vụ')
}

// Event wiring
taskForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const v = taskInput.value
  if (!v.trim()) return
  addTask(v)
  taskInput.value = ''
})

clearCompletedBtn.addEventListener('click', () => {
  clearCompleted()
})

filterBtns.forEach(b => b.addEventListener('click', () => setFilter(b.dataset.filter)))

// Init
load()
setFilter('all')
render()

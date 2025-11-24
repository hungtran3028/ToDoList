import React, { useEffect, useState, useRef } from 'react'

const STORAGE_KEY = 'todo_app_tasks_v1'

const TODAY_LABEL = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit'
}).format(new Date())

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

export default function App(){
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const inputRef = useRef()

  useEffect(() => {
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      setTasks(raw ? JSON.parse(raw) : [])
    } catch(e){
      console.error('Failed to load tasks', e)
      setTasks([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  function addTask(title){
    const t = { id: uid(), title: title.trim(), completed: false, createdAt: Date.now() }
    setTasks(prev => [t, ...prev])
  }

  function removeTask(id){
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function toggleTask(id){
    setTasks(prev => prev.map(t => t.id===id?{...t, completed: !t.completed}:t))
  }

  function updateTaskTitle(id, title){
    setTasks(prev => prev.map(t => t.id===id?{...t, title}:t))
  }

  function clearCompleted(){
    setTasks(prev => prev.filter(t => !t.completed))
  }

  const filtered = tasks.filter(t => {
    if(filter === 'active') return !t.completed
    if(filter === 'completed') return t.completed
    return true
  })
  const remaining = tasks.filter(t => !t.completed).length

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-kicker">Danh sách hôm nay</span>
          <h1>To‑Do List</h1>
        </div>
        <div className="app-meta">
          <span className="app-date">{TODAY_LABEL}</span>
          <span className="app-chip">
            {remaining === 0 ? 'Không còn việc nào' : `${remaining} việc đang chờ`}
          </span>
        </div>
      </header>

      <section className="app-panel">
        <form
          className="task-form"
          onSubmit={(e)=>{
            e.preventDefault()
            const v = inputRef.current.value
            if(!v.trim()) return
            addTask(v)
            inputRef.current.value = ''
          }}
        >
          <div className="task-input-wrapper">
            <span className="task-input-indicator" aria-hidden="true" />
            <input ref={inputRef} placeholder="Thêm nhiệm vụ mới..." />
          </div>
          <button type="submit" className="btn-primary">Thêm</button>
        </form>

        <div className="controls">
          <div className="filters" role="tablist" aria-label="Bộ lọc nhiệm vụ">
            <button
              type="button"
              className={filter==='all'? 'active':''}
              onClick={()=>setFilter('all')}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={filter==='active'? 'active':''}
              onClick={()=>setFilter('active')}
            >
              Chưa xong
            </button>
            <button
              type="button"
              className={filter==='completed'? 'active':''}
              onClick={()=>setFilter('completed')}
            >
              Đã xong
            </button>
          </div>
          <div className="actions">
            <span id="count">{remaining} nhiệm vụ</span>
            <button type="button" className="btn-ghost" onClick={clearCompleted}>Xoá đã xong</button>
          </div>
        </div>

        <ul className="task-list" aria-live="polite">
          {filtered.length === 0 ? (
            <li className="empty-state">
              <div className="empty-icon">✨</div>
              <p className="empty-title">Mọi thứ đều đã gọn gàng</p>
              <p className="empty-desc">Thêm vài việc nhỏ để bắt đầu ngày mới.</p>
            </li>
          ) : (
            filtered.map(t => (
              <li key={t.id} className={`task-item ${t.completed? 'completed':''}`}>
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={()=>toggleTask(t.id)}
                />
                <div
                  className="title"
                  onDoubleClick={()=>{
                    const newTitle = prompt('Chỉnh sửa nhiệm vụ', t.title)
                    if(newTitle === null) return
                    const v = newTitle.trim()
                    if(!v) removeTask(t.id)
                    else updateTaskTitle(t.id, v)
                  }}
                >
                  {t.title}
                </div>
                <button
                  type="button"
                  className="btn-icon"
                  title="Xoá"
                  onClick={()=>removeTask(t.id)}
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      <footer className="credits">Ứng dụng To‑Do React — Lưu trữ cục bộ (localStorage)</footer>
    </main>
  )
}

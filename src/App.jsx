import React, { useEffect, useState, useRef } from 'react'

const STORAGE_KEY = 'todo_app_tasks_v1'

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

  const filtered = tasks.filter(t => filter==='all' ? true : (filter==='active' ? !t.completed : t.completed))
  const remaining = tasks.filter(t => !t.completed).length

  return (
    <main className="app">
      <h1>To‑Do List</h1>

      <form className="task-form" onSubmit={(e)=>{
        e.preventDefault()
        const v = inputRef.current.value
        if(!v.trim()) return
        addTask(v)
        inputRef.current.value = ''
      }}>
        <input ref={inputRef} placeholder="Thêm nhiệm vụ mới..." />
        <button type="submit">Thêm</button>
      </form>

      <div className="controls">
        <div className="filters">
          <button className={filter==='all'? 'active':''} onClick={()=>setFilter('all')}>Tất cả</button>
          <button className={filter==='active'? 'active':''} onClick={()=>setFilter('active')}>Chưa xong</button>
          <button className={filter==='completed'? 'active':''} onClick={()=>setFilter('completed')}>Đã xong</button>
        </div>
        <div className="actions">
          <span id="count">{remaining} nhiệm vụ</span>
          <button onClick={clearCompleted}>Xoá đã xong</button>
        </div>
      </div>

      <ul className="task-list" aria-live="polite">
        {filtered.map(t => (
          <li key={t.id} className={`task-item ${t.completed? 'completed':''}`}>
            <input type="checkbox" checked={t.completed} onChange={()=>toggleTask(t.id)} />
            <div className="title" onDoubleClick={(e)=>{
              const newTitle = prompt('Chỉnh sửa nhiệm vụ', t.title)
              if(newTitle === null) return
              const v = newTitle.trim()
              if(!v) removeTask(t.id)
              else updateTaskTitle(t.id, v)
            }}>{t.title}</div>
            <button className="btn-icon" title="Xoá" onClick={()=>removeTask(t.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      <footer className="credits">Ứng dụng To‑Do React — Lưu trữ cục bộ (localStorage)</footer>
    </main>
  )
}

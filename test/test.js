const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

const projectRoot = path.resolve(__dirname, '..')
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8')

function wait(ms){ return new Promise(r=>setTimeout(r, ms)) }

async function run(){
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable', url: 'file://' + projectRoot + '/' })
  const { window } = dom
  const { document, localStorage } = window

  // Evaluate app.js in the JSDOM window context
  const appJs = fs.readFileSync(path.join(projectRoot, 'src', 'app.js'), 'utf8')
  window.eval(appJs)

  // small helper
  function log(ok, msg){
    console.log((ok? 'PASS':'FAIL') + ' - ' + msg)
    if(!ok) process.exitCode = 2
  }

  // ensure initial state
  localStorage.removeItem('todo_app_tasks_v1')

  // 1) add a task via form submit
  const input = document.querySelector('#task-input')
  const form = document.querySelector('#task-form')
  input.value = 'Kiểm thử nhiệm vụ'
  const submitEvent = new window.Event('submit', { bubbles: true, cancelable: true })
  form.dispatchEvent(submitEvent)

  await wait(30)

  let items = document.querySelectorAll('.task-item')
  log(items.length === 1, 'Thêm nhiệm vụ — số item = 1')

  const stored = JSON.parse(localStorage.getItem('todo_app_tasks_v1') || '[]')
  log(stored.length === 1 && stored[0].title === 'Kiểm thử nhiệm vụ', 'Dữ liệu đã lưu vào localStorage')

  // 2) toggle complete
  const checkbox = document.querySelector('.task-item input[type="checkbox"]')
  checkbox.checked = true
  const changeEvent = new window.Event('change', { bubbles: true })
  checkbox.dispatchEvent(changeEvent)
  await wait(30)
  const storedAfter = JSON.parse(localStorage.getItem('todo_app_tasks_v1') || '[]')
  log(storedAfter.length === 1 && storedAfter[0].completed === true, 'Đánh dấu hoàn thành cập nhật localStorage')

  // 3) delete task
  const delBtn = document.querySelector('.task-item .btn-icon')
  delBtn.click()
  await wait(30)
  items = document.querySelectorAll('.task-item')
  log(items.length === 0, 'Xoá nhiệm vụ — danh sách rỗng')

  const storedFinal = JSON.parse(localStorage.getItem('todo_app_tasks_v1') || '[]')
  log(Array.isArray(storedFinal) && storedFinal.length === 0, 'localStorage rỗng sau xoá')

  if(process.exitCode && process.exitCode !== 0){
    console.error('Có lỗi trong kiểm thử.')
    process.exit(process.exitCode)
  } else {
    console.log('Tất cả kiểm thử tự động đã thành công.')
  }
}

run().catch(err => {
  console.error('Test failed with error:', err)
  process.exit(3)
})

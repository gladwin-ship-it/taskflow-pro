import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const PRIORITIES = { high: { label: 'High', color: '#ff4757' }, medium: { label: 'Medium', color: '#ffa502' }, low: { label: 'Low', color: '#2ed573' } };
const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Learning', 'Other'];
const VIEWS = ['board', 'list', 'calendar'];

function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

const DEMO_TASKS = [
  { id: genId(), title: 'Design new dashboard UI', desc: 'Create wireframes and high-fidelity mockups for the analytics dashboard', priority: 'high', category: 'Work', status: 'in-progress', dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], tags: ['design', 'ui'], subtasks: [{ id: genId(), text: 'Wireframes', done: true }, { id: genId(), text: 'Mockups', done: false }], createdAt: Date.now() - 86400000, pinned: true },
  { id: genId(), title: 'Review Q2 financial report', desc: 'Analyze revenue, expenses, and projections for Q2', priority: 'high', category: 'Finance', status: 'todo', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], tags: ['finance', 'review'], subtasks: [], createdAt: Date.now() - 3600000 * 5, pinned: false },
  { id: genId(), title: 'Team standup meeting', desc: 'Daily standup with engineering team', priority: 'medium', category: 'Work', status: 'done', dueDate: new Date().toISOString().split('T')[0], tags: ['meeting'], subtasks: [], createdAt: Date.now() - 86400000 * 3, pinned: false },
  { id: genId(), title: 'Morning workout routine', desc: '45 min cardio + strength training', priority: 'medium', category: 'Health', status: 'todo', dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], tags: ['fitness'], subtasks: [{ id: genId(), text: 'Cardio 20min', done: false }, { id: genId(), text: 'Weights', done: false }], createdAt: Date.now() - 3600000 * 2, pinned: false },
  { id: genId(), title: 'Read "Atomic Habits"', desc: 'Complete chapters 8-12 and take notes', priority: 'low', category: 'Learning', status: 'in-progress', dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], tags: ['reading', 'self-improvement'], subtasks: [], createdAt: Date.now() - 86400000 * 2, pinned: false },
  { id: genId(), title: 'Grocery shopping', desc: 'Weekly groceries - check the list', priority: 'low', category: 'Shopping', status: 'todo', dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], tags: ['errands'], subtasks: [{ id: genId(), text: 'Vegetables', done: false }, { id: genId(), text: 'Dairy', done: false }, { id: genId(), text: 'Proteins', done: false }], createdAt: Date.now() - 3600000, pinned: false },
];

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || { title: '', desc: '', priority: 'medium', category: 'Work', status: 'todo', dueDate: '', tags: [], subtasks: [], pinned: false });
  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => { if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { set('tags', [...form.tags, tagInput.trim()]); setTagInput(''); } };
  const addSubtask = () => { if (subtaskInput.trim()) { set('subtasks', [...form.subtasks, { id: genId(), text: subtaskInput.trim(), done: false }]); setSubtaskInput(''); } };
  const toggleSubtask = (id) => set('subtasks', form.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s));
  const removeSubtask = (id) => set('subtasks', form.subtasks.filter(s => s.id !== id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Title *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Task title..." />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-input form-textarea" value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Add details..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select className="form-input" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-input" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-row">
              <input className="form-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." />
              <button className="add-btn" onClick={addTag}>+</button>
            </div>
            <div className="tags-list">
              {form.tags.map(t => <span key={t} className="tag">{t}<button onClick={() => set('tags', form.tags.filter(x => x !== t))}>×</button></span>)}
            </div>
          </div>
          <div className="form-group">
            <label>Subtasks ({form.subtasks.filter(s => s.done).length}/{form.subtasks.length})</label>
            <div className="tag-input-row">
              <input className="form-input" value={subtaskInput} onChange={e => setSubtaskInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSubtask())} placeholder="Add subtask..." />
              <button className="add-btn" onClick={addSubtask}>+</button>
            </div>
            <div className="subtasks-list">
              {form.subtasks.map(s => (
                <div key={s.id} className="subtask-item">
                  <input type="checkbox" checked={s.done} onChange={() => toggleSubtask(s.id)} />
                  <span className={s.done ? 'subtask-done' : ''}>{s.text}</span>
                  <button className="subtask-remove" onClick={() => removeSubtask(s.id)}>×</button>
                </div>
              ))}
            </div>
          </div>
          <label className="pin-toggle">
            <input type="checkbox" checked={form.pinned} onChange={e => set('pinned', e.target.checked)} />
            <span>📌 Pin this task</span>
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => form.title.trim() && onSave(form)}>
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onToggle, onPin, view }) {
  const [showMenu, setShowMenu] = useState(false);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const progress = task.subtasks.length ? Math.round((task.subtasks.filter(s => s.done).length / task.subtasks.length) * 100) : null;

  return (
    <div className={`task-card ${task.status === 'done' ? 'task-done' : ''} ${isOverdue ? 'task-overdue' : ''} ${task.pinned ? 'task-pinned' : ''} view-${view}`} >
      {task.pinned && <span className="pin-badge">📌</span>}
      <div className="card-header">
        <div className="card-left">
          <button className="check-btn" onClick={() => onToggle(task.id)}>
            <span className={`check-circle ${task.status === 'done' ? 'checked' : ''}`}>{task.status === 'done' ? '✓' : ''}</span>
          </button>
          <div>
            <div className={`task-title ${task.status === 'done' ? 'strikethrough' : ''}`}>{task.title}</div>
            <div className="task-meta">
              <span className="category-badge">{task.category}</span>
              <span className="priority-dot" style={{ background: PRIORITIES[task.priority].color }} />
              <span className="priority-label" style={{ color: PRIORITIES[task.priority].color }}>{PRIORITIES[task.priority].label}</span>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <div className="menu-wrap" onBlur={() => setTimeout(() => setShowMenu(false), 150)}>
            <button className="menu-btn" onClick={() => setShowMenu(m => !m)}>⋯</button>
            {showMenu && (
              <div className="dropdown">
                <button onClick={() => { onEdit(task); setShowMenu(false); }}>✏️ Edit</button>
                <button onClick={() => { onPin(task.id); setShowMenu(false); }}>📌 {task.pinned ? 'Unpin' : 'Pin'}</button>
                <button className="danger" onClick={() => { onDelete(task.id); setShowMenu(false); }}>🗑 Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {task.desc && <p className="task-desc">{task.desc}</p>}
      {task.tags.length > 0 && (
        <div className="card-tags">
          {task.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
        </div>
      )}
      {progress !== null && (
        <div className="subtask-progress">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <span>{progress}%</span>
        </div>
      )}
      {task.dueDate && (
        <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
          📅 {isOverdue ? 'Overdue: ' : ''}{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}

function StatsBar({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProg = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat"><span className="stat-num">{total}</span><span className="stat-label">Total</span></div>
      <div className="stat"><span className="stat-num" style={{ color: '#2ed573' }}>{done}</span><span className="stat-label">Done</span></div>
      <div className="stat"><span className="stat-num" style={{ color: '#ffa502' }}>{inProg}</span><span className="stat-label">In Progress</span></div>
      <div className="stat"><span className="stat-num" style={{ color: '#ff4757' }}>{overdue}</span><span className="stat-label">Overdue</span></div>
      <div className="stat-progress">
        <div className="stat-progress-label"><span>Completion</span><span>{pct}%</span></div>
        <div className="stat-progress-bar"><div className="stat-progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { const s = localStorage.getItem('taskflow_tasks'); return s ? JSON.parse(s) : DEMO_TASKS; }
    catch { return DEMO_TASKS; }
  });
  const [modal, setModal] = useState(null); // null | 'new' | task object
  const [view, setView] = useState('board');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => { localStorage.setItem('taskflow_tasks', JSON.stringify(tasks)); }, [tasks]);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const saveTask = (form) => {
    if (modal && modal.id) {
      setTasks(ts => ts.map(t => t.id === modal.id ? { ...t, ...form } : t));
      notify('Task updated!');
    } else {
      setTasks(ts => [...ts, { ...form, id: genId(), createdAt: Date.now() }]);
      notify('Task created! 🎉');
    }
    setModal(null);
  };

  const deleteTask = (id) => { setTasks(ts => ts.filter(t => t.id !== id)); notify('Task deleted', 'info'); };
  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
  const pinTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));

  const filtered = tasks
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .filter(t => filterCategory === 'all' || t.category === filterCategory)
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sortBy === 'dueDate') return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
      if (sortBy === 'priority') { const o = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority]; }
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return b.createdAt - a.createdAt;
    });

  const cols = {
    todo: filtered.filter(t => t.status === 'todo'),
    'in-progress': filtered.filter(t => t.status === 'in-progress'),
    done: filtered.filter(t => t.status === 'done'),
  };

  const colLabels = { todo: '📋 To Do', 'in-progress': '⚡ In Progress', done: '✅ Done' };

  return (
    <div className="app">
      {/* Notification */}
      {notification && <div className={`notification ${notification.type}`}>{notification.msg}</div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">TaskFlow</span>
          <span className="logo-pro">PRO</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-label">Views</div>
            {VIEWS.map(v => (
              <button key={v} className={`nav-item ${view === v ? 'active' : ''}`} onClick={() => { setView(v); setSidebarOpen(false); }}>
                {v === 'board' ? '🗂' : v === 'list' ? '📋' : '📅'} {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-label">Filter by Category</div>
            <button className={`nav-item ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>🌐 All Categories</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`nav-item ${filterCategory === c ? 'active' : ''}`} onClick={() => { setFilterCategory(c); setSidebarOpen(false); }}>
                {c === 'Work' ? '💼' : c === 'Personal' ? '👤' : c === 'Shopping' ? '🛒' : c === 'Health' ? '💪' : c === 'Finance' ? '💰' : c === 'Learning' ? '📚' : '📌'} {c}
                <span className="nav-count">{tasks.filter(t => t.category === c).length}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">G</div>
            <div>
              <div className="user-name">Gladwin</div>
              <div className="user-email">gladwin@mitsumi</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(s => !s)}>☰</button>
            <h1 className="page-title">My Tasks</h1>
          </div>
          <div className="topbar-center">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button className="clear-search" onClick={() => setSearch('')}>×</button>}
            </div>
          </div>
          <div className="topbar-right">
            <button className="btn btn-primary" onClick={() => setModal('new')}>+ New Task</button>
          </div>
        </header>

        {/* Stats */}
        <StatsBar tasks={tasks} />

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select className="filter-select" value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="createdAt">Sort: Recent</option>
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
          <div className="results-count">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</div>
        </div>

        {/* Board View */}
        {view === 'board' && (
          <div className="board">
            {Object.entries(cols).map(([status, colTasks]) => (
              <div key={status} className={`column col-${status}`}>
                <div className="column-header">
                  <span>{colLabels[status]}</span>
                  <span className="col-count">{colTasks.length}</span>
                </div>
                <div className="column-body">
                  {colTasks.length === 0 ? (
                    <div className="empty-col">No tasks here</div>
                  ) : (
                    colTasks.map(t => <TaskCard key={t.id} task={t} view="board" onEdit={setModal} onDelete={deleteTask} onToggle={toggleTask} onPin={pinTask} />)
                  )}
                  {status === 'todo' && (
                    <button className="add-task-btn" onClick={() => setModal('new')}>+ Add Task</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="list-view">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <h3>No tasks found</h3>
                <p>Try adjusting filters or create a new task</p>
                <button className="btn btn-primary" onClick={() => setModal('new')}>Create Task</button>
              </div>
            ) : (
              filtered.map(t => <TaskCard key={t.id} task={t} view="list" onEdit={setModal} onDelete={deleteTask} onToggle={toggleTask} onPin={pinTask} />)
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && <CalendarView tasks={filtered} onEdit={setModal} onToggle={toggleTask} />}
      </main>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Modal */}
      {modal && <TaskModal task={modal !== 'new' ? modal : null} onSave={saveTask} onClose={() => setModal(null)} />}
    </div>
  );
}

function CalendarView({ tasks, onEdit, onToggle }) {
  const [current, setCurrent] = useState(new Date());
  const year = current.getFullYear(), month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const tasksByDate = {};
  tasks.forEach(t => { if (t.dueDate) { (tasksByDate[t.dueDate] = tasksByDate[t.dueDate] || []).push(t); } });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const fmtDate = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <div className="calendar-view">
      <div className="cal-header">
        <button className="cal-nav" onClick={() => setCurrent(new Date(year, month - 1))}>‹</button>
        <h2>{monthNames[month]} {year}</h2>
        <button className="cal-nav" onClick={() => setCurrent(new Date(year, month + 1))}>›</button>
      </div>
      <div className="cal-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="cal-dow">{d}</div>)}
        {cells.map((d, i) => {
          const dateStr = d ? fmtDate(d) : null;
          const dayTasks = dateStr ? (tasksByDate[dateStr] || []) : [];
          const isToday = d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
          return (
            <div key={i} className={`cal-cell ${!d ? 'empty' : ''} ${isToday ? 'today' : ''}`}>
              {d && <span className="cal-day">{d}</span>}
              {dayTasks.slice(0, 3).map(t => (
                <div key={t.id} className={`cal-task ${t.status === 'done' ? 'done' : ''}`} style={{ borderLeft: `3px solid ${PRIORITIES[t.priority].color}` }} onClick={() => onEdit(t)}>
                  {t.title}
                </div>
              ))}
              {dayTasks.length > 3 && <div className="cal-more">+{dayTasks.length - 3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

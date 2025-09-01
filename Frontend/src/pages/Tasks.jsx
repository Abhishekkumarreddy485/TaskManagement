import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '../api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      setErr(e.msg || 'Failed to load tasks');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const t = await createTask({ title });
      setTasks(prev => [t, ...prev]);
      setTitle('');
    } catch (e) {
      setErr(e.msg || 'Create failed');
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete task?')) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  const onToggle = async (id) => {
    const updated = await toggleTask(id);
    setTasks(prev => prev.map(t => t._id === id ? updated : t));
  };

  const startEdit = (t) => {
    setEditing(t._id);
    setEditTitle(t.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    const updated = await updateTask(id, { title: editTitle });
    setTasks(prev => prev.map(t => t._id === id ? updated : t));
    setEditing(null);
  };

  return (
    <div className="tasks">
      <h2>Your Tasks</h2>
      <form onSubmit={onCreate} className="create-form">
        <input placeholder="New task title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <button type="submit" className="primary-btn">Add</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <ul className="task-list">
          {tasks.length === 0 && <p>No tasks yet.</p>}
          {tasks.map(t => (
            <li key={t._id} className={t.completed ? 'task completed' : 'task'}>
              <div className="left">
                <input type="checkbox" checked={t.completed} onChange={()=>onToggle(t._id)} />
                {editing === t._id ? (
                  <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                ) : (
                  <div>
                    <div className="title">{t.title}</div>
                    <div className="meta">Created: {new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                )}
              </div>

              <div className="actions">
                {editing === t._id ? (
                  <>
                    <button className="action-btn save" onClick={()=>saveEdit(t._id)}>Save</button>
                    <button className="action-btn cancel" onClick={()=>setEditing(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="action-btn edit" onClick={()=>startEdit(t)}>Edit</button>
                    <button className="action-btn delete" onClick={()=>onDelete(t._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {err && <p className="error">{err}</p>}
    </div>
  );
}

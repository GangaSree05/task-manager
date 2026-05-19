import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Plus, LogOut, CheckSquare, Clock, Loader2, CheckCircle2 } from 'lucide-react';

const COLS = [
  {
    key: 'Planned',
    label: 'Planned',
    headIcon: <Clock size={20} />,
    headClass: 'col-head col-head-planned',
  },
  {
    key: 'In Progress',
    label: 'In Progress',
    headIcon: <Loader2 size={20} />,
    headClass: 'col-head col-head-inprogress',
  },
  {
    key: 'Complete',
    label: 'Complete',
    headIcon: <CheckCircle2 size={20} />,
    headClass: 'col-head col-head-complete',
  },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle]     = useState('');
  const [adding, setAdding]   = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Please enter a task title'); return; }
    setAdding(true);
    try {
      const { data } = await api.post('/tasks', { title: title.trim() });
      setTasks((p) => [data, ...p]);
      setTitle('');
      toast.success('Task created');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setAdding(false);
    }
  };

  const handleUpdate = (updated) =>
    setTasks((p) => p.map((t) => (t._id === updated._id ? updated : t)));

  const byStatus = COLS.reduce((acc, c) => {
    acc[c.key] = tasks.filter((t) => t.status === c.key);
    return acc;
  }, {});

  const firstName = user?.name?.split(' ')[0] || '';
  const firstLetter = firstName.charAt(0).toUpperCase() || '?';

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-brand">
          <div className="dash-brand-icon"><CheckSquare size={18} strokeWidth={3} /></div>
          <span className="dash-brand-name">TaskFlow</span>
        </div>
        <div className="dash-right">
          <div className="user-chip">
            {user?.photo
              ? <img src={user.photo} alt="" className="user-chip-av" />
              : <div className="user-chip-ph">{firstLetter}</div>}
            <span className="user-chip-name">{firstName}</span>
          </div>
          <button id="logout-btn" className="btn-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {/* Solid Welcome Stripe */}
      <div className="dash-welcome">
        <h1>Welcome back, {firstName}</h1>
        <p>You have {tasks.length} tasks on your board.</p>
      </div>

      {/* Add task */}
      <form className="add-bar" onSubmit={handleAdd} id="create-task-form">
        <input
          id="task-title"
          className="add-bar-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          disabled={adding}
        />
        <button id="submit-task-btn" type="submit" className="btn-add" disabled={adding}>
          {adding ? <Loader size="sm" /> : <><Plus size={18} /> Add Task</>}
        </button>
      </form>

      {/* Board */}
      {loading ? (
        <div className="board-loading"><Loader size="lg" /><p>Loading your board...</p></div>
      ) : (
        <div className="board">
          {COLS.map((col) => {
            const items = byStatus[col.key];
            return (
              <div key={col.key} className="col">
                {/* Solid colored header */}
                <div className={col.headClass}>
                  <div className="col-head-left">
                    <span className="col-head-icon">{col.headIcon}</span>
                    <span className="col-head-label">{col.label}</span>
                  </div>
                  <span className="col-count">{items.length}</span>
                </div>
                
                <div className="col-body">
                  {items.length === 0 ? (
                    <div className="col-empty">No tasks</div>
                  ) : (
                    items.map((task) => (
                      <TaskCard key={task._id} task={task} onUpdate={handleUpdate} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

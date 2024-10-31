import React from "react";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import Layout from "@/layouts/layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [message, setMessage] = React.useState('');
    const [auth, setAuth] = React.useState(false);
    const [tasks, setTasks] = React.useState([]);
  const [taskName, setTaskName] = React.useState('');
  const [taskStatus, setTaskStatus] = React.useState('pendiente'); // Default status
  const [dueDate, setDueDate] = React.useState('');
  const [editingTaskId, setEditingTaskId] = React.useState(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Not authenticated');
        }

        const content = await response.json();
        setMessage(`Hi ${content.name}`);
        setAuth(true);
        setTasks(content.tasks || []);
      } catch (e) {
        setMessage('You are not logged in');
        setAuth(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    const method = editingTaskId ? 'PUT' : 'POST';
    const url = editingTaskId 
        ? `http://localhost:8000/api/tasks/${editingTaskId}` 
        : 'http://localhost:8000/api/tasks';

    const data = { name: taskName, status: taskStatus, dueDate };

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error saving task');
        }

        const savedTask = await response.json();

        if (editingTaskId) {
            setTasks(tasks.map(task => (task.id === editingTaskId ? savedTask : task))); 
        } else {
            setTasks([...tasks, savedTask]); 
        }

        setTaskName('');
        setTaskStatus('pendiente');
        setDueDate('');
        setEditingTaskId(null);
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

   const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error deleting task');
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEditTask = (task) => {
    setTaskName(task.name);
    setTaskStatus(task.status);
    setDueDate(new Date(task.dueDate).toISOString().substring(0, 10));
    setEditingTaskId(task.id);
  };

  return (
    <Layout auth={auth}>
      {message}
      {auth && (
        <div className={styles.taskManagement}>
          <h2>{message}, Manage Your Tasks</h2>
          <form className={styles.taskForm} onSubmit={handleTaskSubmit}>
            <h2>{editingTaskId ? 'Edit Task' : 'Create Task'}</h2>
            <input
              type="text"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <button type="submit">{editingTaskId ? 'Update Task' : 'Create Task'}</button>
          </form>

          <h3>Your Tasks</h3>
          <ul className={styles.taskList}>
            {tasks.map(task => (
              <li key={task.id}>
                <strong>{task.name}</strong> <p>- {task.status} (Due: {new Date(task.dueDate).toLocaleDateString()}) </p>
                <div className={styles.taskActions}>
                  <button className={styles.editButton} onClick={() => handleEditTask(task)}>Edit</button>
                  <button className={styles.deleteButton} onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}

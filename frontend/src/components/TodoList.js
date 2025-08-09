// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [reminder, setReminder] = useState('');

  // 获取任务
  useEffect(() => {
    axios.get('/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    if (newTask) {
      const task = { text: newTask, priority, reminder, completed: false };
      axios.post('/api/tasks', task)
        .then(response => {
          setTasks([...tasks, response.data]);
          setNewTask('');
          setPriority('Low');
          setReminder('');
        })
        .catch(error => console.error('Error adding task:', error));
    }
  };

  const toggleTaskCompletion = (id) => {
    axios.put(`/api/tasks/${id}/toggle`)
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task._id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
      })
      .catch(error => console.error('Error toggling task completion:', error));
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>待办事项清单</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="添加新任务"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">低优先级</option>
        <option value="Medium">中优先级</option>
        <option value="High">高优先级</option>
      </select>
      <input
        type="datetime-local"
        value={reminder}
        onChange={(e) => setReminder(e.target.value)}
        placeholder="提醒时间"
      />
      <button onClick={addTask}>添加任务</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text} - {task.priority} 
            </span>
            <button onClick={() => toggleTaskCompletion(task._id)}>
              {task.completed ? '未完成' : '已完成'}
            </button>
            <button onClick={() => deleteTask(task._id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

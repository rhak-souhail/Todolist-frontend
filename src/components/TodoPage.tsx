import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus,FiClipboard } from 'react-icons/fi'; 
import { green } from '@mui/material/colors';

interface Task {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:3000/tasks');
    setTasks(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) {
      await axios.post('http://localhost:3000/tasks', { name });
    } else {
      await axios.patch(`http://localhost:3000/tasks/${editId}`, { name });
      setEditId(null);
      setOriginalName('');
    }
    setName('');
    fetchTasks();
  };

  const handleEdit = (task: Task) => {
    setEditId(task.id);
    setName(task.name);
    setOriginalName(task.name);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:3000/tasks/${id}`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}><FiClipboard /> Todo List</h1>

      {}
      <input
        type="text"
        placeholder="Rechercher une tâche..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); 
        }}
        style={{ ...styles.input, marginBottom: 10 }}
      />

      {}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />
        <button
          type="submit"
          disabled={editId !== null && name === originalName}
          style={{
            ...styles.button,
            backgroundColor: editId ? '#f39c12' : '#27ae60',
          }}
        >
          {editId ? <FiEdit2 /> : <FiPlus />}
          &nbsp;{editId ? 'Modifier' : 'Créer'}
        </button>
      </form>

      {}
      <ul style={styles.list}>
        {paginatedTasks.map((task) => (
          <li key={task.id} style={styles.listItem}>
            <span>
              <strong>{task.name}</strong>
              <span style={styles.date}> — {new Date(task.createdAt).toLocaleString()}</span>
            </span>
            <div>
              <button onClick={() => handleEdit(task)} style={styles.iconButton} title="Modifier">
                <FiEdit2 />
              </button>
              <button onClick={() => handleDelete(task.id)} style={styles.iconButton} title="Supprimer">
                <FiTrash2 />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          style={{
            ...styles.button,
            backgroundColor: page === 1 ? '#ccc' : '#3498db',
            cursor: page === 1 ? 'not-allowed' : 'pointer',
          }}
        >
          ◀
        </button>
      
        <span style={{ margin: '0 10px' }}>
          Page {page} / {totalPages}
        </span>
      
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          style={{
            ...styles.button,
            backgroundColor: page === totalPages ? '#ccc' : '#3498db',
            cursor: page === totalPages ? 'not-allowed' : 'pointer',
          }}
        >
          ▶
        </button>
      </div>
      
      )}
    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 600,
    margin: '40px auto',
    padding: 30,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 30,
  },
  form: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: 16,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginLeft: 8,
  },
  iconButton: {
    marginLeft: 6,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 18,
    color: '#2c3e50',
  },
};

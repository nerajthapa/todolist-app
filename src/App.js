import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    // Fetch todo items from the API
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const handleAddTodo = () => {
    // Generate a unique ID using uuid
    const newTodoId = uuidv4();

    // Update the state with the new todo
    setTodos(prevTodos => [
      ...prevTodos,
      {
        userId: 1,
        id: newTodoId,
        title: newTodo,
        completed: false,
        manuallyAdded: true,
      },
    ]);

    // Clear the input field
    setNewTodo('');
  };

  const handleUpdateTodo = () => {
    if (selectedTodo) {
      if (selectedTodo.manuallyAdded) {
        // If the todo was manually added, update it directly in the state
        const updatedTodos = todos.map(todo =>
          todo.id === selectedTodo.id ? { ...todo, title: newTodo } : todo
        );
        setTodos(updatedTodos);
        setNewTodo('');
        setSelectedTodo(null);
      } else {
        // Dummy request to update a todo (PUT request)
        fetch(`https://jsonplaceholder.typicode.com/todos/${selectedTodo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...selectedTodo,
            title: newTodo,
          }),
        })
          .then(response => response.json())
          .then(data => {
            // Update the state with the updated todo
            const updatedTodos = todos.map(todo =>
              todo.id === data.id ? data : todo
            );
            setTodos(updatedTodos);
            setNewTodo('');
            setSelectedTodo(null);
          })
          .catch(error => console.error('Error updating todo:', error));
      }
    }
  };

  const handleDeleteTodo = () => {
    if (selectedTodo) {
      if (selectedTodo.manuallyAdded) {
        // If the todo was manually added, remove it directly from the state
        const updatedTodos = todos.filter(todo => todo.id !== selectedTodo.id);
        setTodos(updatedTodos);
        setNewTodo('');
        setSelectedTodo(null);
      } else {
        // Dummy request to delete a todo (DELETE request)
        fetch(`https://jsonplaceholder.typicode.com/todos/${selectedTodo.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            // Update the state by removing the deleted todo
            const updatedTodos = todos.filter(
              todo => todo.id !== selectedTodo.id
            );
            setTodos(updatedTodos);
            setNewTodo('');
            setSelectedTodo(null);
          })
          .catch(error => console.error('Error deleting todo:', error));
      }
    }
  };

  const handleSelectTodo = todo => {
    // Set the selected todo for editing
    setSelectedTodo(todo);
    setNewTodo(todo.title);
    // Toggle the completed status
    const updatedTodos = todos.map(t =>
        t.id === todo.id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="App">
      <h1>Todo App</h1>
      <div>
        <input
          type="text"
          placeholder="Add or Update a todo"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button onClick={selectedTodo ? handleUpdateTodo : handleAddTodo}>
          {selectedTodo ? 'Update Todo' : 'Add Todo'}
        </button>
        {selectedTodo && (
          <button onClick={handleDeleteTodo}>Delete Todo</button>
        )}
      </div>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            className={todo.deleted ? 'deleted' : ''}
            onClick={() => handleSelectTodo(todo)}
          >
            <input
              type="checkbox"
              readOnly
              checked={todo.completed}
              onClick={() => handleSelectTodo(todo)}
            />
            <span>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

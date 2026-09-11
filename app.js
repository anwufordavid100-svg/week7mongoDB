require("dotenv").config();
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json()); // MUST HAVE to read req.body
app.use(cors("*"));

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All
app.get('/', (req, res) => {
  console.log("week3-crud-todo-api")
  res.status(200).json(todos);
});
app.get('/todos/', (req, res) => {
  if (todos.length > 1) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(todos); // Send array as JSON
});


// GET Completed only
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

// GET One
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  res.json(todo);
});

// POST New
app.post('/todos', (req, res) => {
  const { task, completed = false } = req.body;
  if (!task) return res.status(400).json({ message: 'Task is required' }); // 400 = bad request
  const newTodo = { id: todos.length + 1, task, completed };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH Update
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// DELETE
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // so you see the real error in terminal
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
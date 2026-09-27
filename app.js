require("dotenv").config();
const cors = require('cors');
const validateTodo = require("./middlewares/validator.js")
const logRequest = require("./middlewares/logger.js")
const connectDB = require("./database/db.js");
const express = require('express');
const Todomodel = require("./models/todomodel.js");
const errorhandler = require("./middlewares/errorHandle.js")
const app = express();

app.use(express.json()); // MUST HAVE to read req.body
app.use(cors("*")); // Allow all origins
connectDB(); // Connect to MongoDB
app.use(logRequest)


// let todos = [
//   { id: 1, task: 'Learn Node.js', completed: false },
//   { id: 2, task: 'Build CRUD API', completed: false },
// ];

// GET All
app.get('/todos', async (req, res) => {
  const todos = await Todomodel.find({});
  res.status(200).json(todos);
});

app.get('/todos/', async (req, res) => {
  const todos = await Todomodel.find({});
  if (todos.length > 1) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(todos); // Send array as JSON
});


// GET Completed only
app.get('/todos/completed', async (req, res, next) => {
  try {
    const completedTodos = await Todomodel.find({ completed: true });
    res.json(completedTodos);
  } catch (error) {
    next(error);
  };
});

// GET One

app.get('/todos/:id', async (req, res, next) => {
  try {

    const todo = await Todomodel.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });

    }
    res.status(200).json(todo);
  } catch (error) {


    next(error);
  }

});

// POST New
app.post('/todos', validateTodo, async (req, res, next) => {
  const { task, completed } = req.body;
  const newTodo = new Todomodel({ task, completed });
  try {
    await newTodo.save();
    // const { task, completed = false } = req.body;
    // if (!task || task.length <= 2) {
    //   return res.status(400).json({ message: 'Please provide the task' })
    // }; // 400 = bad request
    // const newTodo = { id: todos.length + 1, ...req.body };
    // todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error)
  }
});


// PATCH Update
app.patch('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todomodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    Object.assign(todo, req.body);
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

// DELETE
app.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await Todomodel.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    // const initialLength = todos.length;
    // todos = todos.filter((t) => t.id !== id);
    // if (todos.length === initialLength)
    //   return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Error handler

app.use(errorhandler)

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
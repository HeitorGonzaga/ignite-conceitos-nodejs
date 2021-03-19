const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find((user) => user.username === username);

  if(!user) return response.status(404).json({error: 'Invalid username'});
  request.user = user;
  return next();
}

/*
* Rota para adicionar usuários
*/
app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const ifExistUser = users.find((user) => user.username === username);

  if(ifExistUser) return response.status(400).json({error: 'User Already exist'});

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user);
  return response.status(201).json(user);
});

/*
* Rota para listar os Todos
*/
app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  return response.json(user.todos);

});

/*
* Rota para adicionar Todos
* Parametros: (title, deadline()
*/
app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo);

  return response.status(201).json(todo);

});


/*
* Rota para alterar um Todo
* Parametros: (id, title, deadline)
*/
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({error: 'Todo ID not found!'});

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);

});


/*
* Rota para alterar o status para concluido de um Todo
*/
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo) return response.status(404).json({error: 'Todo ID not found!'});

  todo.done = true;
  return response.status(200).json(todo);
});

/*
* Rota para deletar um Todo
*/
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);
  if(!todo) return response.status(404).json({error: 'Todo ID not found!'});
  user.todos.splice(todo, 1);

  return response.status(204).json(user.todos);

});

module.exports = app;
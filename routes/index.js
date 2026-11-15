var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    const trimmedTask = task ? task.trim() : '';
    if (!trimmedTask) {
      return res.status(400).send('Task cannot be blank.');
    }
    try {
      req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
        if (err) {
          console.error('Error adding todo:', err);
          return res.status(500).send('Error adding todo');
        }
        console.log('Todo added successfully:', results);
        // Redirect to the home page after adding
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      res.status(500).send('Error adding todo');
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

/* GET edit task page. */
router.get('/edit/:id', function (req, res, next) {
  const { id } = req.params;
  try {
    req.db.query('SELECT * FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).send('Task not found');
      }
      res.render('edit', { title: 'Edit Task', task: results[0] });
    });
  } catch (error) {
    res.status(500).send('Error editing todo');
  }
});

/* POST update task (description & completion). */
router.post('/update/:id', function (req, res, next) {
    const { id } = req.params;
    const task = req.body.task ? req.body.task.trim() : '';
    const completed = req.body.completed === 'on' ? 1 : 0;

    if (!task) {
      return res.status(400).send('Task description cannot be blank.');
    }

    try {
      req.db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?;', [task, completed, id], (err, results) => {
        if (err) {
          return res.status(500).send('Error updating todo');
        }
        res.redirect('/');
      });
    } catch (error) {
      res.status(500).send('Error updating todo');
    }
});

module.exports = router;
var db = window.localStorage;
            // let todos = [
            //     {
            //         id: 1,
            //         title: 'do homework',
            //         desc: 'yea',
            //         done: false
            //     },
            //     {
            //         id: 2,
            //         title: 'foo',
            //         desc: 'bar',
            //         done: true,
            //     }
            // ];
            // db.setItem("todos", JSON.stringify(todos));
            
            let todos = JSON.parse(db.getItem('todos')) != null ? JSON.parse(db.getItem('todos')) : []; 
            
            var todoTitle = document.querySelector('#todo-title');
            var todoDesc = document.querySelector('#todo-desc');
            var addTodoBtn = document.querySelector('#add-todo');

            var todoList = document.querySelector('#todo-list');

            console.log('JSON.parse(db)');
            console.log(JSON.parse(db.getItem('todos')));

            class Todo {
                constructor(title, desc) {
                    this.id = new Date().getTime();
                    this.title = title;
                    this.desc = desc;
                    this.done = false;
                    this.dateCreated = new Date().toString();
                }
            }

            var addTodo = () => {
                console.log('foo');
                if(todoTitle.value) {
                    let newTodo = new Todo(todoTitle.value, todoDesc.value);
                    // console.log(newTodo);
                    todos.push(newTodo);
                    db.setItem("todos", JSON.stringify(todos));
                    // loadToList(todos);   // earlier impl
                    todoList.appendChild(createTodoNode(newTodo));
                    todoTitle.value = todoDesc.value = '';
                } else {
                    alert("Todo title can't be empty :)");
                }
            }

            addTodoBtn.addEventListener('click', addTodo)

            // load todos from db to todos array
            var loadToList = (tempDb) => {
                todoList.innerHTML = '';
                for(let i=0; i<tempDb.length; i++) {
                    let li = createTodoNode(tempDb[i]);
                    todoList.appendChild(li);
                }
            }

            var createTodoNode = (todo) => {
                let li = document.createElement('li');
                let div = document.createElement('div');

                li.setAttribute('class', 'flex-item');

                let titleText = document.createTextNode(todo.title);
                let descText = document.createTextNode(todo.desc);
                let dateText = document.createTextNode(todo.dateCreated);

                let heading = document.createElement('h3');
                let p = document.createElement('p');
                let dateSpan = document.createElement('span');

                let checkBox = document.createElement('input');
                checkBox.setAttribute('type', 'checkbox');

                let deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = 'x';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.setAttribute('onclick', 'deleteTodo(' + todo.id + ')');

                checkBox.setAttribute('id', 'todo-'+todo.id);
                checkBox.checked = todo.done;
                
                checkBox.setAttribute('onchange', 'toggleDone(' + todo.id + ')');

                heading.appendChild(titleText);
                p.appendChild(descText);
                dateSpan.appendChild(dateText);

                div.appendChild(heading);
                div.appendChild(p);
                div.appendChild(document.createElement('hr'));
                
                // div.appendChild(checkBox);
                // let markDoneText = document.createTextNode('mark as done');
                // div.appendChild(markDoneText);

                div.appendChild(dateSpan);
                div.appendChild(deleteBtn);

                console.log(todo.id);
                li.appendChild(div);
                li.setAttribute('id', 'todo-'+todo.id);

                if(todo.done) {
                    li.classList.add('strike');
                }

                li.addEventListener('click', () => {
                    if(!li.classList.contains('strike')) {
                        li.classList.add('strike');
                    } else {
                        li.classList.remove('strike');
                    }
                    toggleDone(todo.id);
                });

                return li;         
            }

            var toggleDone = (id) => {
                console.log('updated ' + id);
                let tempTodos = JSON.parse(db.getItem('todos'));
                tempTodos.forEach((element, index) => {
                    if (element.id === id) {
                        tempTodos[index].done = !tempTodos[index].done;
                    }
                });
                db.setItem('todos', JSON.stringify(tempTodos));
                console.log(JSON.parse(db.getItem('todos')));
            }

            var deleteTodo = (id) => {
                if(confirm('Are you sure you want to delete?')) {
                    // remove from localStorage
                    db.setItem('todos', JSON.stringify(JSON.parse(db.getItem('todos')).filter((todo) => {
                        return todo.id !== id;
                    })));

                    // update UI
                    let li = document.querySelector('#todo-' + id);
                    li.parentNode.removeChild(li);
                    console.log('deleted item with id ' + id);
                }  
            }

            // upon page load
            let tempDb = JSON.parse(db.getItem('todos'));
            if(tempDb != null) {
                loadToList(tempDb);
            }

            var dateTodayStr = () => {
                let d = new Date();
                let month = d.toLocaleString('default', { month: 'long' });
                console.log(month);
                let str = month + ' ' + d.getDate() + ', ' + d.getFullYear();
                return str;
            }

            let topDiv = document.querySelector('#top');
            topDiv.innerHTML = dateTodayStr();

            


            // Execute a function when the user releases a key on the keyboard
            // todoTitle.addEventListener("keyup", function (e) {
            //     // Number 13 is the "Enter" key on the keyboard
            //     if (e.keyCode === 13) {
            //         // Cancel the default action, if needed
            //         e.preventDefault();
            //         // Trigger the button element with a click
            //         todoTitle.click();
            //     }
            // }); 
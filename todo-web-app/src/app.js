(function(){
    const STORAGE_KEY = 'tasks';
    const THEME_KEY = 'theme';
    let tasks = [];

    function load() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    tasks = parsed.map(t => ({ text: t.text, completed: !!t.completed }));
                }
            }
        } catch(e) { console.error('Failed to load tasks', e); }
    }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
        catch(e) { console.error('Failed to save tasks', e); }
    }

    function applyTheme(theme){
        if(theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }

    function initTheme(){
        const stored = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        applyTheme(theme);
    }

    function toggleTheme(){
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    }

    function renderTasks() {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;
        taskList.innerHTML = '';
        const ordered = tasks.map((t,i)=>({ task: t, index: i }))
                              .sort((a,b)=> Number(a.task.completed) - Number(b.task.completed));
        ordered.forEach(({task,index}) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const textSpan = document.createElement('span');
            textSpan.textContent = task.text;
            li.appendChild(textSpan);

            const completeBtn = document.createElement('button');
            completeBtn.textContent = task.completed ? 'Completed' : 'Complete';
            completeBtn.disabled = task.completed;
            completeBtn.onclick = () => { markTaskAsComplete(index); };
            li.appendChild(completeBtn);

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => { deleteTask(index); };
            li.appendChild(delBtn);

            taskList.appendChild(li);
        });
    }

    function addTask() {
        const input = document.getElementById('taskInput');
        if (input && input.value.trim()) {
            tasks.push({ text: input.value.trim(), completed: false });
            input.value = '';
            save();
            renderTasks();
            input.focus();
            console.log('Task added successfully');
        }
    }

    function markTaskAsComplete(index) {
        if (tasks[index] && !tasks[index].completed) {
            tasks[index].completed = true;
            save();
            renderTasks();
        }
    }

    function deleteTask(index) {
        if (index > -1 && index < tasks.length) {
            tasks.splice(index, 1);
            save();
            renderTasks();
        }
    }

    document.getElementById('addTaskButton')?.addEventListener('click', addTask);
    document.getElementById('taskInput')?.addEventListener('keyup', e => { if (e.key === 'Enter') addTask(); }); // updated ID
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    initTheme();
    load();
    renderTasks();
})();
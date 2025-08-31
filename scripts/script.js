//JS注释示例

/*
JS注释示例
*/
// 当DOM内容完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素引用
    const taskInput = document.getElementById('taskInput'); // 任务输入框
    const addBtn = document.getElementById('addBtn');       // 添加按钮
    const tasksContainer = document.getElementById('tasksContainer'); // 任务容器
    const emptyState = document.getElementById('emptyState'); // 空状态提示
    const totalTasksSpan = document.getElementById('totalTasks'); // 总任务数显示
    const completedTasksSpan = document.getElementById('completedTasks'); // 已完成任务数显示
    
    // 任务数组，存储所有任务对象
    let tasks = [];
    // 任务ID计数器，确保每个任务有唯一ID
    let taskId = 1;
    
    // 从本地存储加载任务
    function loadTasks() {
        // 从localStorage获取保存的任务数据
        const savedTasks = localStorage.getItem('todoTasks');
        // 如果存在保存的数据
        if (savedTasks) {
            // 解析JSON字符串为JavaScript对象
            tasks = JSON.parse(savedTasks);
            // 设置下一个任务的ID（现有最大ID+1）
            taskId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
            // 渲染任务列表
            renderTasks();
        }
    }
    
    // 保存任务到本地存储
    function saveTasks() {
        // 将任务数组转换为JSON字符串并保存到localStorage
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }
    
    // 添加任务函数
    function addTask() {
        // 获取输入框的值并去除首尾空格
        const taskText = taskInput.value.trim();
        
        // 如果输入为空，显示警告
        if (taskText === '') {
            alert('请输入任务内容');
            return; // 退出函数
        }
        
        // 创建任务对象
        const task = {
            id: taskId++,        // 分配唯一ID并递增计数器
            text: taskText,      // 任务文本
            completed: false,    // 初始未完成状态
            createdAt: new Date().toISOString() // 创建时间
        };
        
        // 将新任务添加到任务数组
        tasks.push(task);
        // 保存到本地存储
        saveTasks();
        // 重新渲染任务列表
        renderTasks();
        // 清空输入框
        taskInput.value = '';
        // 将焦点设置回输入框
        taskInput.focus();
    }
    
    // 渲染任务列表
    function renderTasks() {
        // 更新总任务数统计
        totalTasksSpan.textContent = `总任务: ${tasks.length}`;
        // 计算已完成任务数
        const completedCount = tasks.filter(task => task.completed).length;
        // 更新已完成任务数统计
        completedTasksSpan.textContent = `已完成: ${completedCount}`;
        
        // 如果没有任务，显示空状态
        if (tasks.length === 0) {
            emptyState.style.display = 'block'; // 显示空状态
            tasksContainer.innerHTML = '';      // 清空任务容器
            tasksContainer.appendChild(emptyState); // 添加空状态元素
            return; // 退出函数
        }
        
        // 隐藏空状态
        emptyState.style.display = 'none';
        // 清空任务容器
        tasksContainer.innerHTML = '';
        
        // 按创建时间排序（最新的在前）
        const sortedTasks = [...tasks].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        // 遍历所有任务并创建DOM元素
        sortedTasks.forEach(task => {
            // 创建任务项元素
            const taskElement = document.createElement('div');
            // 设置CSS类，如果任务已完成则添加completed类
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            // 设置数据属性，存储任务ID
            taskElement.dataset.id = task.id;
            
            // 设置任务项HTML内容
            taskElement.innerHTML = `
                <!-- 完成任务按钮 -->
                <button class="task-btn complete-btn" title="${task.completed ? '标记为未完成' : '标记为完成'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${task.completed ? '#2fb344' : 'none'}" stroke="${task.completed ? 'none' : '#adb5bd'}" stroke-width="2">
                        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" ${task.completed ? '' : 'fill="none"'} />
                    </svg>
                </button>
                <!-- 任务文本 -->
                <span class="task-text">${task.text}</span>
                <!-- 删除任务按钮 -->
                <button class="task-btn delete-btn" title="删除任务">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                    </svg>
                </button>
            `;
            
            // 将任务项添加到容器
            tasksContainer.appendChild(taskElement);
            
            // 获取完成任务按钮元素
            const completeBtn = taskElement.querySelector('.complete-btn');
            // 为完成任务按钮添加点击事件监听器
            completeBtn.addEventListener('click', () => toggleComplete(task.id));
            
            // 获取删除任务按钮元素
            const deleteBtn = taskElement.querySelector('.delete-btn');
            // 为删除任务按钮添加点击事件监听器
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
        });
    }
    
    // 切换任务完成状态
    function toggleComplete(id) {
        // 更新任务数组，切换指定任务的完成状态
        tasks = tasks.map(task => {
            // 如果找到匹配ID的任务
            if (task.id === id) {
                // 返回新对象，completed状态取反
                return { ...task, completed: !task.completed };
            }
            // 其他任务保持不变
            return task;
        });
        // 保存到本地存储
        saveTasks();
        // 重新渲染任务列表
        renderTasks();
    }
    
    // 删除任务
    function deleteTask(id) {
        // 显示确认对话框
        if (confirm('确定要删除这个任务吗？')) {
            // 过滤掉指定ID的任务
            tasks = tasks.filter(task => task.id !== id);
            // 保存到本地存储
            saveTasks();
            // 重新渲染任务列表
            renderTasks();
        }
    }
    
    // 为添加按钮添加点击事件监听器
    addBtn.addEventListener('click', addTask);
    
    // 为输入框添加键盘事件监听器
    taskInput.addEventListener('keypress', function(e) {
        // 如果按下的是Enter键
        if (e.key === 'Enter') {
            // 调用添加任务函数
            addTask();
        }
    });
    
    // 初始加载任务
    loadTasks();
});

/* 待添加的JS功能:
   1. 任务编辑功能
   2. 任务分类和过滤
   3. 任务优先级设置
   4. 任务截止日期提醒
   5. 数据导出/导入功能
   6. 键盘快捷键支持
*/
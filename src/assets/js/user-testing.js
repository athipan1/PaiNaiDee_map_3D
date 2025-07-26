// User Testing Scenarios System for PaiNaiDee 3D Map
// สร้างระบบ Scenarios สำหรับการทดสอบผู้ใช้

// ========================================
// USER TESTING SCENARIOS CONFIGURATION
// ========================================

let userTesting = {
    scenarios: [],
    currentScenario: null,
    scenarioIndex: 0,
    isTestingMode: false,
    startTime: null,
    completedTasks: [],
    errors: [],
    testingData: {
        sessionId: '',
        testerId: '',
        scenarios: [],
        userFeedback: [],
        completionTime: 0,
        successRate: 0
    }
};

// Define testing scenarios
const testingScenarios = {
    th: [
        {
            id: 'scenario_01',
            title: 'ค้นหาและสำรวจสถานที่ท่องเที่ยวในกรุงเทพฯ',
            description: 'ผู้ใช้ต้องการหาข้อมูลสถานที่ท่องเที่ยวในกรุงเทพฯ เพื่อวางแผนเที่ยววันหยุด',
            tasks: [
                {
                    id: 'task_1_1',
                    instruction: 'หาและคลิกที่กรุงเทพฯ บนแผนที่',
                    expectedAction: 'marker_click',
                    targetElement: '.marker.bangkok',
                    points: 20
                },
                {
                    id: 'task_1_2', 
                    instruction: 'ดูข้อมูลสถานที่ท่องเที่ยวในกรุงเทพฯ',
                    expectedAction: 'info_modal_opened',
                    targetElement: '.location-modal',
                    points: 15
                },
                {
                    id: 'task_1_3',
                    instruction: 'เพิ่มกรุงเทพฯ ในรายการโปรด',
                    expectedAction: 'favorite_added',
                    targetElement: '.favorite-btn[data-location="bangkok"]',
                    points: 10
                }
            ],
            timeLimit: 180, // 3 minutes
            difficulty: 'easy',
            category: 'exploration'
        },
        {
            id: 'scenario_02',
            title: 'วางแผนเส้นทางเดินทางท่องเที่ยว',
            description: 'ผู้ใช้ต้องการวางแผนเดินทางจากกรุงเทพฯ ไปเชียงใหม่',
            tasks: [
                {
                    id: 'task_2_1',
                    instruction: 'เปิดเครื่องมือวางแผนเส้นทาง (Route Planning)',
                    expectedAction: 'route_planner_opened',
                    targetElement: '#routePlanningSection',
                    points: 15
                },
                {
                    id: 'task_2_2',
                    instruction: 'เลือก "กรุงเทพฯ" เป็นจุดเริ่มต้น',
                    expectedAction: 'route_from_selected',
                    targetElement: '#fromLocation',
                    points: 20
                },
                {
                    id: 'task_2_3',
                    instruction: 'เลือก "เชียงใหม่" เป็นจุดหมาย',
                    expectedAction: 'route_to_selected',
                    targetElement: '#toLocation',
                    points: 20
                },
                {
                    id: 'task_2_4',
                    instruction: 'คำนวณเส้นทาง',
                    expectedAction: 'route_calculated',
                    targetElement: '.route-btn',
                    points: 10
                }
            ],
            timeLimit: 240, // 4 minutes
            difficulty: 'medium',
            category: 'planning'
        },
        {
            id: 'scenario_03',
            title: 'ใช้งานฟีเจอร์ค้นหาและช้างน้อยผู้ช่วย',
            description: 'ผู้ใช้ต้องการหาข้อมูลเกี่ยวกับ "วัดพระแก้ว" โดยใช้การค้นหา',
            tasks: [
                {
                    id: 'task_3_1',
                    instruction: 'พิมพ์ "วัดพระแก้ว" ในช่องค้นหา',
                    expectedAction: 'search_performed',
                    targetElement: '#searchInput',
                    points: 15
                },
                {
                    id: 'task_3_2',
                    instruction: 'คลิกผลการค้นหา',
                    expectedAction: 'search_result_clicked',
                    targetElement: '.search-result-item',
                    points: 20
                },
                {
                    id: 'task_3_3',
                    instruction: 'คลิกที่ช้างน้อย PaiNai เพื่อขอคำแนะนำ',
                    expectedAction: 'mascot_clicked',
                    targetElement: '#floatingMascot',
                    points: 15
                },
                {
                    id: 'task_3_4',
                    instruction: 'อ่านคำแนะนำจากช้างน้อย',
                    expectedAction: 'mascot_tip_read',
                    targetElement: '#mascotTip',
                    points: 10
                }
            ],
            timeLimit: 200, // 3.3 minutes
            difficulty: 'medium',
            category: 'assistance'
        },
        {
            id: 'scenario_04',
            title: 'สำรวจฟีเจอร์ทั้งหมดและให้ความคิดเห็น',
            description: 'สำรวจแอปพลิเคชันโดยรวมและให้ข้อเสนอแนะ',
            tasks: [
                {
                    id: 'task_4_1',
                    instruction: 'เปลี่ยนธีมจากสีสว่างเป็นสีเข้ม',
                    expectedAction: 'theme_changed',
                    targetElement: '#themeToggle',
                    points: 10
                },
                {
                    id: 'task_4_2',
                    instruction: 'เปลี่ยนภาษาจากไทยเป็นอังกฤษ',
                    expectedAction: 'language_changed',
                    targetElement: '#languageToggle',
                    points: 10
                },
                {
                    id: 'task_4_3',
                    instruction: 'สำรวจสถานที่อย่างน้อย 3 แห่ง',
                    expectedAction: 'multiple_locations_explored',
                    targetElement: '.marker',
                    points: 30,
                    requiredCount: 3
                },
                {
                    id: 'task_4_4',
                    instruction: 'ให้ความคิดเห็นผ่านปุ่ม Feedback',
                    expectedAction: 'feedback_opened',
                    targetElement: '#feedbackWidget',
                    points: 20
                }
            ],
            timeLimit: 360, // 6 minutes
            difficulty: 'easy',
            category: 'exploration'
        }
    ],
    en: [
        {
            id: 'scenario_01',
            title: 'Search and Explore Bangkok Tourist Attractions',
            description: 'User wants to find information about tourist attractions in Bangkok for holiday planning',
            tasks: [
                {
                    id: 'task_1_1',
                    instruction: 'Find and click on Bangkok on the map',
                    expectedAction: 'marker_click',
                    targetElement: '.marker.bangkok',
                    points: 20
                },
                {
                    id: 'task_1_2',
                    instruction: 'View information about Bangkok attractions',
                    expectedAction: 'info_modal_opened',
                    targetElement: '.location-modal',
                    points: 15
                },
                {
                    id: 'task_1_3',
                    instruction: 'Add Bangkok to favorites',
                    expectedAction: 'favorite_added',
                    targetElement: '.favorite-btn[data-location="bangkok"]',
                    points: 10
                }
            ],
            timeLimit: 180,
            difficulty: 'easy',
            category: 'exploration'
        },
        {
            id: 'scenario_02',
            title: 'Plan Travel Route',
            description: 'User wants to plan a trip from Bangkok to Chiang Mai',
            tasks: [
                {
                    id: 'task_2_1',
                    instruction: 'Open Route Planning tool',
                    expectedAction: 'route_planner_opened',
                    targetElement: '#routePlanningSection',
                    points: 15
                },
                {
                    id: 'task_2_2',
                    instruction: 'Select "Bangkok" as starting point',
                    expectedAction: 'route_from_selected',
                    targetElement: '#fromLocation',
                    points: 20
                },
                {
                    id: 'task_2_3',
                    instruction: 'Select "Chiang Mai" as destination',
                    expectedAction: 'route_to_selected',
                    targetElement: '#toLocation',
                    points: 20
                },
                {
                    id: 'task_2_4',
                    instruction: 'Calculate route',
                    expectedAction: 'route_calculated',
                    targetElement: '.route-btn',
                    points: 10
                }
            ],
            timeLimit: 240,
            difficulty: 'medium',
            category: 'planning'
        },
        {
            id: 'scenario_03',
            title: 'Use Search and Mascot Assistant Features',
            description: 'User wants to find information about "Wat Phra Kaew" using search',
            tasks: [
                {
                    id: 'task_3_1',
                    instruction: 'Type "Wat Phra Kaew" in search box',
                    expectedAction: 'search_performed',
                    targetElement: '#searchInput',
                    points: 15
                },
                {
                    id: 'task_3_2',
                    instruction: 'Click on search result',
                    expectedAction: 'search_result_clicked',
                    targetElement: '.search-result-item',
                    points: 20
                },
                {
                    id: 'task_3_3',
                    instruction: 'Click on PaiNai mascot for tips',
                    expectedAction: 'mascot_clicked',
                    targetElement: '#floatingMascot',
                    points: 15
                },
                {
                    id: 'task_3_4',
                    instruction: 'Read tip from mascot',
                    expectedAction: 'mascot_tip_read',
                    targetElement: '#mascotTip',
                    points: 10
                }
            ],
            timeLimit: 200,
            difficulty: 'medium',
            category: 'assistance'
        },
        {
            id: 'scenario_04',
            title: 'Explore All Features and Provide Feedback',
            description: 'Explore the overall application and provide suggestions',
            tasks: [
                {
                    id: 'task_4_1',
                    instruction: 'Change theme from light to dark',
                    expectedAction: 'theme_changed',
                    targetElement: '#themeToggle',
                    points: 10
                },
                {
                    id: 'task_4_2',
                    instruction: 'Change language from Thai to English',
                    expectedAction: 'language_changed',
                    targetElement: '#languageToggle',
                    points: 10
                },
                {
                    id: 'task_4_3',
                    instruction: 'Explore at least 3 different locations',
                    expectedAction: 'multiple_locations_explored',
                    targetElement: '.marker',
                    points: 30,
                    requiredCount: 3
                },
                {
                    id: 'task_4_4',
                    instruction: 'Provide feedback using Feedback button',
                    expectedAction: 'feedback_opened',
                    targetElement: '#feedbackWidget',
                    points: 20
                }
            ],
            timeLimit: 360,
            difficulty: 'easy',
            category: 'exploration'
        }
    ]
};

// ========================================
// USER TESTING SCENARIO SYSTEM
// ========================================

function initializeUserTesting() {
    // Load scenarios based on language
    userTesting.scenarios = testingScenarios[userPreferences.language] || testingScenarios.en;
    
    // Create testing interface
    createTestingInterface();
    
    // Setup testing event listeners
    setupTestingEventListeners();
    
    console.log('🧪 User Testing Scenarios System initialized');
}

function createTestingInterface() {
    // Create testing control panel
    const testingPanel = document.createElement('div');
    testingPanel.id = 'userTestingPanel';
    testingPanel.className = 'user-testing-panel hidden';
    testingPanel.innerHTML = `
        <div class="testing-header">
            <h3>🧪 ${userPreferences.language === 'th' ? 'ระบบทดสอบผู้ใช้' : 'User Testing System'}</h3>
            <button class="testing-close" onclick="toggleTestingPanel()">×</button>
        </div>
        <div class="testing-content">
            <div class="testing-info">
                <p><strong>${userPreferences.language === 'th' ? 'สถานะ:' : 'Status:'}</strong> 
                   <span id="testingStatus">${userPreferences.language === 'th' ? 'ไม่ได้ทดสอบ' : 'Not Testing'}</span></p>
                <p><strong>${userPreferences.language === 'th' ? 'Scenario:' : 'Scenario:'}</strong> 
                   <span id="currentScenarioName">-</span></p>
                <p><strong>${userPreferences.language === 'th' ? 'งานที่เสร็จ:' : 'Tasks Completed:'}</strong> 
                   <span id="tasksProgress">0/0</span></p>
                <p><strong>${userPreferences.language === 'th' ? 'เวลาที่ใช้:' : 'Time Used:'}</strong> 
                   <span id="testingTimer">00:00</span></p>
                <p><strong>${userPreferences.language === 'th' ? 'คะแนน:' : 'Score:'}</strong> 
                   <span id="testingScore">0</span></p>
            </div>
            
            <div class="scenario-selector">
                <label for="scenarioSelect">${userPreferences.language === 'th' ? 'เลือก Scenario:' : 'Select Scenario:'}</label>
                <select id="scenarioSelect">
                    <option value="">${userPreferences.language === 'th' ? 'เลือก...' : 'Choose...'}</option>
                    ${userTesting.scenarios.map((scenario, index) => 
                        `<option value="${index}">${scenario.title}</option>`
                    ).join('')}
                </select>
            </div>
            
            <div class="testing-controls">
                <button id="startTestingBtn" onclick="startTesting()">${userPreferences.language === 'th' ? '▶️ เริ่มทดสอบ' : '▶️ Start Testing'}</button>
                <button id="stopTestingBtn" onclick="stopTesting()" disabled>${userPreferences.language === 'th' ? '⏹️ หยุดทดสอบ' : '⏹️ Stop Testing'}</button>
                <button id="nextTaskBtn" onclick="nextTask()" disabled>${userPreferences.language === 'th' ? '⏭️ งานถัดไป' : '⏭️ Next Task'}</button>
            </div>
            
            <div id="currentTaskDisplay" class="current-task hidden">
                <h4>${userPreferences.language === 'th' ? '📋 งานปัจจุบัน:' : '📋 Current Task:'}</h4>
                <p id="taskInstruction"></p>
                <div class="task-status">
                    <span id="taskPoints"></span>
                    <span id="taskTimer"></span>
                </div>
            </div>
            
            <div id="testingResults" class="testing-results hidden">
                <h4>${userPreferences.language === 'th' ? '📊 ผลการทดสอบ' : '📊 Testing Results'}</h4>
                <div id="resultsContent"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(testingPanel);
    
    // Add keyboard shortcut to toggle testing panel (Ctrl+Shift+T)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTestingPanel();
        }
    });
}

function toggleTestingPanel() {
    const panel = document.getElementById('userTestingPanel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function startTesting() {
    const scenarioIndex = document.getElementById('scenarioSelect').value;
    if (scenarioIndex === '') {
        alert(userPreferences.language === 'th' ? 'กรุณาเลือก Scenario' : 'Please select a scenario');
        return;
    }
    
    userTesting.currentScenario = userTesting.scenarios[parseInt(scenarioIndex)];
    userTesting.scenarioIndex = parseInt(scenarioIndex);
    userTesting.isTestingMode = true;
    userTesting.startTime = Date.now();
    userTesting.completedTasks = [];
    userTesting.errors = [];
    
    // Initialize testing data
    userTesting.testingData = {
        sessionId: generateSessionId(),
        testerId: prompt(userPreferences.language === 'th' ? 'รหัสผู้ทดสอบ (ไม่บังคับ):' : 'Tester ID (optional):') || 'anonymous',
        scenarioId: userTesting.currentScenario.id,
        startTime: userTesting.startTime,
        tasks: [],
        userActions: [],
        errors: []
    };
    
    // Update UI
    updateTestingUI();
    showCurrentTask();
    startTestingTimer();
    
    // Track testing start
    trackUserInteraction('testing_started', {
        scenarioId: userTesting.currentScenario.id,
        testerId: userTesting.testingData.testerId
    });
    
    console.log('🧪 Testing started:', userTesting.currentScenario.title);
}

function stopTesting() {
    if (!userTesting.isTestingMode) return;
    
    userTesting.isTestingMode = false;
    clearInterval(userTesting.timerInterval);
    
    // Calculate results
    const results = calculateTestingResults();
    showTestingResults(results);
    
    // Track testing end
    trackUserInteraction('testing_ended', {
        scenarioId: userTesting.currentScenario.id,
        testerId: userTesting.testingData.testerId,
        results: results
    });
    
    console.log('🏁 Testing completed:', results);
}

function nextTask() {
    if (!userTesting.isTestingMode || !userTesting.currentScenario) return;
    
    const currentTaskIndex = userTesting.completedTasks.length;
    if (currentTaskIndex < userTesting.currentScenario.tasks.length) {
        showCurrentTask();
    } else {
        // All tasks completed
        stopTesting();
    }
}

function showCurrentTask() {
    if (!userTesting.currentScenario) return;
    
    const currentTaskIndex = userTesting.completedTasks.length;
    const currentTask = userTesting.currentScenario.tasks[currentTaskIndex];
    
    if (!currentTask) {
        stopTesting();
        return;
    }
    
    // Update UI
    document.getElementById('taskInstruction').textContent = currentTask.instruction;
    document.getElementById('taskPoints').textContent = `${currentTask.points} ${userPreferences.language === 'th' ? 'คะแนน' : 'points'}`;
    document.getElementById('currentTaskDisplay').classList.remove('hidden');
    
    // Highlight target element if it exists
    highlightTargetElement(currentTask.targetElement);
    
    // Start task timer
    userTesting.currentTaskStartTime = Date.now();
    
    console.log('📋 Current task:', currentTask.instruction);
}

function highlightTargetElement(selector) {
    // Remove previous highlights
    document.querySelectorAll('.testing-highlight').forEach(el => {
        el.classList.remove('testing-highlight');
    });
    
    // Highlight new target
    const targetElement = document.querySelector(selector);
    if (targetElement) {
        targetElement.classList.add('testing-highlight');
        
        // Scroll into view
        targetElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

function setupTestingEventListeners() {
    // Listen for user actions during testing
    document.addEventListener('click', handleTestingAction);
    document.addEventListener('input', handleTestingAction);
    document.addEventListener('change', handleTestingAction);
    
    // Listen for custom events
    window.addEventListener('locationFocused', handleTestingAction);
    window.addEventListener('favoriteToggled', handleTestingAction);
    window.addEventListener('themeChanged', handleTestingAction);
    window.addEventListener('languageChanged', handleTestingAction);
}

function handleTestingAction(event) {
    if (!userTesting.isTestingMode || !userTesting.currentScenario) return;
    
    const currentTaskIndex = userTesting.completedTasks.length;
    const currentTask = userTesting.currentScenario.tasks[currentTaskIndex];
    
    if (!currentTask) return;
    
    let actionMatched = false;
    let actionType = '';
    
    // Determine action type
    if (event.type === 'click') {
        const target = event.target;
        if (target.classList.contains('marker')) {
            actionType = 'marker_click';
            actionMatched = currentTask.expectedAction === 'marker_click';
        } else if (target.closest('.favorite-btn')) {
            actionType = 'favorite_clicked';
            actionMatched = currentTask.expectedAction === 'favorite_added';
        } else if (target.id === 'floatingMascot') {
            actionType = 'mascot_clicked';
            actionMatched = currentTask.expectedAction === 'mascot_clicked';
        } else if (target.closest('#feedbackWidget')) {
            actionType = 'feedback_opened';
            actionMatched = currentTask.expectedAction === 'feedback_opened';
        } else if (target.id === 'themeToggle') {
            actionType = 'theme_changed';
            actionMatched = currentTask.expectedAction === 'theme_changed';
        } else if (target.id === 'languageToggle') {
            actionType = 'language_changed';
            actionMatched = currentTask.expectedAction === 'language_changed';
        }
    } else if (event.type === 'input' && event.target.id === 'searchInput') {
        actionType = 'search_performed';
        actionMatched = currentTask.expectedAction === 'search_performed';
    }
    
    // Record action
    userTesting.testingData.userActions.push({
        timestamp: Date.now(),
        taskId: currentTask.id,
        actionType: actionType,
        target: event.target?.id || event.target?.className,
        matched: actionMatched
    });
    
    // Check if task is completed
    if (actionMatched) {
        completeTask(currentTask);
    }
}

function completeTask(task) {
    const taskDuration = Date.now() - userTesting.currentTaskStartTime;
    
    // Add to completed tasks
    userTesting.completedTasks.push({
        taskId: task.id,
        points: task.points,
        duration: taskDuration,
        completedAt: Date.now()
    });
    
    // Show success feedback
    showTaskCompletionFeedback(task);
    
    // Update UI
    updateTestingUI();
    
    // Auto-advance to next task after short delay
    setTimeout(() => {
        nextTask();
    }, 1500);
    
    console.log('✅ Task completed:', task.instruction);
}

function showTaskCompletionFeedback(task) {
    const feedback = document.createElement('div');
    feedback.className = 'task-completion-feedback';
    feedback.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">✅</div>
            <p><strong>${userPreferences.language === 'th' ? 'งานเสร็จสิ้น!' : 'Task Completed!'}</strong></p>
            <p>+${task.points} ${userPreferences.language === 'th' ? 'คะแนน' : 'points'}</p>
        </div>
    `;
    
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 2px solid #4ade80;
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        text-align: center;
        z-index: 1400;
        color: var(--panel-text);
        animation: taskCompletionPop 0.6s ease-out;
        box-shadow: 0 0 30px rgba(74, 222, 128, 0.5);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'taskCompletionFadeOut 0.3s ease-out';
        setTimeout(() => feedback.remove(), 300);
    }, 1200);
}

function updateTestingUI() {
    if (!userTesting.currentScenario) return;
    
    const totalTasks = userTesting.currentScenario.tasks.length;
    const completedCount = userTesting.completedTasks.length;
    const totalScore = userTesting.completedTasks.reduce((sum, task) => sum + task.points, 0);
    
    document.getElementById('testingStatus').textContent = userTesting.isTestingMode ? 
        (userPreferences.language === 'th' ? 'กำลังทดสอบ' : 'Testing') : 
        (userPreferences.language === 'th' ? 'ไม่ได้ทดสอบ' : 'Not Testing');
    
    document.getElementById('currentScenarioName').textContent = userTesting.currentScenario.title;
    document.getElementById('tasksProgress').textContent = `${completedCount}/${totalTasks}`;
    document.getElementById('testingScore').textContent = totalScore;
    
    // Update button states
    const startBtn = document.getElementById('startTestingBtn');
    const stopBtn = document.getElementById('stopTestingBtn');
    const nextBtn = document.getElementById('nextTaskBtn');
    
    if (userTesting.isTestingMode) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        nextBtn.disabled = false;
    } else {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        nextBtn.disabled = true;
    }
}

function startTestingTimer() {
    userTesting.timerInterval = setInterval(() => {
        const elapsed = Date.now() - userTesting.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        document.getElementById('testingTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function calculateTestingResults() {
    const totalTasks = userTesting.currentScenario.tasks.length;
    const completedCount = userTesting.completedTasks.length;
    const totalPossiblePoints = userTesting.currentScenario.tasks.reduce((sum, task) => sum + task.points, 0);
    const earnedPoints = userTesting.completedTasks.reduce((sum, task) => sum + task.points, 0);
    const totalTime = Date.now() - userTesting.startTime;
    
    const results = {
        scenarioId: userTesting.currentScenario.id,
        scenarioTitle: userTesting.currentScenario.title,
        totalTasks: totalTasks,
        completedTasks: completedCount,
        completionRate: (completedCount / totalTasks) * 100,
        totalScore: earnedPoints,
        maxScore: totalPossiblePoints,
        scorePercentage: (earnedPoints / totalPossiblePoints) * 100,
        totalTime: totalTime,
        averageTaskTime: completedCount > 0 ? totalTime / completedCount : 0,
        difficulty: userTesting.currentScenario.difficulty,
        category: userTesting.currentScenario.category,
        errors: userTesting.errors.length,
        testerId: userTesting.testingData.testerId,
        timestamp: Date.now()
    };
    
    return results;
}

function showTestingResults(results) {
    const resultsHtml = `
        <div class="results-summary">
            <div class="result-item">
                <strong>${userPreferences.language === 'th' ? 'อัตราความสำเร็จ:' : 'Completion Rate:'}</strong>
                <span class="result-value ${results.completionRate >= 80 ? 'success' : results.completionRate >= 60 ? 'warning' : 'error'}">
                    ${results.completionRate.toFixed(1)}%
                </span>
            </div>
            <div class="result-item">
                <strong>${userPreferences.language === 'th' ? 'คะแนน:' : 'Score:'}</strong>
                <span class="result-value">${results.totalScore}/${results.maxScore} (${results.scorePercentage.toFixed(1)}%)</span>
            </div>
            <div class="result-item">
                <strong>${userPreferences.language === 'th' ? 'เวลาทั้งหมด:' : 'Total Time:'}</strong>
                <span class="result-value">${Math.floor(results.totalTime / 60000)}:${Math.floor((results.totalTime % 60000) / 1000).toString().padStart(2, '0')}</span>
            </div>
            <div class="result-item">
                <strong>${userPreferences.language === 'th' ? 'เวลาเฉลี่ยต่องาน:' : 'Avg Time per Task:'}</strong>
                <span class="result-value">${Math.floor(results.averageTaskTime / 1000)}s</span>
            </div>
        </div>
        
        <div class="results-actions">
            <button onclick="exportTestingResults()" class="export-btn">
                📊 ${userPreferences.language === 'th' ? 'ส่งออกผลลัพธ์' : 'Export Results'}
            </button>
            <button onclick="restartScenario()" class="restart-btn">
                🔄 ${userPreferences.language === 'th' ? 'ทดสอบใหม่' : 'Restart Scenario'}
            </button>
        </div>
    `;
    
    document.getElementById('resultsContent').innerHTML = resultsHtml;
    document.getElementById('testingResults').classList.remove('hidden');
    
    // Store results
    storeTestingResults(results);
}

function exportTestingResults() {
    const results = calculateTestingResults();
    const exportData = {
        results: results,
        detailedData: userTesting.testingData,
        userActions: userTesting.testingData.userActions,
        completedTasks: userTesting.completedTasks,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-testing-results-${results.scenarioId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('📊 Testing results exported');
}

function restartScenario() {
    if (confirm(userPreferences.language === 'th' ? 
        'ต้องการเริ่มทดสอบใหม่หรือไม่?' : 
        'Do you want to restart the testing scenario?')) {
        
        // Reset testing state
        userTesting.isTestingMode = false;
        userTesting.completedTasks = [];
        userTesting.errors = [];
        clearInterval(userTesting.timerInterval);
        
        // Hide results and reset UI
        document.getElementById('testingResults').classList.add('hidden');
        document.getElementById('currentTaskDisplay').classList.add('hidden');
        
        // Remove highlights
        document.querySelectorAll('.testing-highlight').forEach(el => {
            el.classList.remove('testing-highlight');
        });
        
        updateTestingUI();
    }
}

function storeTestingResults(results) {
    const existingResults = JSON.parse(localStorage.getItem('painaidee-testing-results') || '[]');
    existingResults.push(results);
    
    // Keep only last 50 results
    if (existingResults.length > 50) {
        existingResults.splice(0, existingResults.length - 50);
    }
    
    localStorage.setItem('painaidee-testing-results', JSON.stringify(existingResults));
}

// ========================================
// INTEGRATION WITH ITERATIVE DESIGN SYSTEM
// ========================================

// Auto-initialize when iterative design system is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.iterativeDesign) {
        setTimeout(initializeUserTesting, 1000);
    }
});

// Export for global access
window.userTesting = userTesting;
window.initializeUserTesting = initializeUserTesting;
window.toggleTestingPanel = toggleTestingPanel;
window.startTesting = startTesting;
window.stopTesting = stopTesting;
window.nextTask = nextTask;
window.exportTestingResults = exportTestingResults;
window.restartScenario = restartScenario;
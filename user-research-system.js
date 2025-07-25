// User Research System for PaiNaiDee 3D Map
// ระบบวิจัยผู้ใช้สำหรับการสำรวจและสัมภาษณ์เพื่อพัฒนา UX/UI
// User Research System for conducting surveys and interviews to improve UX/UI

// ========================================
// USER RESEARCH SYSTEM CORE
// ========================================

class UserResearchSystem {
    constructor() {
        this.surveys = new Map();
        this.interviews = new Map();
        this.researchSessions = new Map();
        this.userData = new Map();
        this.analytics = {
            responses: [],
            demographics: {},
            usabilityIssues: [],
            improvements: []
        };
        this.isInitialized = false;
        this.currentLanguage = 'th';
        this.researchTypes = ['survey', 'interview', 'usability_test', 'feedback_session'];
        this.init();
    }

    init() {
        this.createResearchInterface();
        this.setupEventListeners();
        this.loadExistingData();
        this.initializeSurveyTemplates();
        this.initializeInterviewFrameworks();
        this.setupAnalytics();
        this.isInitialized = true;
        console.log('🔍 User Research System initialized successfully!');
    }

    // ========================================
    // SURVEY SYSTEM
    // ========================================

    createResearchInterface() {
        // Create main research panel
        const researchPanel = document.createElement('div');
        researchPanel.id = 'userResearchPanel';
        researchPanel.className = 'user-research-panel hidden';
        researchPanel.innerHTML = `
            <div class="research-header">
                <h3>🔍 ${this.getText('research_title')}</h3>
                <button class="research-close" onclick="toggleResearchPanel()">×</button>
            </div>
            
            <div class="research-tabs">
                <button class="research-tab active" data-tab="surveys">${this.getText('surveys')}</button>
                <button class="research-tab" data-tab="interviews">${this.getText('interviews')}</button>
                <button class="research-tab" data-tab="analytics">${this.getText('analytics')}</button>
                <button class="research-tab" data-tab="settings">${this.getText('settings')}</button>
            </div>
            
            <div class="research-content">
                <!-- Surveys Tab -->
                <div id="surveysTab" class="research-tab-content active">
                    <div class="survey-controls">
                        <h4>${this.getText('ux_surveys')}</h4>
                        <button id="newSurveyBtn" class="research-btn primary">${this.getText('create_survey')}</button>
                        <button id="quickSurveyBtn" class="research-btn secondary">${this.getText('quick_survey')}</button>
                    </div>
                    
                    <div class="survey-list" id="surveyList">
                        <!-- Survey items will be populated here -->
                    </div>
                    
                    <div class="active-survey" id="activeSurvey" style="display: none;">
                        <!-- Active survey content -->
                    </div>
                </div>
                
                <!-- Interviews Tab -->
                <div id="interviewsTab" class="research-tab-content">
                    <div class="interview-controls">
                        <h4>${this.getText('user_interviews')}</h4>
                        <button id="newInterviewBtn" class="research-btn primary">${this.getText('start_interview')}</button>
                        <button id="interviewGuideBtn" class="research-btn secondary">${this.getText('interview_guide')}</button>
                    </div>
                    
                    <div class="interview-sessions" id="interviewSessions">
                        <!-- Interview sessions will be listed here -->
                    </div>
                </div>
                
                <!-- Analytics Tab -->
                <div id="analyticsTab" class="research-tab-content">
                    <div class="analytics-overview">
                        <h4>${this.getText('research_analytics')}</h4>
                        <div class="analytics-stats" id="analyticsStats">
                            <!-- Analytics data will be displayed here -->
                        </div>
                        <div class="insights-section" id="insightsSection">
                            <!-- User insights and recommendations -->
                        </div>
                    </div>
                </div>
                
                <!-- Settings Tab -->
                <div id="settingsTab" class="research-tab-content">
                    <div class="research-settings">
                        <h4>${this.getText('research_settings')}</h4>
                        <div class="setting-group">
                            <label for="researchLanguage">${this.getText('language')}:</label>
                            <select id="researchLanguage" onchange="userResearch.changeLanguage(this.value)">
                                <option value="th" ${this.currentLanguage === 'th' ? 'selected' : ''}>ไทย</option>
                                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>
                        
                        <div class="setting-group">
                            <label for="autoSave">${this.getText('auto_save')}:</label>
                            <input type="checkbox" id="autoSave" checked>
                        </div>
                        
                        <div class="setting-group">
                            <label for="anonymousData">${this.getText('anonymous_data')}:</label>
                            <input type="checkbox" id="anonymousData" checked>
                        </div>
                        
                        <button id="exportDataBtn" class="research-btn secondary">${this.getText('export_data')}</button>
                        <button id="clearDataBtn" class="research-btn danger">${this.getText('clear_data')}</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(researchPanel);
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('research-tab')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Survey actions
        document.addEventListener('click', (e) => {
            if (e.target.id === 'newSurveyBtn') {
                this.createNewSurvey();
            } else if (e.target.id === 'quickSurveyBtn') {
                this.showQuickSurvey();
            } else if (e.target.id === 'newInterviewBtn') {
                this.startNewInterview();
            } else if (e.target.id === 'interviewGuideBtn') {
                this.showInterviewGuide();
            } else if (e.target.id === 'exportDataBtn') {
                this.exportResearchData();
            } else if (e.target.id === 'clearDataBtn') {
                this.clearResearchData();
            }
        });

        // Survey form submission
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('survey-questions')) {
                e.preventDefault();
                this.handleSurveySubmission(e.target);
            }
        });

        // Keyboard shortcut (Ctrl+Shift+R for Research)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                toggleResearchPanel();
            }
        });
    }

    handleSurveySubmission(form) {
        const formData = new FormData(form);
        const responses = {};
        
        // Process form data
        for (const [key, value] of formData.entries()) {
            if (key.endsWith('[]')) {
                // Handle multiple selections
                const cleanKey = key.slice(0, -2);
                if (!responses[cleanKey]) responses[cleanKey] = [];
                responses[cleanKey].push(value);
            } else {
                responses[key] = value;
            }
        }
        
        // Get template ID
        const templateId = form.closest('.survey-form').dataset.template;
        
        // Submit survey
        this.submitSurvey(responses, templateId);
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.research-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.research-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content
        document.getElementById(`${tabName}Tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Load tab-specific content
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        switch(tabName) {
            case 'surveys':
                this.loadSurveyList();
                break;
            case 'interviews':
                this.loadInterviewSessions();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'settings':
                // Settings are static, no need to reload
                break;
        }
    }

    // ========================================
    // SURVEY TEMPLATES AND QUESTIONS
    // ========================================

    initializeSurveyTemplates() {
        this.surveyTemplates = {
            ux_usability: {
                id: 'ux_usability',
                title: this.getText('ux_usability_survey'),
                description: this.getText('ux_usability_desc'),
                questions: [
                    {
                        id: 'ease_of_use',
                        type: 'scale',
                        question: this.getText('ease_of_use_question'),
                        scale: { min: 1, max: 5, labels: ['ยากมาก', 'ยาก', 'ปานกลาง', 'ง่าย', 'ง่ายมาก'] },
                        required: true
                    },
                    {
                        id: 'navigation_clarity',
                        type: 'scale',
                        question: this.getText('navigation_clarity_question'),
                        scale: { min: 1, max: 5, labels: ['ไม่ชัดเจนเลย', 'ไม่ชัดเจน', 'ปานกลาง', 'ชัดเจน', 'ชัดเจนมาก'] },
                        required: true
                    },
                    {
                        id: 'information_findability',
                        type: 'scale',
                        question: this.getText('info_findability_question'),
                        scale: { min: 1, max: 5, labels: ['หายากมาก', 'หายาก', 'ปานกลาง', 'หาง่าย', 'หาง่ายมาก'] },
                        required: true
                    },
                    {
                        id: 'visual_appeal',
                        type: 'scale',
                        question: this.getText('visual_appeal_question'),
                        scale: { min: 1, max: 5, labels: ['ไม่สวยเลย', 'ไม่สวย', 'ปานกลาง', 'สวย', 'สวยมาก'] },
                        required: true
                    },
                    {
                        id: 'feature_usefulness',
                        type: 'multiselect',
                        question: this.getText('useful_features_question'),
                        options: [
                            '3D Globe / โลก 3 มิติ',
                            'Search Function / การค้นหา',
                            'Favorites System / ระบบรายการโปรด',
                            'Trip Planning / การวางแผนทริป',
                            'Route Planning / การวางแผนเส้นทาง',
                            'Location Information / ข้อมูลสถานที่',
                            'Language Toggle / เปลี่ยนภาษา',
                            'Theme Toggle / เปลี่ยนธีม',
                            'Mascot Assistant / ช้างน้อยผู้ช่วย'
                        ],
                        required: true
                    },
                    {
                        id: 'problems_encountered',
                        type: 'multiselect',
                        question: this.getText('problems_encountered_question'),
                        options: [
                            'Globe rotation too fast/slow / โลกหมุนเร็ว/ช้าเกินไป',
                            'Difficult to click markers / คลิกจุดตำแหน่งยาก',
                            'Search not working properly / การค้นหาทำงานไม่ดี',
                            'Information hard to read / ข้อมูลอ่านยาก',
                            'Page loading slow / หน้าเว็บโหลดช้า',
                            'Mobile not responsive / มือถือใช้งานไม่ดี',
                            'Language mixing issues / ปัญหาการปะปนภาษา',
                            'Confusing navigation / การนำทางสับสน',
                            'Missing information / ข้อมูลไม่ครบ'
                        ],
                        required: false
                    },
                    {
                        id: 'improvement_suggestions',
                        type: 'textarea',
                        question: this.getText('improvement_suggestions_question'),
                        placeholder: this.getText('improvement_placeholder'),
                        required: false
                    },
                    {
                        id: 'overall_satisfaction',
                        type: 'scale',
                        question: this.getText('overall_satisfaction_question'),
                        scale: { min: 1, max: 10, labels: ['ไม่พอใจมาก', 'ไม่พอใจ', 'ปานกลาง', 'พอใจ', 'พอใจมาก'] },
                        required: true
                    },
                    {
                        id: 'recommend_others',
                        type: 'scale',
                        question: this.getText('recommend_others_question'),
                        scale: { min: 1, max: 10, labels: ['ไม่แนะนำ', 'อาจแนะนำ', 'แนะนำ'] },
                        required: true
                    }
                ]
            },
            
            user_demographics: {
                id: 'user_demographics',
                title: this.getText('demographics_survey'),
                description: this.getText('demographics_desc'),
                questions: [
                    {
                        id: 'age_group',
                        type: 'select',
                        question: this.getText('age_group_question'),
                        options: ['< 18', '18-25', '26-35', '36-45', '46-55', '> 55'],
                        required: true
                    },
                    {
                        id: 'gender',
                        type: 'select',
                        question: this.getText('gender_question'),
                        options: ['ชาย/Male', 'หญิง/Female', 'อื่นๆ/Other', 'ไม่ระบุ/Prefer not to say'],
                        required: false
                    },
                    {
                        id: 'tech_familiarity',
                        type: 'scale',
                        question: this.getText('tech_familiarity_question'),
                        scale: { min: 1, max: 5, labels: ['ไม่คุ้นเคย', 'คุ้นเคยน้อย', 'ปานกลาง', 'คุ้นเคย', 'คุ้นเคยมาก'] },
                        required: true
                    },
                    {
                        id: 'device_usage',
                        type: 'multiselect',
                        question: this.getText('device_usage_question'),
                        options: ['Desktop Computer', 'Laptop', 'Tablet/iPad', 'Smartphone', 'Smart TV'],
                        required: true
                    },
                    {
                        id: 'travel_frequency',
                        type: 'select',
                        question: this.getText('travel_frequency_question'),
                        options: [
                            'ไม่เคยเดินทาง / Never travel',
                            'นานๆ ครั้ง / Rarely (once a year)',
                            'บางครั้ง / Sometimes (2-3 times a year)',
                            'บ่อยๆ / Often (monthly)',
                            'เป็นประจำ / Very often (weekly)'
                        ],
                        required: true
                    },
                    {
                        id: 'primary_language',
                        type: 'select',
                        question: this.getText('primary_language_question'),
                        options: ['ไทย / Thai', 'English', 'Both equally / ทั้งสองภาษา', 'Other / อื่นๆ'],
                        required: true
                    }
                ]
            },

            feature_feedback: {
                id: 'feature_feedback',
                title: this.getText('feature_feedback_survey'),
                description: this.getText('feature_feedback_desc'),
                questions: [
                    {
                        id: 'most_used_features',
                        type: 'ranking',
                        question: this.getText('most_used_features_question'),
                        options: [
                            'Interactive 3D Globe',
                            'Location Search',
                            'Trip Planning',
                            'Favorites',
                            'Route Planning',
                            'Information Modals',
                            'Theme Toggle',
                            'Language Switch'
                        ],
                        required: true
                    },
                    {
                        id: 'missing_features',
                        type: 'multiselect',
                        question: this.getText('missing_features_question'),
                        options: [
                            'Weather Information / ข้อมูลสภาพอากาศ',
                            'Hotel Booking / จองโรงแรม',
                            'Restaurant Reviews / รีวิวร้านอาหาร',
                            'Transportation Info / ข้อมูลการเดินทาง',
                            'Local Events / กิจกรรมท้องถิ่น',
                            'Price Information / ข้อมูลราคา',
                            'Photo Gallery / แกลเลอรี่รูปภาพ',
                            'User Reviews / รีวิวผู้ใช้',
                            'Offline Maps / แผนที่ออฟไลน์',
                            'Social Sharing / แชร์โซเชียล'
                        ],
                        required: false
                    }
                ]
            }
        };
    }

    // ========================================
    // SURVEY FUNCTIONALITY
    // ========================================

    createNewSurvey() {
        const surveyModal = this.createSurveyModal();
        document.body.appendChild(surveyModal);
    }

    createSurveyModal() {
        const modal = document.createElement('div');
        modal.className = 'research-modal-overlay';
        modal.innerHTML = `
            <div class="research-modal">
                <div class="modal-header">
                    <h3>${this.getText('create_new_survey')}</h3>
                    <button class="modal-close" onclick="this.closest('.research-modal-overlay').remove()">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="survey-templates">
                        <h4>${this.getText('choose_survey_type')}</h4>
                        ${Object.values(this.surveyTemplates).map(template => `
                            <div class="survey-template-option" data-template="${template.id}">
                                <h5>${template.title}</h5>
                                <p>${template.description}</p>
                                <button class="select-template-btn" onclick="userResearch.selectSurveyTemplate('${template.id}')">${this.getText('select_template')}</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    selectSurveyTemplate(templateId) {
        const template = this.surveyTemplates[templateId];
        if (!template) return;

        // Close modal
        document.querySelector('.research-modal-overlay').remove();
        
        // Show survey
        this.displaySurvey(template);
    }

    displaySurvey(template) {
        const surveyContainer = document.getElementById('activeSurvey');
        surveyContainer.style.display = 'block';
        
        const surveyHtml = this.generateSurveyHTML(template);
        surveyContainer.innerHTML = surveyHtml;
        
        // Scroll to survey
        surveyContainer.scrollIntoView({ behavior: 'smooth' });
    }

    generateSurveyHTML(template) {
        return `
            <div class="survey-form" data-template="${template.id}">
                <div class="survey-header">
                    <h3>${template.title}</h3>
                    <p>${template.description}</p>
                    <div class="survey-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">0 / ${template.questions.length}</span>
                    </div>
                </div>
                
                <form class="survey-questions" id="surveyForm_${template.id}">
                    ${template.questions.map((question, index) => this.generateQuestionHTML(question, index)).join('')}
                    
                    <div class="survey-actions">
                        <button type="button" class="research-btn secondary" onclick="userResearch.closeSurvey()">${this.getText('cancel')}</button>
                        <button type="submit" class="research-btn primary">${this.getText('submit_survey')}</button>
                    </div>
                </form>
            </div>
        `;
    }

    generateQuestionHTML(question, index) {
        const baseHTML = `
            <div class="survey-question" data-question="${question.id}">
                <div class="question-header">
                    <span class="question-number">${index + 1}</span>
                    <h4 class="question-text">${question.question}</h4>
                    ${question.required ? '<span class="required">*</span>' : ''}
                </div>
                <div class="question-input">
        `;
        
        let inputHTML = '';
        
        switch(question.type) {
            case 'scale':
                inputHTML = this.generateScaleInput(question);
                break;
            case 'select':
                inputHTML = this.generateSelectInput(question);
                break;
            case 'multiselect':
                inputHTML = this.generateMultiselectInput(question);
                break;
            case 'textarea':
                inputHTML = this.generateTextareaInput(question);
                break;
            case 'ranking':
                inputHTML = this.generateRankingInput(question);
                break;
            default:
                inputHTML = `<input type="text" name="${question.id}" ${question.required ? 'required' : ''}>`;
        }
        
        return baseHTML + inputHTML + `
                </div>
            </div>
        `;
    }

    generateScaleInput(question) {
        const scale = question.scale;
        let html = '<div class="scale-input">';
        
        for (let i = scale.min; i <= scale.max; i++) {
            const label = scale.labels[i - scale.min] || i;
            html += `
                <label class="scale-option">
                    <input type="radio" name="${question.id}" value="${i}" ${question.required ? 'required' : ''}>
                    <span class="scale-number">${i}</span>
                    <span class="scale-label">${label}</span>
                </label>
            `;
        }
        
        html += '</div>';
        return html;
    }

    generateSelectInput(question) {
        let html = `<select name="${question.id}" ${question.required ? 'required' : ''}>`;
        html += '<option value="">' + this.getText('please_select') + '</option>';
        
        question.options.forEach(option => {
            html += `<option value="${option}">${option}</option>`;
        });
        
        html += '</select>';
        return html;
    }

    generateMultiselectInput(question) {
        let html = '<div class="multiselect-input">';
        
        question.options.forEach(option => {
            html += `
                <label class="checkbox-option">
                    <input type="checkbox" name="${question.id}[]" value="${option}">
                    <span class="checkbox-text">${option}</span>
                </label>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateTextareaInput(question) {
        return `
            <textarea 
                name="${question.id}" 
                placeholder="${question.placeholder || ''}"
                rows="4"
                ${question.required ? 'required' : ''}
            ></textarea>
        `;
    }

    generateRankingInput(question) {
        let html = '<div class="ranking-input" data-question="' + question.id + '">';
        html += '<p class="ranking-instructions">' + this.getText('ranking_instructions') + '</p>';
        html += '<div class="ranking-items">';
        
        question.options.forEach((option, index) => {
            html += `
                <div class="ranking-item" data-option="${option}" draggable="true">
                    <span class="rank-number">${index + 1}</span>
                    <span class="rank-text">${option}</span>
                    <span class="drag-handle">⋮⋮</span>
                </div>
            `;
        });
        
        html += '</div>';
        html += `<input type="hidden" name="${question.id}" value="">`;
        html += '</div>';
        
        return html;
    }

    // ========================================
    // QUICK SURVEY FUNCTIONALITY
    // ========================================

    showQuickSurvey() {
        const quickSurveyQuestions = [
            {
                id: 'quick_satisfaction',
                type: 'scale',
                question: this.getText('quick_satisfaction_question'),
                scale: { min: 1, max: 5, labels: ['😞', '🙁', '😐', '🙂', '😊'] },
                required: true
            },
            {
                id: 'quick_problems',
                type: 'textarea',
                question: this.getText('quick_problems_question'),
                placeholder: this.getText('quick_problems_placeholder'),
                required: false
            },
            {
                id: 'quick_improvements',
                type: 'textarea',
                question: this.getText('quick_improvements_question'),
                placeholder: this.getText('quick_improvements_placeholder'),
                required: false
            }
        ];

        const quickSurvey = {
            id: 'quick_survey',
            title: this.getText('quick_survey_title'),
            description: this.getText('quick_survey_desc'),
            questions: quickSurveyQuestions
        };

        this.displaySurvey(quickSurvey);
    }

    // ========================================
    // DATA COLLECTION AND ANALYSIS
    // ========================================

    submitSurvey(formData, templateId) {
        const surveyResponse = {
            id: `survey_${Date.now()}`,
            templateId: templateId,
            timestamp: new Date().toISOString(),
            responses: formData,
            participant: {
                id: this.generateParticipantId(),
                userAgent: navigator.userAgent,
                language: this.currentLanguage,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            }
        };

        // Store response
        this.analytics.responses.push(surveyResponse);
        this.saveToLocalStorage();

        // Show thank you message
        this.showThankYouMessage();

        // Update analytics
        this.updateAnalytics();

        // Close survey
        this.closeSurvey();
    }

    updateAnalytics() {
        // Calculate response statistics
        const responses = this.analytics.responses;
        
        // Demographics analysis
        this.analyzeDemographics(responses);
        
        // Usability issues identification
        this.identifyUsabilityIssues(responses);
        
        // Generate improvement recommendations
        this.generateImprovementRecommendations(responses);
        
        // Update analytics display
        this.displayAnalytics();
    }

    analyzeDemographics(responses) {
        const demographics = {};
        
        responses.forEach(response => {
            Object.keys(response.responses).forEach(key => {
                if (key.includes('age') || key.includes('gender') || key.includes('tech')) {
                    if (!demographics[key]) demographics[key] = {};
                    const value = response.responses[key];
                    demographics[key][value] = (demographics[key][value] || 0) + 1;
                }
            });
        });
        
        this.analytics.demographics = demographics;
    }

    identifyUsabilityIssues(responses) {
        const issues = [];
        const problemCounts = {};
        
        responses.forEach(response => {
            if (response.responses.problems_encountered) {
                const problems = Array.isArray(response.responses.problems_encountered) 
                    ? response.responses.problems_encountered 
                    : [response.responses.problems_encountered];
                
                problems.forEach(problem => {
                    problemCounts[problem] = (problemCounts[problem] || 0) + 1;
                });
            }
        });
        
        // Sort problems by frequency
        const sortedProblems = Object.entries(problemCounts)
            .sort(([,a], [,b]) => b - a)
            .map(([problem, count]) => ({
                issue: problem,
                frequency: count,
                percentage: (count / responses.length) * 100,
                priority: count > responses.length * 0.3 ? 'high' : 
                         count > responses.length * 0.1 ? 'medium' : 'low'
            }));
        
        this.analytics.usabilityIssues = sortedProblems;
    }

    generateImprovementRecommendations(responses) {
        const recommendations = [];
        
        // Analyze satisfaction scores
        const satisfactionScores = responses
            .filter(r => r.responses.overall_satisfaction)
            .map(r => parseInt(r.responses.overall_satisfaction));
        
        if (satisfactionScores.length > 0) {
            const avgSatisfaction = satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length;
            
            if (avgSatisfaction < 7) {
                recommendations.push({
                    category: 'Overall Experience',
                    priority: 'High',
                    recommendation: this.getText('improve_overall_satisfaction'),
                    evidence: `Average satisfaction: ${avgSatisfaction.toFixed(1)}/10`
                });
            }
        }
        
        this.analytics.improvements = recommendations;
    }

    displayAnalytics() {
        const statsContainer = document.getElementById('analyticsStats');
        const insightsContainer = document.getElementById('insightsSection');
        
        if (!statsContainer || !insightsContainer) return;
        
        // Display statistics
        const totalResponses = this.analytics.responses.length;
        statsContainer.innerHTML = `
            <div class="analytics-card">
                <h5>📊 ${this.getText('total_responses')}</h5>
                <div class="stat-number">${totalResponses}</div>
            </div>
            <div class="analytics-card">
                <h5>🔍 ${this.getText('usability_issues')}</h5>
                <div class="stat-number">${this.analytics.usabilityIssues.length}</div>
            </div>
            <div class="analytics-card">
                <h5>💡 ${this.getText('recommendations')}</h5>
                <div class="stat-number">${this.analytics.improvements.length}</div>
            </div>
        `;
        
        // Display insights
        if (this.analytics.usabilityIssues.length > 0) {
            insightsContainer.innerHTML = `
                <h5>🔍 ${this.getText('top_issues')}</h5>
                <div class="issues-list">
                    ${this.analytics.usabilityIssues.slice(0, 5).map(issue => `
                        <div class="issue-item priority-${issue.priority}">
                            <span class="issue-text">${issue.issue}</span>
                            <span class="issue-count">${issue.frequency} times (${issue.percentage.toFixed(1)}%)</span>
                        </div>
                    `).join('')}
                </div>
                
                <h5>💡 ${this.getText('recommendations')}</h5>
                <div class="recommendations-list">
                    ${this.analytics.improvements.map(rec => `
                        <div class="recommendation-item priority-${rec.priority.toLowerCase()}">
                            <h6>${rec.category}</h6>
                            <p>${rec.recommendation}</p>
                            <small>${rec.evidence}</small>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            insightsContainer.innerHTML = `
                <div class="no-data">
                    <p>${this.getText('no_data_yet')}</p>
                    <p>${this.getText('collect_data_first')}</p>
                </div>
            `;
        }
    }

    // ========================================
    // INTERVIEW FRAMEWORK (BASIC IMPLEMENTATION)
    // ========================================

    initializeInterviewFrameworks() {
        this.interviewFrameworks = {
            usability_interview: {
                id: 'usability_interview',
                title: this.getText('usability_interview'),
                duration: 30,
                questions: [
                    this.getText('intro_question'),
                    this.getText('travel_background_question'),
                    this.getText('map_usage_question'),
                    this.getText('overall_impression_question'),
                    this.getText('frustration_points_question'),
                    this.getText('improvement_ideas_question')
                ]
            }
        };
    }

    startNewInterview() {
        alert(this.getText('interview_feature_coming_soon'));
    }

    showInterviewGuide() {
        const guideModal = document.createElement('div');
        guideModal.className = 'research-modal-overlay';
        guideModal.innerHTML = `
            <div class="research-modal">
                <div class="modal-header">
                    <h3>${this.getText('interview_guide')}</h3>
                    <button class="modal-close" onclick="this.closest('.research-modal-overlay').remove()">×</button>
                </div>
                <div class="modal-body">
                    <div class="interview-guide">
                        <h4>${this.getText('suggested_questions')}</h4>
                        <ol>
                            ${this.interviewFrameworks.usability_interview.questions.map(q => `<li>${q}</li>`).join('')}
                        </ol>
                        <p><strong>${this.getText('duration')}:</strong> ${this.interviewFrameworks.usability_interview.duration} ${this.getText('minutes')}</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(guideModal);
    }

    // ========================================
    // LOCALIZATION
    // ========================================

    getText(key) {
        const texts = {
            th: {
                research_title: 'ระบบวิจัยผู้ใช้',
                surveys: 'แบบสำรวจ',
                interviews: 'สัมภาษณ์',
                analytics: 'การวิเคราะห์',
                settings: 'การตั้งค่า',
                ux_surveys: 'แบบสำรวจ UX/UI',
                create_survey: 'สร้างแบบสำรวจ',
                quick_survey: 'แบบสำรวจด่วน',
                user_interviews: 'สัมภาษณ์ผู้ใช้',
                start_interview: 'เริ่มสัมภาษณ์',
                interview_guide: 'คู่มือสัมภาษณ์',
                research_analytics: 'การวิเคราะห์การวิจัย',
                research_settings: 'การตั้งค่าการวิจัย',
                language: 'ภาษา',
                auto_save: 'บันทึกอัตโนมัติ',
                anonymous_data: 'ข้อมูลนิรนาม',
                export_data: 'ส่งออกข้อมูล',
                clear_data: 'ลบข้อมูล',
                
                // Survey templates
                ux_usability_survey: 'แบบสำรวจการใช้งาน UX/UI',
                ux_usability_desc: 'ประเมินความง่ายในการใช้งานและประสบการณ์ผู้ใช้',
                demographics_survey: 'แบบสำรวจข้อมูลผู้ใช้',
                demographics_desc: 'รวบรวมข้อมูลพื้นฐานของผู้ใช้เพื่อการวิเคราะห์',
                feature_feedback_survey: 'แบบสำรวจความคิดเห็นเกี่ยวกับฟีเจอร์',
                feature_feedback_desc: 'ประเมินฟีเจอร์ต่างๆ และความต้องการใหม่',
                
                // Questions
                ease_of_use_question: 'โดยรวมแล้ว คุณคิดว่าแผนที่ 3D นี้ใช้งานง่ายเพียงใด?',
                navigation_clarity_question: 'การนำทางภายในแอปพลิเคชันมีความชัดเจนเพียงใด?',
                info_findability_question: 'คุณหาข้อมูลที่ต้องการได้ง่ายเพียงใด?',
                visual_appeal_question: 'คุณคิดว่าการออกแบบภาพรวมเป็นอย่างไร?',
                useful_features_question: 'ฟีเจอร์ไหนที่คุณคิดว่ามีประโยชน์ที่สุด? (เลือกได้หลายข้อ)',
                problems_encountered_question: 'คุณพบปัญหาใดบ้างในการใช้งาน? (เลือกได้หลายข้อ)',
                improvement_suggestions_question: 'คุณมีข้อเสนอแนะใดบ้างเพื่อปรับปรุงแอปพลิเคชัน?',
                overall_satisfaction_question: 'โดยรวมแล้ว คุณพอใจกับแอปพลิเคชันนี้เพียงใด? (1-10)',
                recommend_others_question: 'คุณจะแนะนำแอปพลิเคชันนี้ให้คนอื่นหรือไม่? (1-10)',
                age_group_question: 'กลุ่มอายุของคุณ',
                gender_question: 'เพศ',
                tech_familiarity_question: 'ความคุ้นเคยกับเทคโนโลยี',
                device_usage_question: 'อุปกรณ์ที่ใช้งาน (เลือกได้หลายข้อ)',
                travel_frequency_question: 'ความถี่ในการเดินทาง',
                primary_language_question: 'ภาษาหลักที่ใช้',
                most_used_features_question: 'ฟีเจอร์ที่ใช้มากที่สุด (เรียงลำดับ)',
                missing_features_question: 'ฟีเจอร์ที่อยากให้เพิ่ม (เลือกได้หลายข้อ)',
                
                // Quick survey
                quick_satisfaction_question: 'คุณพอใจกับแอปพลิเคชันนี้เพียงใด?',
                quick_problems_question: 'คุณพบปัญหาอะไรบ้างในการใช้งาน?',
                quick_improvements_question: 'คุณอยากให้ปรับปรุงอะไรบ้าง?',
                quick_survey_title: 'แบบสำรวจด่วน',
                quick_survey_desc: 'ใช้เวลาแค่ 2-3 นาที',
                quick_problems_placeholder: 'เช่น โหลดช้า, ใช้งานยาก, หาข้อมูลไม่เจอ...',
                quick_improvements_placeholder: 'เช่น เพิ่มฟีเจอร์, ปรับปรุงการค้นหา, เพิ่มข้อมูล...',
                
                // Interview framework
                usability_interview: 'สัมภาษณ์การใช้งาน',
                intro_question: 'ขอให้แนะนำตัวและบอกเล่าเกี่ยวกับประสบการณ์การเดินทางของคุณ',
                travel_background_question: 'คุณมักใช้แอปหรือเว็บไซต์อะไรบ้างในการวางแผนท่องเที่ยว?',
                map_usage_question: 'คุณเคยใช้แผนที่ออนไลน์หรือแอปแผนที่บ้างหรือไม่? ชอบอะไร ไม่ชอบอะไร?',
                overall_impression_question: 'ความประทับใจแรกเมื่อเห็นแอปพลิเคชันนี้เป็นอย่างไร?',
                frustration_points_question: 'มีสิ่งใดที่ทำให้รู้สึกหงุดหงิดหรือสับสนบ้างไหม?',
                improvement_ideas_question: 'หากคุณเป็นนักพัฒนา คุณจะปรับปรุงอะไรบ้าง?',
                
                // Common actions
                submit_survey: 'ส่งแบบสำรวจ',
                cancel: 'ยกเลิก',
                please_select: 'กรุณาเลือก',
                create_new_survey: 'สร้างแบบสำรวจใหม่',
                choose_survey_type: 'เลือกประเภทแบบสำรวจ',
                select_template: 'เลือกแบบฟอร์มนี้',
                ranking_instructions: 'ลากเพื่อเรียงลำดับตามความสำคัญ (สำคัญมากที่สุดไว้บนสุด)',
                
                // Analytics
                total_responses: 'จำนวนคำตอบทั้งหมด',
                usability_issues: 'ปัญหาการใช้งาน',
                recommendations: 'ข้อเสนอแนะ',
                top_issues: 'ปัญหาหลัก',
                no_data_yet: 'ยังไม่มีข้อมูล',
                collect_data_first: 'เริ่มเก็บข้อมูลจากแบบสำรวจก่อน',
                improve_overall_satisfaction: 'ปรับปรุงประสบการณ์ผู้ใช้โดยรวม',
                
                // Messages
                thank_you: 'ขอบคุณ!',
                thank_you_message: 'ขอบคุณสำหรับความคิดเห็นที่มีค่า ข้อมูลของคุณจะช่วยปรับปรุงแอปพลิเคชันให้ดีขึ้น',
                close: 'ปิด',
                interview_feature_coming_soon: 'ฟีเจอร์สัมภาษณ์จะเปิดใช้งานในเร็วๆ นี้',
                suggested_questions: 'คำถามที่แนะนำ',
                duration: 'ระยะเวลา',
                minutes: 'นาที'
            },
            en: {
                research_title: 'User Research System',
                surveys: 'Surveys',
                interviews: 'Interviews',
                analytics: 'Analytics',
                settings: 'Settings',
                ux_surveys: 'UX/UI Surveys',
                create_survey: 'Create Survey',
                quick_survey: 'Quick Survey',
                user_interviews: 'User Interviews',
                start_interview: 'Start Interview',
                interview_guide: 'Interview Guide',
                research_analytics: 'Research Analytics',
                research_settings: 'Research Settings',
                language: 'Language',
                auto_save: 'Auto Save',
                anonymous_data: 'Anonymous Data',
                export_data: 'Export Data',
                clear_data: 'Clear Data',
                
                // Survey templates
                ux_usability_survey: 'UX/UI Usability Survey',
                ux_usability_desc: 'Evaluate ease of use and user experience',
                demographics_survey: 'User Demographics Survey',
                demographics_desc: 'Collect basic user information for analysis',
                feature_feedback_survey: 'Feature Feedback Survey',
                feature_feedback_desc: 'Evaluate features and identify new needs',
                
                // Questions
                ease_of_use_question: 'Overall, how easy do you find this 3D map to use?',
                navigation_clarity_question: 'How clear is the navigation within the application?',
                info_findability_question: 'How easy is it to find the information you need?',
                visual_appeal_question: 'What do you think about the overall visual design?',
                useful_features_question: 'Which features do you find most useful? (Multiple choice)',
                problems_encountered_question: 'What problems did you encounter? (Multiple choice)',
                improvement_suggestions_question: 'What suggestions do you have for improving the application?',
                overall_satisfaction_question: 'Overall, how satisfied are you with this application? (1-10)',
                recommend_others_question: 'Would you recommend this application to others? (1-10)',
                age_group_question: 'Age Group',
                gender_question: 'Gender',
                tech_familiarity_question: 'Technology Familiarity',
                device_usage_question: 'Device Usage (Multiple choice)',
                travel_frequency_question: 'Travel Frequency',
                primary_language_question: 'Primary Language',
                most_used_features_question: 'Most Used Features (Rank order)',
                missing_features_question: 'Missing Features (Multiple choice)',
                
                // Quick survey
                quick_satisfaction_question: 'How satisfied are you with this application?',
                quick_problems_question: 'What problems did you encounter?',
                quick_improvements_question: 'What would you like to improve?',
                quick_survey_title: 'Quick Survey',
                quick_survey_desc: 'Takes only 2-3 minutes',
                quick_problems_placeholder: 'e.g., slow loading, difficult to use, can\'t find information...',
                quick_improvements_placeholder: 'e.g., add features, improve search, add information...',
                
                // Interview framework
                usability_interview: 'Usability Interview',
                intro_question: 'Please introduce yourself and tell us about your travel experience',
                travel_background_question: 'What apps or websites do you usually use for travel planning?',
                map_usage_question: 'Have you used online maps or map apps? What do you like/dislike?',
                overall_impression_question: 'What\'s your first impression of this application?',
                frustration_points_question: 'Did anything frustrate or confuse you?',
                improvement_ideas_question: 'If you were the developer, what would you improve?',
                
                // Common actions
                submit_survey: 'Submit Survey',
                cancel: 'Cancel',
                please_select: 'Please select',
                create_new_survey: 'Create New Survey',
                choose_survey_type: 'Choose Survey Type',
                select_template: 'Select This Template',
                ranking_instructions: 'Drag to rank by importance (most important at top)',
                
                // Analytics
                total_responses: 'Total Responses',
                usability_issues: 'Usability Issues',
                recommendations: 'Recommendations',
                top_issues: 'Top Issues',
                no_data_yet: 'No data yet',
                collect_data_first: 'Collect data from surveys first',
                improve_overall_satisfaction: 'Improve overall user experience',
                
                // Messages
                thank_you: 'Thank You!',
                thank_you_message: 'Thank you for your valuable feedback. Your input will help improve the application.',
                close: 'Close',
                interview_feature_coming_soon: 'Interview feature coming soon',
                suggested_questions: 'Suggested Questions',
                duration: 'Duration',
                minutes: 'minutes'
            }
        };

        return texts[this.currentLanguage]?.[key] || texts.en[key] || key;
    }

    changeLanguage(language) {
        this.currentLanguage = language;
        // Refresh interface with new language
        if (this.isInitialized) {
            this.createResearchInterface();
        }
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    generateParticipantId() {
        return 'P' + Date.now().toString().slice(-6);
    }

    saveToLocalStorage() {
        localStorage.setItem('painaidee_research_data', JSON.stringify({
            surveys: Array.from(this.surveys.entries()),
            interviews: Array.from(this.interviews.entries()),
            analytics: this.analytics
        }));
    }

    loadExistingData() {
        const data = localStorage.getItem('painaidee_research_data');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                this.surveys = new Map(parsed.surveys || []);
                this.interviews = new Map(parsed.interviews || []);
                this.analytics = parsed.analytics || this.analytics;
            } catch (e) {
                console.warn('Failed to load research data:', e);
            }
        }
    }

    exportResearchData() {
        const data = {
            surveys: Array.from(this.surveys.entries()),
            interviews: Array.from(this.interviews.entries()),
            analytics: this.analytics,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `painaidee_research_data_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    clearResearchData() {
        if (confirm('Are you sure you want to clear all research data?')) {
            this.surveys.clear();
            this.interviews.clear();
            this.analytics = {
                responses: [],
                demographics: {},
                usabilityIssues: [],
                improvements: []
            };
            localStorage.removeItem('painaidee_research_data');
            
            // Refresh interface
            this.loadTabContent('analytics');
            alert('Research data cleared successfully');
        }
    }

    showThankYouMessage() {
        const thankYou = document.createElement('div');
        thankYou.className = 'thank-you-overlay';
        thankYou.innerHTML = `
            <div class="thank-you-content">
                <h3>🙏 ${this.getText('thank_you')}</h3>
                <p>${this.getText('thank_you_message')}</p>
                <button onclick="this.closest('.thank-you-overlay').remove()" class="research-btn primary">
                    ${this.getText('close')}
                </button>
            </div>
        `;
        
        thankYou.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        document.body.appendChild(thankYou);
        
        setTimeout(() => {
            thankYou.remove();
        }, 5000);
    }

    closeSurvey() {
        document.getElementById('activeSurvey').style.display = 'none';
    }

    // ========================================
    // IMPLEMENTATION STUBS
    // ========================================

    loadSurveyList() {
        const surveyList = document.getElementById('surveyList');
        if (surveyList) {
            surveyList.innerHTML = `
                <div class="survey-item">
                    <h5>Recent Surveys</h5>
                    <p>Total responses: ${this.analytics.responses.length}</p>
                </div>
            `;
        }
    }

    loadInterviewSessions() {
        const interviewSessions = document.getElementById('interviewSessions');
        if (interviewSessions) {
            interviewSessions.innerHTML = `
                <div class="interview-placeholder">
                    <p>Interview functionality will be available soon.</p>
                </div>
            `;
        }
    }

    loadAnalytics() {
        this.displayAnalytics();
    }

    setupAnalytics() {
        // Initialize analytics setup
        console.log('Analytics setup completed');
    }
}

// ========================================
// GLOBAL FUNCTIONS
// ========================================

function toggleResearchPanel() {
    const panel = document.getElementById('userResearchPanel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

function initializeUserSurveys() {
    if (!window.userResearch) {
        window.userResearch = new UserResearchSystem();
    }
    return window.userResearch;
}

// ========================================
// INITIALIZATION
// ========================================

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other systems to initialize
    setTimeout(() => {
        if (!window.userResearch) {
            window.userResearch = new UserResearchSystem();
        }
    }, 1000);
});

// Export for global access
window.UserResearchSystem = UserResearchSystem;
window.toggleResearchPanel = toggleResearchPanel;
window.initializeUserSurveys = initializeUserSurveys;
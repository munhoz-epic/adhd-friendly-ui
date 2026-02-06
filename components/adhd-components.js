/**
 * ADHD-Friendly UI Components Library
 *
 * Design system otimizado para neurodiversidade
 * By EPIC Digital - 2026
 *
 * SECURITY NOTE: Este código usa innerHTML em alguns lugares.
 * SEMPRE sanitize user input antes de passar para os componentes.
 * Recomendado: DOMPurify (https://github.com/cure53/DOMPurify)
 */

// ============================================================================
// UTILITY: Simple HTML Escaping (para prevenir XSS básico)
// Para produção, use DOMPurify ou similar
// ============================================================================

const ADHDUtils = {
  escapeHTML: (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  createElement: (tag, className, content) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.textContent = content;
    return el;
  }
};

// ============================================================================
// 1. TASK MANAGER (One Task at a Time)
// ============================================================================

class ADHDTaskManager {
  constructor(tasks, containerId) {
    this.tasks = tasks;
    this.currentIndex = 0;
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    const current = this.tasks[this.currentIndex];
    const total = this.tasks.length;
    const completed = this.currentIndex;
    const progress = (completed / total) * 100;

    // Clear container
    this.container.innerHTML = '';

    // Create wrapper
    const wrapper = ADHDUtils.createElement('div', 'adhd-task-manager');

    // Progress section
    const progressDiv = ADHDUtils.createElement('div', 'task-progress');
    const progressText = ADHDUtils.createElement('span', 'progress-text', `${completed} de ${total}`);
    const progressBar = ADHDUtils.createElement('div', 'progress-bar');
    const progressFill = ADHDUtils.createElement('div', 'progress-fill');
    progressFill.style.width = `${progress}%`;
    progressBar.appendChild(progressFill);
    progressDiv.appendChild(progressText);
    progressDiv.appendChild(progressBar);

    // Task card
    const taskCard = ADHDUtils.createElement('div', `task-card ${current.priority || 'medium'}`);

    const taskHeader = ADHDUtils.createElement('div', 'task-header');
    const taskTitle = ADHDUtils.createElement('h3', '', current.title);
    const taskStatus = ADHDUtils.createElement('span', `task-status ${current.status}`, this.getStatusLabel(current.status));
    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(taskStatus);

    taskCard.appendChild(taskHeader);

    if (current.description) {
      const desc = ADHDUtils.createElement('p', 'task-description', current.description);
      taskCard.appendChild(desc);
    }

    if (current.estimatedTime) {
      const time = ADHDUtils.createElement('div', 'task-time', `⏱️ ${current.estimatedTime}`);
      taskCard.appendChild(time);
    }

    // Action button
    const actionBtn = ADHDUtils.createElement('button', 'task-action-btn', '✓ Marcar como Concluída');
    actionBtn.onclick = () => this.completeTask();

    // Remaining tasks
    const remaining = ADHDUtils.createElement('div', 'remaining-tasks');
    const remainingHeader = ADHDUtils.createElement('div', 'remaining-header', `Próximas (${total - completed - 1})`);
    remaining.appendChild(remainingHeader);

    this.tasks.slice(this.currentIndex + 1, this.currentIndex + 4).forEach((task, idx) => {
      const miniTask = ADHDUtils.createElement('div', 'mini-task', task.title);
      miniTask.style.opacity = 0.6 - (idx * 0.2);
      remaining.appendChild(miniTask);
    });

    // Assemble
    wrapper.appendChild(progressDiv);
    wrapper.appendChild(taskCard);
    wrapper.appendChild(actionBtn);
    wrapper.appendChild(remaining);

    this.container.appendChild(wrapper);
  }

  getStatusLabel(status) {
    const labels = {
      'pending': '⏳ Pendente',
      'in-progress': '⏱️ Em andamento',
      'completed': '✓ Concluída',
      'urgent': '🔥 Urgente'
    };
    return labels[status] || status;
  }

  completeTask() {
    if (this.currentIndex < this.tasks.length - 1) {
      this.currentIndex++;
      this.render();
    } else {
      this.showCompletion();
    }
  }

  showCompletion() {
    this.container.innerHTML = '';
    const completion = ADHDUtils.createElement('div', 'completion-screen');

    const icon = ADHDUtils.createElement('div', 'completion-icon', '🎉');
    const title = ADHDUtils.createElement('h2', '', 'Todas as tarefas concluídas!');
    const text = ADHDUtils.createElement('p', '', `Você completou ${this.tasks.length} tarefas. Ótimo trabalho!`);

    completion.appendChild(icon);
    completion.appendChild(title);
    completion.appendChild(text);

    this.container.appendChild(completion);
  }
}

// ============================================================================
// 2. STATUS INDICATORS (Color-Coded Feedback)
// ============================================================================

const ADHDStatus = {
  _createStatus: (type, icon, title, message) => {
    const container = ADHDUtils.createElement('div', `adhd-status ${type}`);
    const iconEl = ADHDUtils.createElement('div', 'status-icon', icon);
    const content = ADHDUtils.createElement('div', 'status-content');
    const strong = ADHDUtils.createElement('strong', '', title);
    const p = ADHDUtils.createElement('p', '', message);

    content.appendChild(strong);
    content.appendChild(p);
    container.appendChild(iconEl);
    container.appendChild(content);

    return container.outerHTML;
  },

  success: (message) => ADHDStatus._createStatus('success', '✓', 'Sucesso', message),
  warning: (message) => ADHDStatus._createStatus('warning', '⚠️', 'Atenção', message),
  error: (message) => ADHDStatus._createStatus('error', '✗', 'Erro', message),
  info: (message) => ADHDStatus._createStatus('info', 'ℹ️', 'Informação', message)
};

// ============================================================================
// 3. PROGRESS STEPS (Clear Navigation)
// ============================================================================

class ADHDProgressSteps {
  constructor(steps, currentStep, containerId) {
    this.steps = steps;
    this.currentStep = currentStep;
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const wrapper = ADHDUtils.createElement('div', 'adhd-progress-steps');

    this.steps.forEach((step, index) => {
      const stepNumber = index + 1;
      let stepClass = 'step';

      if (stepNumber < this.currentStep) {
        stepClass += ' completed';
      } else if (stepNumber === this.currentStep) {
        stepClass += ' active';
      }

      const stepDiv = ADHDUtils.createElement('div', stepClass);
      const number = ADHDUtils.createElement('div', 'step-number', stepNumber.toString());
      const content = ADHDUtils.createElement('div', 'step-content');
      const title = ADHDUtils.createElement('h4', '', step.title);
      const desc = ADHDUtils.createElement('p', '', step.description);

      content.appendChild(title);
      content.appendChild(desc);
      stepDiv.appendChild(number);
      stepDiv.appendChild(content);

      wrapper.appendChild(stepDiv);
    });

    this.container.appendChild(wrapper);
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;
    this.render();
  }
}

// ============================================================================
// 4. FOCUS MODE (Distraction-Free Dialog)
// ============================================================================

class ADHDFocusMode {
  static show(options) {
    const {
      title,
      message,
      primaryAction,
      secondaryAction,
      onPrimary,
      onSecondary
    } = options;

    const overlay = ADHDUtils.createElement('div', 'adhd-focus-overlay');
    const modal = ADHDUtils.createElement('div', 'adhd-focus-modal');

    const h3 = ADHDUtils.createElement('h3', '', title);
    const p = ADHDUtils.createElement('p', '', message);
    const actions = ADHDUtils.createElement('div', 'focus-actions');

    const primaryBtn = ADHDUtils.createElement('button', 'focus-btn primary', primaryAction);
    primaryBtn.id = 'focusPrimary';
    actions.appendChild(primaryBtn);

    if (secondaryAction) {
      const secondaryBtn = ADHDUtils.createElement('button', 'focus-btn secondary', secondaryAction);
      secondaryBtn.id = 'focusSecondary';
      actions.appendChild(secondaryBtn);
    }

    modal.appendChild(h3);
    modal.appendChild(p);
    modal.appendChild(actions);
    overlay.appendChild(modal);

    document.body.appendChild(overlay);

    // Event listeners
    document.getElementById('focusPrimary').addEventListener('click', () => {
      if (onPrimary) onPrimary();
      ADHDFocusMode.close(overlay);
    });

    if (secondaryAction && onSecondary) {
      document.getElementById('focusSecondary').addEventListener('click', () => {
        onSecondary();
        ADHDFocusMode.close(overlay);
      });
    }

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        ADHDFocusMode.close(overlay);
      }
    });

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        ADHDFocusMode.close(overlay);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  static close(overlay) {
    overlay.classList.add('closing');
    setTimeout(() => overlay.remove(), 200);
  }
}

// ============================================================================
// 5. NOTIFICATION (Gentle, Non-Intrusive)
// ============================================================================

class ADHDNotification {
  static show(message, type = 'info', duration = 3000) {
    const notification = ADHDUtils.createElement('div', `adhd-notification ${type}`);

    const icons = {
      success: '✓',
      warning: '⚠️',
      error: '✗',
      info: 'ℹ️'
    };

    const icon = ADHDUtils.createElement('span', 'notification-icon', icons[type]);
    const msg = ADHDUtils.createElement('span', 'notification-message', message);

    notification.appendChild(icon);
    notification.appendChild(msg);

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);

    // Auto-dismiss
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}

// ============================================================================
// 6. CHUNKED CONTENT (Information Breakdown)
// ============================================================================

class ADHDChunkedContent {
  constructor(sections, containerId) {
    this.sections = sections;
    this.container = document.getElementById(containerId);
    this.expandedSections = new Set();
    this.render();
  }

  render() {
    this.container.innerHTML = '';
    const wrapper = ADHDUtils.createElement('div', 'adhd-chunked-content');

    this.sections.forEach((section, index) => {
      const isExpanded = this.expandedSections.has(index);
      const sectionDiv = ADHDUtils.createElement('div', `chunked-section ${isExpanded ? 'expanded' : ''}`);

      const header = ADHDUtils.createElement('div', 'chunk-header');
      header.onclick = () => this.toggleSection(index);

      const title = ADHDUtils.createElement('h3', '', section.title);
      const toggle = ADHDUtils.createElement('span', 'chunk-toggle', isExpanded ? '−' : '+');

      header.appendChild(title);
      header.appendChild(toggle);

      const content = ADHDUtils.createElement('div', 'chunk-content');
      content.style.display = isExpanded ? 'block' : 'none';
      // SECURITY NOTE: Se section.content contém HTML do usuário, sanitize antes!
      content.innerHTML = section.content;

      sectionDiv.appendChild(header);
      sectionDiv.appendChild(content);
      wrapper.appendChild(sectionDiv);
    });

    this.container.appendChild(wrapper);
  }

  toggleSection(index) {
    if (this.expandedSections.has(index)) {
      this.expandedSections.delete(index);
    } else {
      this.expandedSections.add(index);
    }
    this.render();
  }
}

// ============================================================================
// 7. KEYBOARD NAVIGATION (Accessibility++)
// ============================================================================

class ADHDKeyboardNav {
  static init(elements, options = {}) {
    const {
      enterAction = null,
      escAction = null,
      arrowNavigation = true
    } = options;

    let currentIndex = 0;

    // Focus first element
    if (elements.length > 0) {
      elements[0].focus();
    }

    // Enter key
    if (enterAction) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          enterAction(elements[currentIndex]);
        }
      });
    }

    // Escape key
    if (escAction) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          escAction();
        }
      });
    }

    // Arrow navigation
    if (arrowNavigation) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();

          if (e.key === 'ArrowDown') {
            currentIndex = Math.min(currentIndex + 1, elements.length - 1);
          } else {
            currentIndex = Math.max(currentIndex - 1, 0);
          }

          elements[currentIndex].focus();
        }
      });
    }
  }
}

// ============================================================================
// EXPORT
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ADHDTaskManager,
    ADHDStatus,
    ADHDProgressSteps,
    ADHDFocusMode,
    ADHDNotification,
    ADHDChunkedContent,
    ADHDKeyboardNav,
    ADHDUtils
  };
}

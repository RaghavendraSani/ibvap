/**
 * IBVAP Tactical Command — LoginScreen Component
 * Chic, subtle, and minimalist defense authentication terminal.
 * Strictly login only — no sign-up.
 */

export class LoginScreen {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('login-screen-root');
    this.onLoginSuccess = options.onLoginSuccess || null;
    this.requiredId = (options.requiredId || 'G103-BHU').toUpperCase();
    this.requiredKey = options.requiredKey || '12345678';
    this.element = null;

    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="chic-login-card">
        <!-- Minimal Header -->
        <div class="login-header-block">
          <div class="login-title">IBVAP</div>
        </div>

        <!-- Minimal Form -->
        <form id="military-login-form" class="login-form-body" autocomplete="off">
          <div class="form-field-group">
            <label for="login-service-no" class="field-label">ID</label>
            <input 
              type="text" 
              id="login-service-no" 
              class="field-input" 
              required 
              autocomplete="off" 
              spellcheck="false"
            />
          </div>

          <div class="form-field-group">
            <label for="login-passcode" class="field-label">KEY</label>
            <input 
              type="password" 
              id="login-passcode" 
              class="field-input" 
              required 
              autocomplete="current-password" 
            />
          </div>

          <!-- Auth Status Toast -->
          <div id="login-auth-status" class="login-auth-status"></div>

          <!-- Primary Submit Button -->
          <button type="submit" id="btn-authenticate" class="btn-chic-auth">
            <span>ENTER</span>
          </button>
        </form>
      </div>
    `;
  }

  bindEvents() {
    const form = this.container.querySelector('#military-login-form');
    const serviceNoInput = this.container.querySelector('#login-service-no');
    const passcodeInput = this.container.querySelector('#login-passcode');
    const authStatusMsg = this.container.querySelector('#login-auth-status');
    const btnAuth = this.container.querySelector('#btn-authenticate');

    // Submit handler
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const enteredId = serviceNoInput?.value.trim().toUpperCase() || '';
        const enteredKey = passcodeInput?.value.trim() || '';

        if (!enteredId || !enteredKey) {
          this.showStatus('Enter ID & Key', 'error');
          return;
        }

        // Strict hardcoded check (G103-BHU / 12345678)
        if (enteredId !== this.requiredId || enteredKey !== this.requiredKey) {
          this.showStatus('Invalid credentials', 'error');
          if (passcodeInput) {
            passcodeInput.value = '';
            passcodeInput.focus();
          }
          return;
        }

        // Verification in progress
        if (btnAuth) {
          btnAuth.classList.add('authenticating');
          btnAuth.innerHTML = `<span>VERIFYING</span>`;
        }

        this.showStatus('Verifying...', 'info');

        setTimeout(() => {
          this.showStatus('Authorized', 'success');

          setTimeout(() => {
            this.hide();

            // Reset button state
            if (btnAuth) {
              btnAuth.classList.remove('authenticating');
              btnAuth.innerHTML = `<span>ENTER</span>`;
            }
            if (authStatusMsg) {
              authStatusMsg.className = 'login-auth-status';
              authStatusMsg.textContent = '';
            }

            if (this.onLoginSuccess) {
              this.onLoginSuccess({
                serviceNo: enteredId,
                post: 'BOP-09'
              });
            }
          }, 300);
        }, 400);
      });
    }
  }

  showStatus(message, type = 'info') {
    const authStatusMsg = this.container.querySelector('#login-auth-status');
    if (!authStatusMsg) return;

    authStatusMsg.className = `login-auth-status active ${type}`;
    authStatusMsg.textContent = message;
  }

  show() {
    if (this.container) {
      this.container.style.display = 'flex';
      this.container.classList.remove('hidden');
      const passcodeInput = this.container.querySelector('#login-passcode');
      if (passcodeInput) passcodeInput.value = '';
    }
  }

  hide() {
    if (this.container) {
      this.container.classList.add('hidden');
      this.container.style.display = 'none';
    }
  }
}


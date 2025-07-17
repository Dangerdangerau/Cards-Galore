class CustomTabsCard extends HTMLElement {
  setConfig(config) {
    if (!config || !Array.isArray(config.tabs) || config.tabs.length === 0) {
      throw new Error("CustomTabsCard: 'tabs' array required in config.");
    }
    this.config = { selected: 0, navbar: false, ...config };
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this._render();
    this._fetchUserName();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          padding: 16px;
        }
        .header {
          font-size: 1.4em;
          margin-bottom: 10px;
          color: var(--primary-text-color);
        }
        .tabs {
          display: flex;
          ${this.config.navbar ? 'flex: 1;' : ''}
          flex-wrap: nowrap;
          gap: 5px;
          overflow-x: auto;
        }
        .tab {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: ${this.config.navbar ? '1' : 'initial'};
          text-align: center;
          padding: 10px;
          background-color: var(--primary-color);
          color: var(--text-primary-color, #fff);
          border-radius: 4px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.3s ease, font-weight 0.3s ease;
        }
        .tab.selected {
          background-color: var(--accent-color);
          font-weight: bold;
        }
        .tab:hover {
          filter: brightness(1.1);
        }
        .tab-icon {
          margin-right: 6px;
        }
      </style>
      <ha-card>
        <div class="header" id="greeting">Hello</div>
        <div class="tabs" id="tabs"></div>
      </ha-card>
    `;
    const tabsContainer = this.shadowRoot.getElementById('tabs');
    tabsContainer.innerHTML = '';
    this.config.tabs.forEach((tab, index) => {
      const tabEl = document.createElement('div');
      tabEl.classList.add('tab');
      if (index === this.config.selected) {
        tabEl.classList.add('selected');
      }
      if (tab.icon) {
        const iconEl = document.createElement('ha-icon');
        iconEl.classList.add('tab-icon');
        iconEl.setAttribute('icon', tab.icon);
        tabEl.appendChild(iconEl);
      }
      const textEl = document.createElement('span');
      textEl.textContent = tab.name || `Tab ${index + 1}`;
      tabEl.appendChild(textEl);
      tabEl.addEventListener('click', () => this._navigate(tab.path));
      tabsContainer.appendChild(tabEl);
    });
  }

  _fetchUserName() {
    if (!window.hassConnection) {
      this._updateGreeting('Guest');
      return;
    }
    window.hassConnection.then(({ conn }) => {
      conn.sendMessagePromise({ type: 'auth/current_user' })
        .then(user => this._updateGreeting(user.name || 'Guest'))
        .catch(() => this._updateGreeting('Guest'));
    });
  }

  _updateGreeting(name) {
    const greetingEl = this.shadowRoot.getElementById('greeting');
    if (greetingEl) greetingEl.textContent = `Hello ${name}`;
  }

  _navigate(path) {
    if (!path) return;
    history.pushState(null, '', path);
    window.dispatchEvent(new Event('location-changed'));
  }

  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('custom-tabs-card-editor');
  }

  static getStubConfig() {
    return {
      selected: 0,
      navbar: true,
      tabs: [
        { name: 'Tab1', path: '/lovelace/default_view', icon: 'mdi:view-dashboard' }
      ]
    };
  }
}

customElements.define('custom-tabs-card', CustomTabsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'custom-tabs-card',
  name: 'Custom Tabs Card',
  description: 'A tabbed navigation card with user greeting.'
});

class CustomTabsCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { ...config };
    this.renderEditor();
  }

  renderEditor() {
    this.innerHTML = `
      <style>
        .editor {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tabs-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tab-item {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 8px;
          align-items: center;
        }
        ha-textfield {
          width: 100%;
        }
        .add-btn {
          cursor: pointer;
          color: var(--accent-color);
          font-size: 1.8em;
          border: none;
          background: none;
        }
        .remove-btn {
          cursor: pointer;
          color: var(--error-color);
          font-size: 1.4em;
        }
      </style>
      <div class="editor">
        <ha-textfield type="number" id="selected" value="${this.config.selected || 0}" label="Selected Tab Index"></ha-textfield>
        <ha-switch id="navbar" ?checked=${this.config.navbar}></ha-switch>
        <label>Tabs</label>
        <div class="tabs-list" id="tabs-list"></div>
        <button class="add-btn" id="add-tab">＋</button>
      </div>
    `;
    this.querySelector('#navbar').addEventListener('change', () => this._update());
    this.querySelector('#selected').addEventListener('input', () => this._update());
    this.querySelector('#add-tab').addEventListener('click', () => this._addTab());
    this._renderTabs();
  }

  _renderTabs() {
    const tabsList = this.querySelector('#tabs-list');
    tabsList.innerHTML = '';
    (this.config.tabs || []).forEach((tab, index) => {
      const tabItem = document.createElement('div');
      tabItem.classList.add('tab-item');
      tabItem.innerHTML = `
        <ha-textfield label="Name" value="${tab.name || ''}" data-field="name" data-index="${index}"></ha-textfield>
        <ha-textfield label="Path" value="${tab.path || ''}" data-field="path" data-index="${index}"></ha-textfield>
        <ha-textfield label="Icon (mdi:name)" value="${tab.icon || ''}" data-field="icon" data-index="${index}"></ha-textfield>
        <span class="remove-btn" data-index="${index}">✖</span>
      `;
      tabItem.querySelectorAll('ha-textfield').forEach(input => {
        input.addEventListener('change', (e) => this._updateTab(e));
      });
      tabItem.querySelector('.remove-btn').addEventListener('click', (e) => this._removeTab(e));
      tabsList.appendChild(tabItem);
    });
  }

  _addTab() {
    this.config.tabs.push({ name: '', path: '', icon: '' });
    this._renderTabs();
    this._update(false);
  }

  _removeTab(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if (!isNaN(index) && index >= 0 && index < this.config.tabs.length) {
      this.config.tabs.splice(index, 1);
      this._renderTabs();
      this._update(false);
    }
  }

  _updateTab(e) {
    const field = e.target.dataset.field;
    const index = parseInt(e.target.dataset.index, 10);
    if (!isNaN(index) && this.config.tabs[index]) {
      this.config.tabs[index] = {
        ...this.config.tabs[index],
        [field]: e.target.value
      };
      this.dispatchEvent(new CustomEvent('config-changed', {
        detail: { config: { ...this.config } }
      }));
    }
  }

  _update(updateNavbar = true) {
    const selected = parseInt(this.querySelector('#selected').value, 10) || 0;
    const navbar = updateNavbar ? this.querySelector('#navbar').checked : this.config.navbar;
    this.dispatchEvent(new CustomEvent('config-changed', {
      detail: { config: { ...this.config, selected, navbar } }
    }));
  }
}

customElements.define('custom-tabs-card-editor', CustomTabsCardEditor);

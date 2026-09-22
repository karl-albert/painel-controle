/**
 * Módulo de Integração com API do GitHub Actions
 * Responsável por buscar runs, status de semáforo e disparar rotinas
 */

const GitHubClient = {
  getToken() {
    // 1. Tenta pegar do parâmetro de URL (ex: ?token=ghp_xxx)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken && urlToken.trim() !== '') {
      const cleanToken = urlToken.trim();
      localStorage.setItem('gh_pat', cleanToken);
      // Remove o token da barra de endereço para segurança
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
      return cleanToken;
    }
    // 2. Tenta do localStorage
    return localStorage.getItem('gh_pat') || '';
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('gh_pat', token.trim());
    } else {
      localStorage.removeItem('gh_pat');
    }
  },

  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async fetchWorkflowRuns(repo, wfFile, perPage = 12) {
    const url = `https://api.github.com/repos/${repo}/actions/workflows/${wfFile}/runs?per_page=${perPage}`;
    try {
      const res = await fetch(url, { headers: this.getHeaders() });
      const rateRemaining = res.headers.get('x-ratelimit-remaining');
      if (rateRemaining !== null) {
        sessionStorage.setItem('gh_rate_remaining', rateRemaining);
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Autenticação necessária ou limite de taxa atingido. Configure o Token nas Configurações.');
        }
        if (res.status === 404) {
          throw new Error(`Repositório ou workflow não encontrado (${repo}/${wfFile}).`);
        }
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const data = await res.json();
      return data.workflow_runs || [];
    } catch (err) {
      console.warn(`[GitHubClient] Erro ao buscar ${repo}/${wfFile}:`, err.message);
      return { error: err.message };
    }
  },

  async dispatchWorkflow(repo, wfFile, ref = 'main') {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token do GitHub é obrigatório para disparar rotinas. Configure na aba Configurações.');
    }

    const url = `https://api.github.com/repos/${repo}/actions/workflows/${wfFile}/dispatches`;
    const res = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ref: ref })
    });

    if (res.status === 204) {
      return { success: true };
    } else {
      const text = await res.text();
      let msg = `Erro HTTP ${res.status}`;
      try {
        const json = JSON.parse(text);
        if (json.message) msg = json.message;
      } catch (e) {}
      throw new Error(msg);
    }
  },

  async testConnection() {
    const token = this.getToken();
    if (!token) return { ok: false, message: 'Nenhum token configurado.' };

    try {
      const res = await fetch('https://api.github.com/user', { headers: this.getHeaders() });
      if (res.ok) {
        const user = await res.json();
        const rateRemaining = res.headers.get('x-ratelimit-remaining');
        return { ok: true, user: user.login, remaining: rateRemaining };
      } else {
        return { ok: false, message: `Status ${res.status}: Token inválido ou expirado.` };
      }
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }
};

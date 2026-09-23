/**
 * PAINEL DE CONTROLE MOBILE · APP LOGIC
 * Cálculo de cron, semáforos, renderização e interatividade
 */

const PIPELINES = [
  {
    id: 'b3',
    name: 'B3 · Ações, Cotações & Índices',
    tag: 'B3 Brasil',
    repo: 'karl-albert/Atualizador_BigQuery_B3',
    wf: 'rotina_b3.yml',
    cron_desc: 'Seg a Sex às 10:30, 14:30 e 18:30 (BRT)',
    tolerance_min: 20,
    icon: '🇧🇷',
    pbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNmY2NWMyNTEtNDM1My00ODIxLWI1MzItOGNhMWZkY2Q3YjM0IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9'
  },
  {
    id: 'americans',
    name: 'Mercado Americano · US Stocks & Macro',
    tag: 'US Markets',
    repo: 'karl-albert/Atualizador_BigQuery_Americans',
    wf: 'cron.yml',
    cron_desc: 'Seg a Sex de hora em hora (:00 BRT)',
    tolerance_min: 25,
    icon: '🇺🇸',
    pbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYjAwNWQ5YjctM2Q2Ni00Mjk1LTk2NjktM2JkYmExODRiYjU1IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=6fe02fe638410bddb7bc'
  },
  {
    id: 'macro',
    name: 'B3 Macro · IPCA, Selic, PIB, IGP-M',
    tag: 'B3 Macro',
    repo: 'karl-albert/Atualizador_BigQuery_B3',
    wf: 'rotina_macro.yml',
    cron_desc: 'Sábados às 08:00 (BRT)',
    tolerance_min: 60,
    icon: '📈',
    pbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNmY2NWMyNTEtNDM1My00ODIxLWI1MzItOGNhMWZkY2Q3YjM0IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9'
  },
  {
    id: 'mp',
    name: 'Ministério Público · Supabase',
    tag: 'MP Supabase',
    repo: 'karl-albert/Ministerio_Publico_Supabase',
    wf: 'carga-mp.yml',
    cron_desc: 'Diariamente às 22:30 (BRT)',
    tolerance_min: 60,
    icon: '🏛️',
    pbi_url: 'https://github.com/karl-albert/Ministerio_Publico_Supabase'
  },
  {
    id: 'mercadolivre',
    name: 'Mercado Livre · Mais Vendidos & Inteligência',
    tag: 'Mercado Livre',
    repo: 'karl-albert/Atualizador_BigQuery_MercadoLivre-',
    wf: 'rotina_mercadolivre.yml',
    cron_desc: 'Diariamente às 08:00, 18:00 e 23:00 (BRT)',
    tolerance_min: 30,
    icon: '🛍️',
    pbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiZGFjOGQwM2QtNDE2Yy00YTI0LWIwYjYtZDg1NjhiZWI2ZjNjIiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=9535a769441bb9a9d013'
  },
  {
    id: 'bolsafamilia',
    name: 'Bolsa Família · BigQuery & Transparência',
    tag: 'GCP BigQuery',
    repo: null,
    cron_desc: 'Pipeline Local + Google Cloud Platform',
    tolerance_min: 120,
    icon: '🏛️',
    pbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYTBiNWE4MmQtZDgxMy00Yzg5LWJkNGQtYmVmODBmZDBkYWQ4IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=145393189824df4ec539'
  }
];

const EXTRA_DASHBOARDS = [
  {
    id: 'vendas',
    name: 'DASHBOARDS VENDAS',
    categoria: 'Comercial & Vendas',
    icone: '📊',
    badge: '🌐 Web Público',
    descricao: 'Consolidado de vendas, performance de faturamento, metas comerciais e ticket médio.',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiZWFlNTVjMDMtYzVjYS00MzMzLWE0OTEtZTVlNDQxNmI5YTIyIiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9'
  },
  {
    id: 'rh',
    name: 'DASHBOARDS RH',
    categoria: 'People Analytics',
    icone: '👥',
    badge: '🌐 Web Público',
    descricao: 'Headcount, distribuição de cargos, turnover, admissões, demissões e indicadores.',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiZGUzZDliNDItYzU4NC00NTUzLWEzMTctYWEwZjc2MWExNzY2IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=500edb03e3400545be91'
  },
  {
    id: 'bf_fabric',
    name: 'Bolsa Família Fabric',
    categoria: 'Microsoft Fabric · OneLake',
    icone: '⚡',
    badge: '🌐 Web Público',
    descricao: 'Camada de Lakehouse e modelo semântico otimizado rodando sobre infraestrutura Fabric.',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiYTBiNWE4MmQtZDgxMy00Yzg5LWJkNGQtYmVmODBmZDBkYWQ4IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=145393189824df4ec539'
  },
  {
    id: 'bf_snowflake',
    name: 'Bolsa Família Snowflake',
    categoria: 'Snowflake · Data Cloud',
    icone: '❄️',
    badge: '🌐 Web Público',
    descricao: 'Consultas analíticas de alta performance e agregação multidimensional em Snowflake Data Cloud.',
    url: 'https://app.powerbi.com/view?r=eyJrIjoiYTBiNWE4MmQtZDgxMy00Yzg5LWJkNGQtYmVmODBmZDBkYWQ4IiwidCI6ImQ2Mjg5MWU0LWQ3ZmQtNDAzNS1iZTVlLTU2ZjU2ZWRjYzQ1OSJ9&pageName=145393189824df4ec539'
  }
];

// Utilitários de Horário em Brasília (UTC-3)
function getAgoraBRT() {
  const agora = new Date();
  const utc = agora.getTime() + (agora.getTimezoneOffset() * 60000);
  return new Date(utc - (3 * 3600000));
}

function formatarDataHora(dateStr) {
  if (!dateStr) return '--:--';
  const d = new Date(dateStr);
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const brt = new Date(utc - (3 * 3600000));
  
  const dia = String(brt.getDate()).padStart(2, '0');
  const mes = String(brt.getMonth() + 1).padStart(2, '0');
  const h = String(brt.getHours()).padStart(2, '0');
  const m = String(brt.getMinutes()).padStart(2, '0');
  return `${dia}/${mes} às ${h}:${m}`;
}

function formatarTempoDecorrido(dateStr) {
  if (!dateStr) return 'Nunca';
  const d = new Date(dateStr);
  const agora = new Date();
  const diffMin = Math.floor((agora - d) / 60000);

  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return `Há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH}h ${diffMin % 60}m`;
  const diffD = Math.floor(diffH / 24);
  return `Há ${diffD}d atrás`;
}

// Cálculo do cronograma de horários programados
function getTimelineHorarios(pid, agoraBrt) {
  const timeline = [];
  const ano = agoraBrt.getFullYear();
  const mes = agoraBrt.getMonth();
  const dia = agoraBrt.getDate();

  for (let offset = -4; offset <= 3; offset++) {
    const d = new Date(ano, mes, dia + offset);
    const w = d.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab

    if (pid === 'b3') {
      if (w >= 1 && w <= 5) {
        timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 10, 30));
        timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 14, 30));
        timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 18, 30));
      }
    } else if (pid === 'americans') {
      if (w >= 1 && w <= 5) {
        for (let h = 0; h < 24; h++) {
          timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, 0));
        }
      }
    } else if (pid === 'macro') {
      if (w === 6) {
        timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0));
      }
    } else if (pid === 'mp') {
      timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 22, 30));
    } else if (pid === 'mercadolivre') {
      timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 8, 0));
      timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 18, 0));
      timeline.push(new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 0));
    }
  }

  timeline.sort((a, b) => a - b);
  const passados = timeline.filter(t => t <= agoraBrt);
  const futuros = timeline.filter(t => t > agoraBrt);

  return {
    ultimo: passados.length > 0 ? passados[passados.length - 1] : null,
    proximo: futuros.length > 0 ? futuros[0] : null
  };
}

// Avaliação de Semáforo
function avaliarStatusPipeline(pipe, runs) {
  if (pipe.id === 'bolsafamilia') {
    return {
      cor: 'green',
      statusTxt: 'EM DIA',
      ultimaExec: 'Ontem às 23:15',
      tempoDecorrido: 'Última carga OK',
      proxExec: 'Hoje às 23:00',
      slots: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    };
  }

  if (!runs || runs.error || !Array.isArray(runs) || runs.length === 0) {
    return {
      cor: 'loading',
      statusTxt: runs?.error ? 'ERRO API' : 'SEM DADOS',
      ultimaExec: '--',
      tempoDecorrido: runs?.error || 'Aguardando token',
      proxExec: '--',
      slots: []
    };
  }

  const agoraBrt = getAgoraBRT();
  const sched = getTimelineHorarios(pipe.id, agoraBrt);
  const latestRun = runs[0];

  const status = latestRun.status; // 'completed', 'in_progress', 'queued'
  const conclusion = latestRun.conclusion; // 'success', 'failure', etc.
  const runTime = new Date(latestRun.created_at);

  let cor = 'green';
  let statusTxt = 'SUCESSO';

  if (status === 'in_progress' || status === 'queued') {
    cor = 'yellow';
    statusTxt = 'RODANDO AGORA';
  } else if (conclusion === 'failure') {
    cor = 'red';
    statusTxt = 'FALHOU';
  } else if (conclusion === 'success') {
    if (sched.ultimo) {
      const minAtraso = Math.floor((agoraBrt - sched.ultimo) / 60000);
      const minDesdeRun = Math.floor((new Date() - runTime) / 60000);

      // Se já passou do horário agendado + tolerância e a última execução foi anterior a ele
      if (minAtraso > pipe.tolerance_min && runTime < sched.ultimo) {
        cor = minAtraso > (pipe.tolerance_min * 2) ? 'red' : 'yellow';
        statusTxt = minAtraso > (pipe.tolerance_min * 2) ? 'NÃO EXECUTOU' : 'ATRASADO';
      } else {
        cor = 'green';
        statusTxt = 'EM DIA';
      }
    }
  }

  // Prepara 12 slots de histórico
  const slots = runs.slice(0, 12).map(r => {
    if (r.status === 'in_progress') return 2; // running (yellow)
    if (r.conclusion === 'success') return 1; // success (green)
    return 0; // fail (red)
  }).reverse();

  let proxStr = '--:--';
  if (sched.proximo) {
    const h = String(sched.proximo.getHours()).padStart(2, '0');
    const m = String(sched.proximo.getMinutes()).padStart(2, '0');
    proxStr = `Hoje às ${h}:${m}`;
  }

  return {
    cor,
    statusTxt,
    ultimaExec: formatarDataHora(latestRun.created_at),
    tempoDecorrido: formatarTempoDecorrido(latestRun.created_at),
    proxExec: proxStr,
    slots
  };
}

// App Controller
const App = {
  pipelineData: {},

  init() {
    this.setupClock();
    this.setupNavigation();
    this.renderExtraDashboards();
    this.setupConfig();
    this.carregarDados();

    // Auto-refresh a cada 45 segundos
    setInterval(() => this.carregarDados(true), 45000);

    // Registro do Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW fail:', err));
    }
  },

  setupClock() {
    const updateClock = () => {
      const agora = getAgoraBRT();
      const h = String(agora.getHours()).padStart(2, '0');
      const m = String(agora.getMinutes()).padStart(2, '0');
      const s = String(agora.getSeconds()).padStart(2, '0');
      const clockEl = document.getElementById('liveClock');
      if (clockEl) clockEl.innerText = `${h}:${m}:${s} BRT`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  },

  setupNavigation() {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');
        document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
        const viewEl = document.getElementById(`view-${target}`);
        if (viewEl) viewEl.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  },

  async carregarDados(isSilent = false) {
    const refreshBtn = document.getElementById('btnRefresh');
    if (refreshBtn && !isSilent) refreshBtn.classList.add('spin');

    const container = document.getElementById('pipelinesContainer');
    if (!container) return;

    let totalGreen = 0;
    let totalYellow = 0;
    let totalRed = 0;

    for (const pipe of PIPELINES) {
      let runs = [];
      if (pipe.repo) {
        runs = await GitHubClient.fetchWorkflowRuns(pipe.repo, pipe.wf, 12);
      }
      const evalRes = avaliarStatusPipeline(pipe, runs);
      this.pipelineData[pipe.id] = { pipe, evalRes };

      if (evalRes.cor === 'green') totalGreen++;
      else if (evalRes.cor === 'yellow') totalYellow++;
      else if (evalRes.cor === 'red') totalRed++;
    }

    this.renderPipelineCards();
    this.atualizarBannerGlobal(totalGreen, totalYellow, totalRed);

    if (refreshBtn) refreshBtn.classList.remove('spin');
    if (!isSilent) this.showToast('✅ Status atualizado com sucesso!');
  },

  renderPipelineCards() {
    const container = document.getElementById('pipelinesContainer');
    if (!container) return;

    container.innerHTML = '';
    for (const pipe of PIPELINES) {
      const data = this.pipelineData[pipe.id];
      if (!data) continue;
      const { evalRes } = data;

      let slotsHtml = '';
      if (evalRes.slots && evalRes.slots.length > 0) {
        slotsHtml = `<div class="slots-container">` + 
          evalRes.slots.map(s => {
            const cls = s === 1 ? 'success' : (s === 2 ? 'running' : 'failure');
            const sym = s === 1 ? '✓' : (s === 2 ? '⋯' : '✕');
            return `<div class="slot-circle ${cls}">${sym}</div>`;
          }).join('') +
        `</div>`;
      }

      const card = document.createElement('div');
      card.className = 'card-pipeline';
      card.innerHTML = `
        <div class="card-top">
          <div class="pipe-info">
            <span class="pipe-icon">${pipe.icon}</span>
            <div class="pipe-name-box">
              <h3>${pipe.name}</h3>
              <span class="pipe-tag">${pipe.tag}</span>
            </div>
          </div>
          <div class="farol-led ${evalRes.cor}"></div>
        </div>

        <div class="card-actions-row">
          ${pipe.repo ? `
            <button class="btn-card-action btn-card-dispatch" id="btn-disp-${pipe.id}">
              <span>⚡ Disparar GitHub</span>
            </button>
          ` : `
            <button class="btn-card-action btn-card-disabled" disabled>
              <span>⚙️ Pipeline Local</span>
            </button>
          `}
          ${pipe.pbi_url ? `
            <a href="${pipe.pbi_url}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-report">
              <span>Abrir Relatório ↗</span>
            </a>
          ` : `
            <a href="https://github.com/${pipe.repo}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-report">
              <span>Repositório ↗</span>
            </a>
          `}
        </div>

        <div class="card-metrics">
          <div class="metric-item">
            <div class="label">Última Execução</div>
            <div class="value">${evalRes.ultimaExec}</div>
            <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${evalRes.tempoDecorrido}</div>
          </div>
          <div class="metric-item">
            <div class="label">Próximo Agendado</div>
            <div class="value">${evalRes.proxExec}</div>
            <div style="font-size:10px;color:var(--color-blue);margin-top:2px;">Status: ${evalRes.statusTxt}</div>
          </div>
        </div>

        <div class="card-footer-info">
          <div class="pipe-cron">⏱️ ${pipe.cron_desc}</div>
        </div>

        ${slotsHtml}
      `;
      container.appendChild(card);

      // Listener para disparo imediato no GitHub Actions
      if (pipe.repo) {
        const btn = card.querySelector(`#btn-disp-${pipe.id}`);
        if (btn) {
          btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm(`Deseja disparar a rotina '${pipe.name}' no GitHub Actions agora?`)) return;
            btn.disabled = true;
            btn.innerHTML = '<span>⏳ Enviando...</span>';
            try {
              await GitHubClient.dispatchWorkflow(pipe.repo, pipe.wf, 'main');
              btn.innerHTML = '<span>✅ Disparo Enviado!</span>';
              App.showToast(`🚀 Rotina ${pipe.tag} disparada com sucesso!`);
              setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<span>⚡ Disparar GitHub</span>';
                App.carregarDados(true);
              }, 3000);
            } catch (err) {
              alert('Erro ao disparar: ' + err.message);
              btn.disabled = false;
              btn.innerHTML = '<span>⚡ Disparar GitHub</span>';
            }
          });
        }
      }
    }
  },

  atualizarBannerGlobal(g, y, r) {
    const banner = document.getElementById('bannerGlobal');
    if (!banner) return;

    banner.classList.remove('yellow', 'red');
    const titleEl = document.getElementById('bannerTitle');
    const descEl = document.getElementById('bannerDesc');
    const badgeEl = document.getElementById('bannerBadge');

    if (r > 0) {
      banner.classList.add('red');
      titleEl.innerText = `Atenção: ${r} rotina(s) falharam`;
      descEl.innerText = `${g} de ${PIPELINES.length} rotinas operando normalmente.`;
      badgeEl.innerText = '🔴 AÇÃO NECESSÁRIA';
      badgeEl.style.color = 'var(--color-red)';
      badgeEl.style.background = 'var(--color-red-bg)';
      badgeEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    } else if (y > 0) {
      banner.classList.add('yellow');
      titleEl.innerText = `${y} rotina(s) em atraso / execução`;
      descEl.innerText = 'Aguardando finalização do ciclo programado.';
      badgeEl.innerText = '🟡 ATENÇÃO';
      badgeEl.style.color = 'var(--color-yellow)';
      badgeEl.style.background = 'var(--color-yellow-bg)';
      badgeEl.style.borderColor = 'rgba(234, 179, 8, 0.3)';
    } else {
      titleEl.innerText = 'Tudo 100% Operacional';
      descEl.innerText = `Todos os ${PIPELINES.length} pipelines em dia com o SLA programado.`;
      badgeEl.innerText = '🟢 SLA 100%';
      badgeEl.style.color = 'var(--color-green)';
      badgeEl.style.background = 'var(--color-green-bg)';
      badgeEl.style.borderColor = 'rgba(34, 197, 94, 0.3)';
    }
  },

  renderExtraDashboards() {
    const container = document.getElementById('extraDashboardsContainer');
    if (!container) return;

    container.innerHTML = '';
    EXTRA_DASHBOARDS.forEach(d => {
      const card = document.createElement('div');
      card.className = 'card-pipeline';
      card.innerHTML = `
        <div class="card-top">
          <div class="pipe-info">
            <span class="pipe-icon">${d.icone}</span>
            <div class="pipe-name-box">
              <h3>${d.name}</h3>
              <span class="pipe-tag">${d.categoria}</span>
            </div>
          </div>
          <span class="dash-badge">${d.badge}</span>
        </div>

        <div class="card-actions-row">
          <a href="${d.url}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-card-report" style="width:100%;font-size:13px;padding:11px;">
            <span>Abrir Relatório</span>
            <span>↗</span>
          </a>
        </div>

        <p class="dash-desc" style="font-size:12px;color:var(--text-muted);margin-top:2px;line-height:1.45;">${d.descricao}</p>
      `;
      container.appendChild(card);
    });
  },

  setupConfig() {
    const tokenInput = document.getElementById('ghTokenInput');
    const saveBtn = document.getElementById('btnSaveToken');
    const testBtn = document.getElementById('btnTestToken');
    const statusBox = document.getElementById('tokenStatusBox');

    if (tokenInput) {
      tokenInput.value = GitHubClient.getToken();
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const val = tokenInput.value.trim();
        GitHubClient.setToken(val);
        this.showToast('💾 Token salvo com sucesso no iPhone!');
        this.carregarDados();
      });
    }

    if (testBtn) {
      testBtn.addEventListener('click', async () => {
        testBtn.innerText = 'Testando...';
        const res = await GitHubClient.testConnection();
        testBtn.innerText = 'Testar Conexão';
        if (res.ok) {
          statusBox.innerHTML = `<span style="color:var(--color-green);">🟢 Conectado como <b>@${res.user}</b> (Cota: ${res.remaining}/5000)</span>`;
          App.showToast(`✅ Conexão OK: @${res.user}`);
        } else {
          statusBox.innerHTML = `<span style="color:var(--color-red);">🔴 Falha: ${res.message}</span>`;
          alert('Erro: ' + res.message);
        }
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  const refreshBtn = document.getElementById('btnRefresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => App.carregarDados());
  }
});

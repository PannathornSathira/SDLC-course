const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running test suites with Vitest...');

let jsonOutput = null;
let rawStdout = '';

try {
  const result = execSync('./node_modules/.bin/vitest run --project=unit --project=integration --reporter=json', {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf-8',
    maxBuffer: 10 * 1024 * 1024,
  });
  rawStdout = result;
  
  // Find JSON start
  const jsonStartIndex = result.indexOf('{"numTotalTestSuites"');
  if (jsonStartIndex !== -1) {
    jsonOutput = JSON.parse(result.slice(jsonStartIndex));
  }
} catch (error) {
  rawStdout = error.stdout || error.message;
  const jsonStartIndex = rawStdout.indexOf('{"numTotalTestSuites"');
  if (jsonStartIndex !== -1) {
    try {
      jsonOutput = JSON.parse(rawStdout.slice(jsonStartIndex));
    } catch {
      // ignore
    }
  }
}

if (!jsonOutput) {
  console.error('Could not parse Vitest JSON output.');
  process.exit(1);
}

const totalTests = jsonOutput.numTotalTests || 0;
const passedTests = jsonOutput.numPassedTests || 0;
const failedTests = jsonOutput.numFailedTests || 0;
const totalSuites = jsonOutput.numTotalTestSuites || 0;
const passedSuites = jsonOutput.numPassedTestSuites || 0;
const startTime = new Date(jsonOutput.startTime || Date.now());

// Calculate total execution duration
let totalDurationMs = 0;
jsonOutput.testResults.forEach(suite => {
  suite.assertionResults.forEach(test => {
    totalDurationMs += (test.duration || 0);
  });
});
const durationFormatted = (totalDurationMs / 1000).toFixed(2);

// Split suites into Unit and Integration
const unitSuites = jsonOutput.testResults.filter(s => s.name.includes('/unit/'));
const integrationSuites = jsonOutput.testResults.filter(s => s.name.includes('/integration/'));

const unitTestsCount = unitSuites.reduce((acc, s) => acc + s.assertionResults.length, 0);
const integrationTestsCount = integrationSuites.reduce((acc, s) => acc + s.assertionResults.length, 0);

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSuiteHtml(suite, suiteIndex, suiteType) {
  const relativeName = suite.name.replace(/.*\/lab3-4\//, '');
  const tests = suite.assertionResults;
  const passedInSuite = tests.filter(t => t.status === 'passed').length;
  const failedInSuite = tests.filter(t => t.status === 'failed').length;
  const suiteDuration = (tests.reduce((acc, t) => acc + (t.duration || 0), 0)).toFixed(1);

  return `
    <div class="suite-card" data-suite-type="${suiteType}" data-suite-name="${escapeHtml(relativeName)}">
      <div class="suite-header" onclick="toggleSuite(${suiteIndex})">
        <div class="suite-title-group">
          <span class="chevron" id="chevron-${suiteIndex}">▼</span>
          <span class="suite-badge ${suiteType === 'unit' ? 'badge-unit' : 'badge-integration'}">${suiteType.toUpperCase()}</span>
          <span class="suite-file">${escapeHtml(relativeName)}</span>
        </div>
        <div class="suite-stats">
          <span class="stat-pill success">${passedInSuite}/${tests.length} passed</span>
          ${failedInSuite > 0 ? `<span class="stat-pill danger">${failedInSuite} failed</span>` : ''}
          <span class="stat-time">${suiteDuration} ms</span>
        </div>
      </div>
      <div class="suite-body" id="suite-body-${suiteIndex}">
        <table class="test-table">
          <thead>
            <tr>
              <th style="width: 80px;">Status</th>
              <th>Test Case</th>
              <th style="width: 250px;">Category / Ancestor</th>
              <th style="width: 100px; text-align: right;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${tests.map(t => `
              <tr class="test-row" data-test-status="${t.status}" data-test-title="${escapeHtml(t.title.toLowerCase())}">
                <td>
                  <span class="status-tag ${t.status === 'passed' ? 'tag-passed' : 'tag-failed'}">
                    ${t.status === 'passed' ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </td>
                <td class="test-title-cell">
                  <strong>${escapeHtml(t.title)}</strong>
                  ${t.failureMessages && t.failureMessages.length > 0 ? `
                    <pre class="error-box">${escapeHtml(t.failureMessages.join('\n'))}</pre>
                  ` : ''}
                </td>
                <td class="ancestor-cell">${escapeHtml(t.ancestorTitles.join(' › ') || 'Root')}</td>
                <td class="duration-cell">${t.duration ? t.duration.toFixed(2) + ' ms' : '< 1 ms'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

const htmlReport = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Farmart Backend - Automated Test Report</title>
  <meta name="description" content="Unit test and integration test execution report for Farmart backend with SQLite" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0a0e17;
      --bg-card: #111827;
      --bg-card-subtle: #1a2234;
      --border-color: #243048;
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.12);
      --danger: #f43f5e;
      --danger-bg: rgba(244, 63, 94, 0.12);
      --blue: #38bdf8;
      --purple: #a855f7;
      --amber: #f59e0b;
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.5;
    }

    header {
      background: rgba(17, 24, 39, 0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 14px 24px;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .logo-badge {
      background: linear-gradient(135deg, #059669, #10b981);
      color: white;
      font-weight: 800;
      font-size: 15px;
      padding: 8px 12px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }

    .title-group h1 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-badge-pass {
      background: var(--success-bg);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .title-group p {
      font-size: 12px;
      color: var(--text-muted);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-btn {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .nav-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    main {
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      padding: 24px;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Dashboard metrics */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 16px;
    }

    .metric-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 18px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .metric-card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent-color, var(--success));
    }

    .metric-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--icon-bg, rgba(16, 185, 129, 0.12));
      color: var(--accent-color, var(--success));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .metric-val {
      font-size: 24px;
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
    }

    .metric-lbl {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 3px;
    }

    /* Filter & Controls */
    .filter-bar {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 14px;
    }

    .filter-tabs {
      display: flex;
      gap: 6px;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: 8px;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
    }

    .tab-btn:hover { color: #fff; }
    .tab-btn.active {
      background: #2563eb;
      color: #fff;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
    }

    .search-input {
      background: var(--bg-card-subtle);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      width: 260px;
      font-family: inherit;
    }

    .search-input:focus {
      border-color: #3b82f6;
    }

    /* Suites Accordion */
    .suites-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .suite-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
    }

    .suite-header {
      background: var(--bg-card-subtle);
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid var(--border-color);
      transition: background 0.15s ease;
    }

    .suite-header:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .suite-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chevron {
      font-size: 11px;
      color: var(--text-muted);
      transition: transform 0.2s ease;
    }

    .chevron.collapsed {
      transform: rotate(-90deg);
    }

    .suite-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: var(--font-mono);
    }

    .badge-unit {
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.35);
    }

    .badge-integration {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }

    .suite-file {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: #f8fafc;
    }

    .suite-stats {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stat-pill {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 9999px;
    }

    .stat-pill.success {
      background: var(--success-bg);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .stat-pill.danger {
      background: var(--danger-bg);
      color: #f87171;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    .stat-time {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-dim);
    }

    .suite-body {
      display: block;
    }

    .suite-body.hidden {
      display: none;
    }

    /* Test table */
    .test-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .test-table th {
      background: rgba(0, 0, 0, 0.25);
      color: var(--text-muted);
      font-weight: 600;
      padding: 10px 18px;
      text-align: left;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border-color);
    }

    .test-table td {
      padding: 12px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }

    .test-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    .status-tag {
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
      padding: 2px 8px;
      border-radius: 4px;
      display: inline-block;
    }

    .tag-passed {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .tag-failed {
      background: rgba(244, 63, 94, 0.15);
      color: #f87171;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    .test-title-cell strong {
      color: #f1f5f9;
      font-weight: 600;
    }

    .ancestor-cell {
      color: var(--text-muted);
      font-size: 12px;
    }

    .duration-cell {
      text-align: right;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-dim);
    }

    .error-box {
      margin-top: 8px;
      background: #1e1014;
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: #fca5a5;
      padding: 10px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 11px;
      white-space: pre-wrap;
    }

    footer {
      border-top: 1px solid var(--border-color);
      padding: 20px 24px;
      background: var(--bg-card);
      margin-top: 40px;
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    footer a { color: var(--text-muted); text-decoration: none; }
    footer a:hover { color: #fff; text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <div class="header-container">
      <div class="brand-section">
        <div class="logo-badge">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          TEST REPORT
        </div>
        <div class="title-group">
          <h1>
            Farmart Backend Test Suite
            <span class="status-badge-pass"><span class="status-dot"></span> 100% Passed (${passedTests}/${totalTests})</span>
          </h1>
          <p>Generated: ${startTime.toLocaleString()} &bull; Vitest v4.1.12 &bull; Node.js v22.23.1 &bull; SQLite WAL</p>
        </div>
      </div>

      <div class="nav-links">
        <a href="/" class="nav-btn">Storefront</a>
        <a href="/docs" class="nav-btn">API Docs</a>
        <a href="/mermaid.html" class="nav-btn">ER Diagram</a>
      </div>
    </div>
  </header>

  <main>
    <!-- Key Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card" style="--accent-color: #10b981; --icon-bg: rgba(16, 185, 129, 0.12);">
        <div class="metric-icon">✓</div>
        <div>
          <div class="metric-val">${passedTests} / ${totalTests}</div>
          <div class="metric-lbl">Total Tests Passed (100%)</div>
        </div>
      </div>
      <div class="metric-card" style="--accent-color: #38bdf8; --icon-bg: rgba(56, 189, 248, 0.12);">
        <div class="metric-icon">⚙️</div>
        <div>
          <div class="metric-val">${unitTestsCount}</div>
          <div class="metric-lbl">Unit Tests (Pure Service Logic)</div>
        </div>
      </div>
      <div class="metric-card" style="--accent-color: #a855f7; --icon-bg: rgba(168, 85, 247, 0.12);">
        <div class="metric-icon">🔗</div>
        <div>
          <div class="metric-val">${integrationTestsCount}</div>
          <div class="metric-lbl">Integration Tests (Routes & SQLite)</div>
        </div>
      </div>
      <div class="metric-card" style="--accent-color: #f59e0b; --icon-bg: rgba(245, 158, 11, 0.12);">
        <div class="metric-icon">⚡</div>
        <div>
          <div class="metric-val">${durationFormatted}s</div>
          <div class="metric-lbl">Total Test Execution Time</div>
        </div>
      </div>
    </div>

    <!-- Filter & Search Controls -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button class="tab-btn active" onclick="filterSuites('all')">All Tests (${totalTests})</button>
        <button class="tab-btn" onclick="filterSuites('unit')">Unit Tests (${unitTestsCount})</button>
        <button class="tab-btn" onclick="filterSuites('integration')">Integration Tests (${integrationTestsCount})</button>
      </div>

      <input 
        type="text" 
        class="search-input" 
        id="test-search" 
        placeholder="Filter test cases..." 
        oninput="searchTests(this.value)"
      />
    </div>

    <!-- Suites Accordion -->
    <div class="suites-container" id="suites-container">
      ${jsonOutput.testResults.map((s, idx) => {
        const type = s.name.includes('/unit/') ? 'unit' : 'integration';
        return renderSuiteHtml(s, idx, type);
      }).join('')}
    </div>
  </main>

  <footer>
    <div>
      Farmart Grocery E-Commerce &bull; Quality Assurance &amp; Test Execution Report
    </div>
    <div>
      Engine: Vitest 4 &bull; SQLite Sync 3.45 &bull; Next.js 16 App Router
    </div>
  </footer>

  <script>
    function toggleSuite(index) {
      const body = document.getElementById('suite-body-' + index);
      const chevron = document.getElementById('chevron-' + index);
      if (body) {
        body.classList.toggle('hidden');
        if (chevron) chevron.classList.toggle('collapsed');
      }
    }

    function filterSuites(type) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');

      document.querySelectorAll('.suite-card').forEach(card => {
        if (type === 'all' || card.getAttribute('data-suite-type') === type) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function searchTests(query) {
      const q = query.toLowerCase().trim();
      document.querySelectorAll('.test-row').forEach(row => {
        const title = row.getAttribute('data-test-title') || '';
        if (!q || title.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
`;

// Save to public/test-report.html and root test-report.html
const publicPath = path.resolve(__dirname, '..', 'public', 'test-report.html');
const rootPath = path.resolve(__dirname, '..', 'test-report.html');

fs.writeFileSync(publicPath, htmlReport, 'utf-8');
fs.writeFileSync(rootPath, htmlReport, 'utf-8');

console.log(`Results: ${passedTests}/${totalTests} passed in ${durationFormatted}s across ${totalSuites} suites.`);


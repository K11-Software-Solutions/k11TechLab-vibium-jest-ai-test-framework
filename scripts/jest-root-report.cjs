const fs = require('fs');
const path = require('path');

function formatTimestamp(value) {
  const date = new Date(value);
  const pad = (num) => String(num).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + '_' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('-');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'test-run';
}

function deriveRunName(results) {
  const suiteNames = results.testResults
    .map((suite) => path.basename(suite.testFilePath, path.extname(suite.testFilePath)))
    .filter(Boolean);

  if (suiteNames.length === 1) {
    return slugify(suiteNames[0]);
  }

  if (suiteNames.length > 1) {
    return slugify(`${suiteNames[0]}-and-${suiteNames.length - 1}-more`);
  }

  return 'test-run';
}

function buildHtmlReport(payload, timestamp) {
  const suiteRows = payload.testResults.map((suite) => {
    const tests = suite.assertionResults.map((test) => {
      const failures = test.failureMessages.length
        ? `<pre>${escapeHtml(test.failureMessages.join('\n\n'))}</pre>`
        : '';
      return `
        <tr>
          <td>${escapeHtml(test.ancestorTitles.join(' > ') || '(root)')}</td>
          <td>${escapeHtml(test.title)}</td>
          <td class="status ${escapeHtml(test.status)}">${escapeHtml(test.status)}</td>
          <td>${test.duration ?? ''}</td>
        </tr>
        ${failures ? `<tr><td colspan="4">${failures}</td></tr>` : ''}
      `;
    }).join('');

    return `
      <section class="suite">
        <h2>${escapeHtml(suite.testFilePath)}</h2>
        <p>Passed: ${suite.numPassingTests} | Failed: ${suite.numFailingTests} | Pending: ${suite.numPendingTests}</p>
        <table>
          <thead>
            <tr>
              <th>Suite</th>
              <th>Test</th>
              <th>Status</th>
              <th>Duration (ms)</th>
            </tr>
          </thead>
          <tbody>${tests}</tbody>
        </table>
      </section>
    `;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Jest Report ${escapeHtml(timestamp)}</title>
  <style>
    body { font-family: Segoe UI, Arial, sans-serif; margin: 24px; color: #1f2937; background: #f8fafc; }
    h1, h2 { margin-bottom: 8px; }
    .summary { background: white; border: 1px solid #dbe2ea; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
    .suite { background: white; border: 1px solid #dbe2ea; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; }
    .status.passed { color: #166534; font-weight: 600; }
    .status.failed { color: #991b1b; font-weight: 600; }
    .status.pending { color: #92400e; font-weight: 600; }
    pre { white-space: pre-wrap; margin: 0; font-family: Consolas, monospace; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Jest Test Report</h1>
  <div class="summary">
    <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
    <p><strong>Success:</strong> ${payload.success}</p>
    <p><strong>Suites:</strong> ${payload.numPassedTestSuites}/${payload.numTotalTestSuites} passed</p>
    <p><strong>Tests:</strong> ${payload.numPassedTests}/${payload.numTotalTests} passed, ${payload.numFailedTests} failed, ${payload.numPendingTests} pending</p>
  </div>
  ${suiteRows}
</body>
</html>`;
}

class RootReportWriter {
  onRunComplete(_, results) {
    const reportsDir = path.join(process.cwd(), 'reports');
    fs.mkdirSync(reportsDir, { recursive: true });
    const timestamp = formatTimestamp(results.startTime);
    const runName = deriveRunName(results);

    const payload = {
      success: results.numFailedTestSuites === 0 && results.numFailedTests === 0,
      startTime: results.startTime,
      timestamp,
      runName,
      numTotalTestSuites: results.numTotalTestSuites,
      numPassedTestSuites: results.numPassedTestSuites,
      numFailedTestSuites: results.numFailedTestSuites,
      numTotalTests: results.numTotalTests,
      numPassedTests: results.numPassedTests,
      numFailedTests: results.numFailedTests,
      numPendingTests: results.numPendingTests,
      testResults: results.testResults.map((suite) => ({
        testFilePath: suite.testFilePath,
        perfStats: suite.perfStats,
        numPassingTests: suite.numPassingTests,
        numFailingTests: suite.numFailingTests,
        numPendingTests: suite.numPendingTests,
        assertionResults: suite.testResults.map((test) => ({
          ancestorTitles: test.ancestorTitles,
          title: test.title,
          status: test.status,
          duration: test.duration,
          failureMessages: test.failureMessages,
        })),
      })),
    };

    fs.writeFileSync(
      path.join(reportsDir, 'jest-report.json'),
      JSON.stringify(payload, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(reportsDir, `jest-report-${runName}-${timestamp}.json`),
      JSON.stringify(payload, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(reportsDir, `jest-report-${runName}-${timestamp}.html`),
      buildHtmlReport(payload, timestamp),
      'utf8'
    );
  }
}

module.exports = RootReportWriter;

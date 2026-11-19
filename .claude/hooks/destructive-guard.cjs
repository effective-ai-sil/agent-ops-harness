// Stops destructive shell commands. A force push to a main branch is blocked outright;
// other destructive commands need a human to approve them.
const { readInput, block, confirm, allow } = require('./lib.cjs');

const BLOCK = [
  { re: /\bgit\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)[^\n]*\b(main|master)\b/, why: 'force push to a main branch' },
];

const CONFIRM = [
  { re: /\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r|-r\s+-f|-f\s+-r|--recursive)\b/, why: 'recursive delete' },
  { re: /\bgit\s+reset\s+--hard\b/, why: 'git reset --hard discards uncommitted work' },
  { re: /\bgit\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)/, why: 'force push rewrites remote history' },
  { re: /\bgit\s+branch\s+-D\b/, why: 'branch deletion' },
  { re: /\b(drop\s+table|truncate\s+table|truncate)\b/i, why: 'destructive SQL' },
  { re: /\bdelete\s+from\s+\w+\s*(;|$|")/i, why: 'DELETE without a WHERE clause' },
];

const input = readInput();
if (input.tool_name !== 'Bash') allow();
const cmd = String((input.tool_input || {}).command || '');

for (const r of BLOCK) if (r.re.test(cmd)) block(`${r.why}. Push to a branch and open a pull request instead.`);
for (const r of CONFIRM) if (r.re.test(cmd)) confirm(`Destructive command (${r.why}): ${cmd.slice(0, 200)}`);
allow();

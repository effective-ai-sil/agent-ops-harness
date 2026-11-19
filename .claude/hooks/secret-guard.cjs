// Keeps secrets out of the model's context: no reading .env or key files, and no environment dumps.
// Secrets should be fetched at run time by the script that needs them (e.g. from a password manager CLI),
// never read into the conversation.
const { readInput, block, allow } = require('./lib.cjs');

const SECRET_FILE = /(^|[\/\\])(\.env(\.[\w-]+)?|[\w-]*\.pem|id_(rsa|ed25519)|credentials\.json|[\w-]*\.p12)$/i;
const SAFE_TEMPLATE = /\.env\.(example|sample|template)$/i;

const input = readInput();
const t = input.tool_input || {};

if (['Read', 'Edit', 'Write', 'MultiEdit'].includes(input.tool_name)) {
  const p = String(t.file_path || '');
  if (SECRET_FILE.test(p) && !SAFE_TEMPLATE.test(p)) block(`secret file (${p}). Load it inside the script that needs it.`);
}

if (input.tool_name === 'Bash') {
  const cmd = String(t.command || '');
  const touchesSecretFile = cmd
    .split(/[\s;|&<>'"]+/)
    .some((tok) => SECRET_FILE.test(tok) && !SAFE_TEMPLATE.test(tok));
  if (touchesSecretFile && /\b(cat|less|more|head|tail|grep|sed|awk|cp|type)\b/.test(cmd)) block('reading a secret file from the shell.');
  if (/^\s*(env|printenv|set)\s*($|\|)/m.test(cmd)) block('environment dump. Print only the variable names you need.');
}

allow();

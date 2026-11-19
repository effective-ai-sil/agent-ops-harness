// Declarative rule engine: each rule in action-rules.json names a tool (regex), a pattern matched
// against the tool input, and a mode (block | confirm). Adding a guard = adding one JSON entry.
const fs = require('fs');
const path = require('path');
const { readInput, block, confirm, allow } = require('./lib.cjs');

function loadRules(file = path.join(__dirname, 'action-rules.json')) {
  return JSON.parse(fs.readFileSync(file, 'utf8')).rules;
}

function match(rules, toolName, toolInput) {
  const haystack = JSON.stringify(toolInput || {});
  return rules.find(
    (r) => new RegExp(`^(${r.tool})$`).test(toolName) && new RegExp(r.pattern, r.flags || 'i').test(haystack),
  );
}

if (require.main === module) {
  const input = readInput();
  const hit = match(loadRules(), String(input.tool_name || ''), input.tool_input);
  if (!hit) allow();
  const reason = `[${hit.id}] ${hit.message}`;
  hit.mode === 'block' ? block(reason) : confirm(reason);
}

module.exports = { loadRules, match };

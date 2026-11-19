// Every guard is tested in both directions: it must stop the bad case and let the normal case through.
const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const HOOKS = path.join(__dirname, '..', '.claude', 'hooks');

function run(hook, tool_name, tool_input) {
  const r = spawnSync('node', [path.join(HOOKS, hook)], { input: JSON.stringify({ tool_name, tool_input }), encoding: 'utf8' });
  if (r.status === 2) return { decision: 'block', msg: r.stderr };
  const out = r.stdout.trim() ? JSON.parse(r.stdout) : null;
  if (out && out.hookSpecificOutput && out.hookSpecificOutput.permissionDecision === 'ask') return { decision: 'confirm', msg: out.hookSpecificOutput.permissionDecisionReason };
  return { decision: 'allow' };
}

const bash = (hook, command) => run(hook, 'Bash', { command });

test('destructive-guard', () => {
  assert.equal(bash('destructive-guard.cjs', 'git push --force origin main').decision, 'block');
  assert.equal(bash('destructive-guard.cjs', 'git push -f origin feature-x').decision, 'confirm');
  assert.equal(bash('destructive-guard.cjs', 'rm -rf build/').decision, 'confirm');
  assert.equal(bash('destructive-guard.cjs', 'git reset --hard HEAD~1').decision, 'confirm');
  assert.equal(bash('destructive-guard.cjs', 'psql -c "DELETE FROM orders;"').decision, 'confirm');
  // normal work goes through
  assert.equal(bash('destructive-guard.cjs', 'rm notes.tmp').decision, 'allow');
  assert.equal(bash('destructive-guard.cjs', 'git push origin feature-x').decision, 'allow');
  assert.equal(bash('destructive-guard.cjs', 'psql -c "DELETE FROM orders WHERE id = 4;"').decision, 'allow');
});

test('secret-guard', () => {
  assert.equal(run('secret-guard.cjs', 'Read', { file_path: '/app/.env' }).decision, 'block');
  assert.equal(run('secret-guard.cjs', 'Read', { file_path: '/app/.env.production' }).decision, 'block');
  assert.equal(bash('secret-guard.cjs', 'cat .env.local').decision, 'block');
  assert.equal(bash('secret-guard.cjs', 'printenv').decision, 'block');
  // templates and normal files are fine
  assert.equal(run('secret-guard.cjs', 'Read', { file_path: '/app/.env.example' }).decision, 'allow');
  assert.equal(run('secret-guard.cjs', 'Read', { file_path: '/app/src/index.ts' }).decision, 'allow');
  assert.equal(bash('secret-guard.cjs', 'printenv NODE_ENV').decision, 'allow');
});

test('action-rules', () => {
  assert.equal(bash('action-rules.cjs', 'vercel deploy --prod').decision, 'confirm');
  assert.equal(bash('action-rules.cjs', 'npx supabase db push').decision, 'confirm');
  assert.equal(run('action-rules.cjs', 'mcp__gmail__send_message', { to: 'client@example.com' }).decision, 'block');
  assert.equal(run('action-rules.cjs', 'mcp__meta_ads__update_entity', { status: 'PAUSED' }).decision, 'confirm');
  // reads and drafts go through
  assert.equal(bash('action-rules.cjs', 'vercel deploy').decision, 'allow');
  assert.equal(run('action-rules.cjs', 'mcp__gmail__create_draft', { to: 'client@example.com' }).decision, 'allow');
  assert.equal(run('action-rules.cjs', 'mcp__meta_ads__get_insights', { fields: 'spend' }).decision, 'allow');
});

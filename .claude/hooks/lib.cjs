// Shared helpers for Claude Code PreToolUse hooks.
// Protocol: the hook gets the tool call as JSON on stdin.
//   exit 2 + message on stderr       -> the call is blocked and the reason goes back to the model
//   JSON permissionDecision "ask"    -> a human is asked to approve the call
//   exit 0 with no output            -> the call goes ahead
const fs = require('fs');

function readInput() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
  } catch {
    return {}; // unreadable input: allow rather than break the session
  }
}

function block(reason) {
  process.stderr.write(`BLOCKED: ${reason}\n`);
  process.exit(2);
}

function confirm(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

function allow() {
  process.exit(0);
}

module.exports = { readInput, block, confirm, allow };

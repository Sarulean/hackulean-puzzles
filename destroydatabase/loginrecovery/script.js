const SESSION_STATE_KEY = "destroy_database_session_state";
const SESSION_STATE_LOGGED_IN = "logged_in";
const GAME_STAGE_KEY = "destroy_database_game_stage";
const GAME_STAGE_RECOVERY = "recovery_access";

function getDailyRecoveryCode(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const seed = `${year}-${month}-${day}:destroydb`;

  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 131 + seed.charCodeAt(index)) % 2147483647;
  }

  const mixed = (hash ^ 0x5f3759df) >>> 0;
  const token = mixed.toString(36).toUpperCase().padStart(8, "0").slice(-8);
  return `SAFE-${token}`;
}

const form = document.getElementById("recovery-form");
const codeInput = document.getElementById("recovery-code");
const statusMessage = document.getElementById("status");

function showStatus(message, ok) {
  if (!statusMessage) {
    return;
  }

  statusMessage.textContent = message;
  statusMessage.classList.toggle("success", Boolean(ok));
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = (codeInput?.value || "").trim().toUpperCase();
  const expected = getDailyRecoveryCode(new Date());

  if (input !== expected) {
    showStatus("Code invalid for today. Check /destroydatabase/safetyunlock.", false);
    return;
  }

  try {
    window.localStorage.setItem(SESSION_STATE_KEY, SESSION_STATE_LOGGED_IN);
    window.localStorage.setItem(GAME_STAGE_KEY, GAME_STAGE_RECOVERY);
  } catch (_error) {
    // Continue even if storage is blocked.
  }

  showStatus("Recovery accepted. Redirecting...", true);
  window.setTimeout(() => {
    window.location.href = "../";
  }, 450);
});

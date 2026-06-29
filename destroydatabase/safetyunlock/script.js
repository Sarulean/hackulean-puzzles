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

const codeElement = document.getElementById("daily-code");
const dateElement = document.getElementById("daily-date");
const now = new Date();

if (codeElement) {
  codeElement.textContent = getDailyRecoveryCode(now);
}

if (dateElement) {
  dateElement.textContent = `UTC Date: ${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

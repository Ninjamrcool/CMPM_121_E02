export {};

type ShieldStatus = {
  currentCharge: number;
  maxCharge: number;
  missingCharge: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

const eventHandler = new EventTarget();
const maxShieldCharge: number = 10;

let shieldCharge = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function getShieldStatus(): ShieldStatus {
  return {
    currentCharge: shieldCharge,
    maxCharge: maxShieldCharge,
    missingCharge: maxShieldCharge - shieldCharge,
  };
}

function drawMeter(shieldStatus: ShieldStatus) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shieldStatus.maxCharge; i++) {
    ctx.fillStyle = i < shieldStatus.currentCharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(
    `${shieldStatus.currentCharge} / ${shieldStatus.maxCharge} shield`,
    12,
    100,
  );
  readout.textContent =
    `Shield charge: ${shieldStatus.currentCharge} / ${shieldStatus.maxCharge}`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(getShieldStatus());
}

function renderStats(shieldStatus: ShieldStatus) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${shieldStatus.currentCharge} · Missing charge: ${shieldStatus.missingCharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(maxShieldCharge, next));
  if (bounded === shieldCharge) return;
  shieldCharge = bounded;
  if (panel) updateStats();

  eventHandler.dispatchEvent(new Event("count-changed"));
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(shieldCharge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(shieldCharge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldStatus());
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};

eventHandler.addEventListener(
  "count-changed",
  () => drawMeter(getShieldStatus()),
);
drawMeter(getShieldStatus());

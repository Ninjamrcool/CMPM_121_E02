export {};

type ShiftResults = {
  production: number;
  consumption: number;
  balance: number;
};

type AllocationBar = {
  labelText: string;
  barColor: string;
  dataFunction: (shiftResults: ShiftResults) => number;
};

const allocationBarLabelColor: string = "#233e43";
const allocationBars: AllocationBar[] = [{
  labelText: "Production",
  barColor: "#27766b",
  dataFunction: (shiftResults: ShiftResults) => shiftResults.production,
}, {
  labelText: "Consumption",
  barColor: "#a44d23",
  dataFunction: (shiftResults: ShiftResults) => shiftResults.consumption,
}];

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let allocatedProducers = 2;

function calculateShiftResults(): ShiftResults {
  const production = allocatedProducers * 3;
  const consumption = 6;
  const balance = production - consumption;

  return { production: production, consumption: consumption, balance: balance };
}

function updateAllocationUI(shiftResults: ShiftResults) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < allocatedProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < allocatedProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${allocatedProducers} / 6`, 18, 76);

  for (const [index, allocationBar] of allocationBars.entries()) {
    ctx.fillStyle = allocationBarLabelColor;
    ctx.fillText(
      `${allocationBar.labelText}: ${allocationBar.dataFunction(shiftResults)}`,
      18,
      102 + (index * 52),
    );
    ctx.fillStyle = allocationBar.barColor;
    ctx.fillRect(
      18,
      110 + (index * 52),
      allocationBar.dataFunction(shiftResults) * 14,
      20,
    );
  }

  readout.textContent =
    `Assigned: ${allocatedProducers}/6 · Production: ${shiftResults.production} · Consumption: ${shiftResults.consumption} · Balance: ${
      shiftResults.balance > 0 ? "+" : ""
    }${shiftResults.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  allocatedProducers = Math.max(0, allocatedProducers - 1);
  updateAllocationUI(calculateShiftResults());
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  allocatedProducers = Math.min(6, allocatedProducers + 1);
  updateAllocationUI(calculateShiftResults());
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    allocatedProducers = 2;
    updateAllocationUI(calculateShiftResults());
  };

updateAllocationUI(calculateShiftResults());

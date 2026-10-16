export {};

interface Command {
  execute(): void;
}

const moveForward: Command = {
  execute() {
    x += movementDirections[direction].xOffset;
    y += movementDirections[direction].yOffset;

    clampPosition();
  },
};

const rotateRight: Command = {
  execute() {
    direction = (direction + 1) % movementDirections.length;
  },
};

type MovementDirection = {
  heading: string;
  xOffset: number;
  yOffset: number;
};

const movementDirections: MovementDirection[] = [
  {
    heading: "North",
    xOffset: 0,
    yOffset: -1,
  },
  {
    heading: "East",
    xOffset: 1,
    yOffset: 0,
  },
  {
    heading: "South",
    xOffset: 0,
    yOffset: 1,
  },
  {
    heading: "West",
    xOffset: -1,
    yOffset: 0,
  },
];

function clampPosition() {
  x = Math.max(0, Math.min(4, x));
  y = Math.max(0, Math.min(4, y));
}

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    movementDirections[direction].heading
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  moveForward.execute();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  rotateRight.execute();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();

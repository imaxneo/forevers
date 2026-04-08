"use client";

type StarLabel = {
  id: string;
  left: string;
  top: string;
  text: string;
  tone: string;
};

const STAR_COUNT = 120;
const LABEL_COUNT = 10;
const STAR_TONES = ["tone-sky", "tone-rose", "tone-gold", "tone-mint", "tone-violet", "tone-ice"];
const NAME_POOL_A = ["Ahmed", "Omar", "Youssef", "Khaled", "Adam", "Noah", "Ethan", "James", "Carlos", "Liam", "Ziad", "Karim"];
const NAME_POOL_B = ["Sara", "Lena", "Nour", "Mariam", "Jana", "Layla", "Emma", "Sofia", "Isla", "Maya", "Salma", "Dina"];

type RandomReservation = {
  id: string;
  name1: string;
  name2: string;
  grid_position: number;
};

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function generateRandomReservations(count: number): RandomReservation[] {
  const rand = mulberry32(20260407);
  const usedSquares = new Set<number>();
  const items: RandomReservation[] = [];

  for (let i = 0; i < count; i += 1) {
    const name1 = NAME_POOL_A[Math.floor(rand() * NAME_POOL_A.length)];
    const name2 = NAME_POOL_B[Math.floor(rand() * NAME_POOL_B.length)];

    let square = 1 + Math.floor(rand() * 9999);
    while (usedSquares.has(square)) square = ((square + 137) % 10000) || 1;
    usedSquares.add(square);

    items.push({
      id: `rand-${i + 1}`,
      name1,
      name2,
      grid_position: square
    });
  }

  return items;
}

function starCoord(index: number) {
  return {
    left: `${(index * 37) % 100}%`,
    top: `${(index * 29) % 100}%`
  };
}

function uniqueStarIndexesFromReservations(count: number) {
  const used = new Set<number>();
  const result: number[] = [];

  for (let i = 0; i < count; i += 1) {
    let idx = ((i * 17) + 9) % STAR_COUNT;
    while (used.has(idx)) idx = (idx + 7) % STAR_COUNT;
    used.add(idx);
    result.push(idx);
  }

  return result;
}

export function StarNameConstellation() {
  const randomReservations = generateRandomReservations(LABEL_COUNT);
  const itemCount = randomReservations.length;
  const starIndexes = uniqueStarIndexesFromReservations(itemCount);

  const labels: StarLabel[] = randomReservations.map((item, index) => {
    const coord = starCoord(starIndexes[index]);
    return {
      id: item.id,
      left: coord.left,
      top: coord.top,
      text: `${item.name1} + ${item.name2} | #${item.grid_position.toLocaleString()}`,
      tone: STAR_TONES[index % STAR_TONES.length]
    };
  });

  return (
    <div aria-hidden className="star-name-constellation">
      {labels.map((label) => (
        <div key={label.id} className={`star-name-item ${label.tone}`} style={{ left: label.left, top: label.top }}>
          <span className="star-claim-star" />
          <span className="star-claim-ring" />
          <span className="star-name-tag">{label.text}</span>
        </div>
      ))}
    </div>
  );
}

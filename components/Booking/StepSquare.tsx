import { StarCanvasPicker } from "@/components/Booking/StarCanvasPicker";
import { positionToRowCol } from "@/lib/utils";

export function StepSquare({
  position,
  takenPositions,
  onPick
}: {
  position: number;
  takenPositions: number[];
  onPick: (position: number) => void;
}) {
  const { row, col } = positionToRowCol(position);
  const takenSet = new Set(takenPositions);
  const isTaken = takenSet.has(position);
  const available = 10000 - takenPositions.length;

  return (
    <div className="booking-step-content space-y-4">
      <div className="booking-square-layout">
        <div className="booking-canvas-shell">
          <StarCanvasPicker takenPositions={takenPositions} selected={position} onPick={onPick} />
        </div>
      </div>

      <div className="booking-square-meta-row">
        <span>#{position.toLocaleString()}</span>
        <span>Row {row}</span>
        <span>Column {col}</span>
        <span>{available.toLocaleString()} available</span>
        <span className={isTaken ? "text-rose-200" : "text-emerald-200"}>
          {isTaken ? "Reserved" : "Available"}
        </span>
      </div>

      <label className="booking-input-group booking-square-input">
        <span>Or type a star number</span>
        <input
          type="number"
          min={1}
          max={10000}
          value={position}
          onChange={(e) => onPick(Number(e.target.value))}
          className="input-field"
        />
      </label>
    </div>
  );
}

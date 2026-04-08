import { pricing } from "@/lib/constants";
import { PlanType } from "@/lib/types";
import { cn } from "@/lib/utils";

const order: PlanType[] = ["featured", "vip", "basic"];

export function StepPlan({ value, onChange }: { value: PlanType; onChange: (plan: PlanType) => void }) {
  return (
    <div className="booking-step-content space-y-5">
      <div>
        <p className="booking-step-kicker">Step 3</p>
        <h2 className="booking-step-title">Choose your plan</h2>
        <p className="booking-step-copy">Simple pricing with clear visibility options.</p>
      </div>

      <div className="booking-plan-list">
        {order.map((plan) => {
          const config = pricing[plan];
          const active = value === plan;

          return (
            <button
              key={plan}
              type="button"
              onClick={() => onChange(plan)}
              className={cn("booking-plan-row", active && "is-active")}
            >
              <div>
                <p className="booking-plan-name">{config.label}</p>
                <p className="booking-plan-tagline">{config.tagline}</p>
              </div>
              <p className="booking-plan-price">
                ${config.amount}
                <span>{config.cadence}</span>
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

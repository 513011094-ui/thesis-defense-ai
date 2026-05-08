import { MENTORS, MENTOR_ORDER, MENTOR_LABELS, MENTOR_AVATARS, MENTOR_INITIALS } from "@/types/mentor";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

interface OpeningCeremonyProps {
  onStart: () => void;
  thesisTitle?: string;
}

export default function OpeningCeremony({ onStart, thesisTitle }: OpeningCeremonyProps) {
  return (
    <div className="glass-card p-8 mb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--lp-text-strong)" }}>
          答辩委员会已就位
        </h2>
        {thesisTitle && (
          <p className="text-sm" style={{ color: "var(--lp-text-muted)" }}>论文：《{thesisTitle}》</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {MENTOR_ORDER.map((role) => {
          const m = MENTORS[role];
          return (
            <div
              key={role}
              className="text-center p-4 rounded-xl"
              style={{ background: "var(--lp-surface-hover)", border: "1px solid var(--lp-border-divider)" }}
            >
              <Avatar
                src={MENTOR_AVATARS[role]}
                fallback={MENTOR_INITIALS[role]}
                size="lg"
                className="mx-auto mb-3"
              />
              <p className="font-medium text-sm" style={{ color: "var(--lp-text-strong)" }}>{m.name}{m.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--lp-text-subtle)" }}>{MENTOR_LABELS[role]}</p>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-xl p-4 mb-6 text-sm space-y-1.5"
        style={{ background: "rgba(25, 25, 25, 0.03)", color: "var(--lp-text-muted)" }}
      >
        <p>本次答辩共 <span className="font-medium" style={{ color: "var(--lp-text-strong)" }}>5个问题</span>，预计 <span className="font-medium" style={{ color: "var(--lp-text-strong)" }}>5-8分钟</span></p>
        <p>提问将由浅入深，循序渐进</p>
        <p>请结合论文内容，给出具体、有条理的回答</p>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onStart} className="px-16">
          开始答辩
        </Button>
      </div>
    </div>
  );
}

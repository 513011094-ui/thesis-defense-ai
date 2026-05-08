import Avatar from "@/components/ui/Avatar";
import type { MentorRole } from "@/types/mentor";
import { MENTOR_LABELS, MENTORS, MENTOR_AVATARS, MENTOR_INITIALS } from "@/types/mentor";

interface MentorMessageProps {
  role: MentorRole;
  content: string;
  isStreaming?: boolean;
}

export default function MentorMessage({ role, content, isStreaming }: MentorMessageProps) {
  const mentor = MENTORS[role];

  return (
    <div className="flex gap-3 mb-4">
      <Avatar
        src={MENTOR_AVATARS[role]}
        fallback={MENTOR_INITIALS[role]}
        size="md"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm" style={{ color: "var(--lp-text-strong)" }}>
            {mentor.name}{mentor.title}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--lp-surface-hover)", color: "var(--lp-text-subtle)" }}
          >
            {MENTOR_LABELS[role]}
          </span>
        </div>
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 leading-relaxed"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid var(--lp-border-divider)",
            color: "var(--lp-text-primary)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-0.5 animate-pulse rounded-sm" style={{ background: "var(--lp-text-strong)" }} />
          )}
        </div>
      </div>
    </div>
  );
}

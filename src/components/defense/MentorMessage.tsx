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
          <span className="font-medium text-gray-900 text-sm">
            {mentor.name}{mentor.title}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {MENTOR_LABELS[role]}
          </span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-gray-800 leading-relaxed shadow-sm">
          {content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
      </div>
    </div>
  );
}

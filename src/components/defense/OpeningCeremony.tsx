import { MENTORS, MENTOR_ORDER, MENTOR_LABELS, MENTOR_AVATARS, MENTOR_INITIALS } from "@/types/mentor";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";

interface OpeningCeremonyProps {
  onStart: () => void;
  thesisTitle?: string;
}

export default function OpeningCeremony({ onStart, thesisTitle }: OpeningCeremonyProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          答辩委员会已就位
        </h2>
        {thesisTitle && (
          <p className="text-gray-500 text-sm">论文：《{thesisTitle}》</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {MENTOR_ORDER.map((role) => {
          const m = MENTORS[role];
          return (
            <div key={role} className="text-center p-4 rounded-xl bg-gray-50 border border-gray-100">
              <Avatar
                src={MENTOR_AVATARS[role]}
                fallback={MENTOR_INITIALS[role]}
                size="lg"
                className="mx-auto mb-3"
              />
              <p className="font-medium text-gray-900 text-sm">{m.name}{m.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{MENTOR_LABELS[role]}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1.5">
        <p>本次答辩共 <span className="font-medium text-gray-900">5个问题</span>，预计 <span className="font-medium text-gray-900">5-8分钟</span></p>
        <p>提问将由浅入深，循序渐进</p>
        <p>请结合论文内容，给出具体、有条理的回答</p>
      </div>

      <div className="text-center">
        <Button size="lg" onClick={onStart} className="px-16 shadow-md">
          开始答辩
        </Button>
      </div>
    </div>
  );
}

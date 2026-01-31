import { Circle, Clock, Check } from 'lucide-react';

interface TimelineEvent {
    status: string;
    timestamp: string;
}

interface ComplaintTimelineProps {
    events: TimelineEvent[];
    currentStatus: string;
}

const STEPS = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];

export function ComplaintTimeline({ events, currentStatus }: ComplaintTimelineProps) {
    // Helper to find the timestamp for a specific step if it exists in history
    const getEventForStep = (step: string) => {
        // Find the *latest* event matching this status (in case of status flapping)
        // or just find the first one? Usually the first one is the "start" of that status.
        // Let's reverse find to get the latest.
        return [...events].reverse().find(e => e.status === step);
    };

    const currentStepIndex = STEPS.indexOf(currentStatus);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit">
            <h3 className="font-semibold text-slate-900 mb-6">Status Timeline</h3>

            <div className="relative">
                {/* Vertical Line Background */}
                <div className="absolute left-3.5 top-2 bottom-4 w-0.5 bg-slate-100" />

                <div className="space-y-8">
                    {STEPS.map((step, index) => {
                        const event = getEventForStep(step);
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step} className="relative flex gap-4">
                                {/* Icon/Indicator */}
                                <div
                                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${isCompleted
                                        ? 'bg-green-50 border-green-500 text-green-600'
                                        : isCurrent
                                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-slate-200 text-slate-300'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" />
                                    ) : isCurrent ? (
                                        <Clock className="w-4 h-4 animate-pulse" />
                                    ) : (
                                        <Circle className="w-3 h-3 fill-current" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-0.5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className={`font-medium text-sm ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                                                }`}>
                                                {step}
                                            </p>
                                            {event && (
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {new Date(event.timestamp).toLocaleString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

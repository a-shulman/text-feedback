export type FeedbackMetrika = {
    counterId: number;
    goals?: {
        button?: string;
        submit?: string;
        cancel?: string;
    };
};

export type FeedbackOptions = {
    customFormEndpoint?: string;
    metrika?: FeedbackMetrika;
    privacyPolicyUrl?: string;
};

export const DEFAULT_GOALS = {
    button: 'selection-feedback-button',
    submit: 'selection-submit',
    cancel: 'selection-cancel',
} as const;

/**
 * Returns an inline onclick attribute value that calls ym() in the global scope.
 * Using onclick instead of an addEventListener avoids the "class constructors must be
 * invoked with 'new'" error that occurs when ym is called from inside a strict-mode IIFE.
 */
export function buildYmGoalCall(
    metrika: FeedbackMetrika | undefined,
    key: keyof typeof DEFAULT_GOALS,
): string {
    if (!metrika?.counterId) return '';
    const goal = metrika.goals?.[key] ?? DEFAULT_GOALS[key];
    return `ym(${metrika.counterId},'reachGoal','${goal}')`;
}

export async function sendData<T extends object>(endpoint: string, payload: T): Promise<Response> {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response;
}

export function sanitizeInput(text: unknown): string {
    if (typeof text !== 'string') return '';

    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .substring(0, 5000);
}

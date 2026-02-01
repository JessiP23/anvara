export type ActionState = {
    success?: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
    values?: Record<string, string>;
}

export const initialActionState: ActionState = {};
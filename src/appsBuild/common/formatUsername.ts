export const formatAppUsername = (value: string | undefined | null) => {
    if (!value) return "";
    const withAt = value.startsWith("@") ? value : `@${value}`;
    return withAt.endsWith(".app") ? withAt : `${withAt}.app`;
};

export const formatOwnerUsername = (value: string | undefined | null) => {
    if (!value) return "";
    return value.startsWith("@") ? value : `@${value}`;
};

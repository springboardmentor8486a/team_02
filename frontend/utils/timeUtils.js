// src/utils/timeUtils.js
// Exports getRelativeTime and getUserInitials for use in multiple components

export const getRelativeTime = (isoDateString) => {
    const reportDate = new Date(isoDateString);
    const today = new Date();

    // Start of today and report day
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfReportDay = new Date(reportDate.getFullYear(), reportDate.getMonth(), reportDate.getDate());

    const diffTime = startOfToday.getTime() - startOfReportDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60));
        if (diffHours < 1) return 'Just now';
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;

    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
};

// Also export the reusable initials getter
export const getUserInitials = (name) => {
    if (!name) return 'JD';
    
    const cleanedName = name.replace(/[^a-zA-Z\s]/g, '').trim();
    const nameParts = cleanedName.split(/\s+/).filter(Boolean);

    if (nameParts.length === 0) return 'JD';

    const firstInitial = nameParts[0][0];
    const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : '';

    return (firstInitial + lastInitial).toUpperCase();
};

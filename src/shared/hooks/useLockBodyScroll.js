import { useEffect } from 'react';

function useLockBodyScroll() {
    useEffect(() => {
        const scrollTarget = document.querySelector('.admin-content') || document.body;
        const original = scrollTarget.style.overflow;
        scrollTarget.style.overflow = 'hidden';
        return () => {
            scrollTarget.style.overflow = original;
        };
    }, []);
}

export default useLockBodyScroll;

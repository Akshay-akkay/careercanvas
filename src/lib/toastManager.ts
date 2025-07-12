import toast from 'react-hot-toast';

const MAX_INDIVIDUAL_TOASTS = 3;
let activeIndividualToasts = 0;
let collectiveToast: { id: string; count: number; timer: NodeJS.Timeout; type: 'loading' | 'success' | 'error' } | null = null;

const resetCollectiveToast = () => {
    collectiveToast = null;
};

const decrementIndividual = () => {
    if (activeIndividualToasts > 0) {
        activeIndividualToasts--;
    }
};

const show = (message: string, type: 'success' | 'error' = 'success', duration: number = 4000) => {
    // If a collective toast is active and not loading, we can add to it.
    if (collectiveToast && collectiveToast.type !== 'loading') {
        clearTimeout(collectiveToast.timer);
        collectiveToast.count++;
        collectiveToast.type = type;
        toast[type](`${collectiveToast.count} new updates.`, {
            id: collectiveToast.id,
            duration,
        });
        collectiveToast.timer = setTimeout(resetCollectiveToast, duration);
        return;
    }

    // If we have reached the limit, start a new collective toast.
    if (activeIndividualToasts >= MAX_INDIVIDUAL_TOASTS) {
        const id = 'collective-toast'; // Use a fixed ID for the collective toast
        toast[type]('1 new update.', { id, duration });
        const timer = setTimeout(resetCollectiveToast, duration);
        collectiveToast = { id, count: 1, timer, type };
        return;
    }

    // Otherwise, show an individual toast.
    activeIndividualToasts++;
    toast[type](message, { duration });
    setTimeout(decrementIndividual, duration);
};

const promise = <T>(
    p: Promise<T>,
    messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: any) => string);
    }
): Promise<T> => {
    let toastId: string | undefined;

    // If a collective toast is already running, join it.
    if (collectiveToast) {
        clearTimeout(collectiveToast.timer);
        collectiveToast.count++;
        collectiveToast.type = 'loading';
        toastId = collectiveToast.id;
        toast.loading(`Processing ${collectiveToast.count} items...`, { id: toastId });
    } 
    // If we've hit the limit, start a new collective toast.
    else if (activeIndividualToasts >= MAX_INDIVIDUAL_TOASTS) {
        toastId = 'collective-toast';
        const timer = setTimeout(resetCollectiveToast, 60000); // Long timeout for loading state
        collectiveToast = { id: toastId, count: 1, timer, type: 'loading' };
        toast.loading('Processing 1 item...', { id: toastId });
    } 
    // Otherwise, show an individual toast.
    else {
        activeIndividualToasts++;
        toastId = toast.loading(messages.loading);
    }

    p.then((data) => {
        const successMsg = typeof messages.success === 'function' ? messages.success(data) : messages.success;
        if (collectiveToast && toastId === collectiveToast.id) {
            collectiveToast.type = 'success';
            toast.success(`Processed ${collectiveToast.count} items successfully.`, { id: toastId, duration: 4000 });
            collectiveToast.timer = setTimeout(resetCollectiveToast, 4000);
        } else {
            toast.success(successMsg, { id: toastId });
            setTimeout(decrementIndividual, 4000);
        }
    }).catch((err) => {
        const errorMsg = typeof messages.error === 'function' ? messages.error(err) : messages.error;
        if (collectiveToast && toastId === collectiveToast.id) {
            collectiveToast.type = 'error';
            toast.error('An error occurred while processing items.', { id: toastId, duration: 4000 });
            collectiveToast.timer = setTimeout(resetCollectiveToast, 4000);
        } else {
            toast.error(errorMsg, { id: toastId });
            setTimeout(decrementIndividual, 4000);
        }
    });

    return p;
};

export const managedToast = { show, promise };

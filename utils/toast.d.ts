export interface ToastOptions {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
export declare class Toast {
    private static container;
    private static toastCount;
    static init(): void;
    static show(options: ToastOptions): void;
    static remove(toastId: string): void;
    static success(message: string, options?: Partial<ToastOptions>): void;
    static error(message: string, options?: Partial<ToastOptions>): void;
    static warning(message: string, options?: Partial<ToastOptions>): void;
    static info(message: string, options?: Partial<ToastOptions>): void;
}
//# sourceMappingURL=toast.d.ts.map
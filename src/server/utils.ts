/**  Utility function to validate email format */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Helper function to retry a function a given number of times with a delay between retries.
 * @param fn The function to retry
 * @param retries The number of retry attempts
 * @param delay The delay between retries in milliseconds
 */
export const retry = async <T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T | null> => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;
            console.error(`Attempt ${attempt} failed, retrying...`);
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, delay)); // wait for the delay before retrying
            }
        }
    }
    return null; // Return null if all retries fail
};
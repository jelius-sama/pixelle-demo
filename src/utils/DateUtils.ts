export class DateUtils {
    /**
     * Converts a JavaScript Date object to SQLite TEXT format (YYYY-MM-DD HH:MM:SS).
     * @param date - The Date object to convert.
     * @returns A string in the format YYYY-MM-DD HH:MM:SS.
     */
    static toSQLiteFormat(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    /**
     * Converts a SQLite TEXT format (YYYY-MM-DD HH:MM:SS) to a JavaScript Date object.
     * @param sqliteDate - A string in the format YYYY-MM-DD HH:MM:SS.
     * @returns A Date object.
     */
    static fromSQLiteFormat(sqliteDate: string): Date {
        return new Date(sqliteDate.replace(' ', 'T'));
    }

    /**
     * Converts a JavaScript Date object to a Unix timestamp (seconds since the epoch).
     * @param date - The Date object to convert.
     * @returns A Unix timestamp.
     */
    static toUnixTimestamp(date: Date): number {
        return Math.floor(date.getTime() / 1000);
    }

    /**
     * Converts a Unix timestamp to a JavaScript Date object.
     * @param unixTimestamp - A Unix timestamp.
     * @returns A Date object.
     */
    static fromUnixTimestamp(unixTimestamp: number): Date {
        return new Date(unixTimestamp * 1000);
    }

    /**
     * Converts a JavaScript Date object to the user's local date and time string.
     * @param date - The Date object to convert.
     * @param locale - Optional locale string (e.g., 'en-US'). Defaults to user's locale.
     * @param options - Optional Intl.DateTimeFormat options for customization.
     * @returns A string representing the date and time in the user's local format.
     */
    static toLocalDateTimeString(
        date: Date,
        locale: string = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
        options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }
    ): string {
        return date.toLocaleString(locale, options);
    }

    /**
     * Converts a SQLite TEXT format date (YYYY-MM-DD HH:MM:SS) to the user's local date and time string.
     * @param sqliteDate - A string in the format YYYY-MM-DD HH:MM:SS.
     * @param locale - Optional locale string (e.g., 'en-US'). Defaults to user's locale.
     * @param options - Optional Intl.DateTimeFormat options for customization.
     * @returns A string representing the date and time in the user's local format.
     */
    static sqliteToLocalDateTimeString(
        sqliteDate: string,
        locale: string = typeof navigator !== 'undefined' ? navigator.language : 'en-US',
        options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }
    ): string {
        const date = this.fromSQLiteFormat(sqliteDate);
        return date.toLocaleString(locale, options);
    }
}

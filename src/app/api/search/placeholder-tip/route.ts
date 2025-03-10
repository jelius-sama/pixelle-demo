import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

export const dynamic = "force-dynamic";

type ValidDayInInt = 1 | 2 | 3 | 4 | 5 | 6 | 0;
type ValidDayInString = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export async function GET() {
    const getDay = (day: ValidDayInInt): ValidDayInString => {
        switch (day) {
            case 0: return "Sunday";
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            default: throw new Error("Invalid day number");
        }
    };

    try {
        const now = new Date();
        const redis = new Redis({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });

        // Get current day (1 = Monday, 0 = Sunday)
        const day: ValidDayInString = getDay(now.getDay() as ValidDayInInt);
        const dataType = await redis.type(day);

        if (dataType !== 'list') {
            return NextResponse.json({ error: 'The data in Redis is not in the expected format' }, { status: 500 });
        }

        const items: string[] = await redis.lrange(day, 0, -1);

        if (!items || items.length <= 0) {
            return NextResponse.json({ error: "Key not found!" }, { status: 404 });
        }

        // Get current time in minutes since midnight
        const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

        // Calculate interval per item in minutes
        const totalItems = items.length;
        const intervalMinutes = Math.floor(1440 / totalItems); // 1440 = minutes in a day

        // Determine the current index
        const currentIndex = Math.floor(minutesSinceMidnight / intervalMinutes) % totalItems;

        return NextResponse.json({ tip: items[currentIndex] }, { status: 200 });
    } catch (error) {
        console.error("Something went wrong when trying to GET search placeholder: ", error);
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
    }
}
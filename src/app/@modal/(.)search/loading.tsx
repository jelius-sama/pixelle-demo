import ActivityIndicator from '@/components/ui/activity-indicator';
import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <Card className="w-full max-w-[512px] h-full max-h-[124px] bg-background text-foreground">
                <CardContent className='flex w-full flex-col h-full pt-6'>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">Search</h2>
                    <div className='flex flex-row w-full h-full items-center justify-center'>
                        <ActivityIndicator />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

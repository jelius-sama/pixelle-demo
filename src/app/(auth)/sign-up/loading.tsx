import ActivityIndicator from '@/components/ui/activity-indicator';

export default function Loading() {
    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <ActivityIndicator
                size={80}
            />
        </div>
    );
}

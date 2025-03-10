import { title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <MarginedContent>
            <div className="flex items-center justify-center flex-col flex-nowrap gap-y-4 pb-4">
                <Skeleton
                    className="rounded-md aspect-[10/4] md:aspect-[10/3] lg:aspect-[10/2] w-full object-cover"
                />

                <div className="w-full flex flex-row flex-nowrap items-center justify-start gap-x-2">
                    <Skeleton
                        className="rounded-full w-[30%] h-[30%] max-w-[200px] max-h-[200px] object-cover aspect-square"
                    />

                    <span className={title({ size: "sm", fullWidth: true })}>
                        <Skeleton className='w-[150px] lg:w-[200px] h-9 lg:h-10' />
                    </span>
                </div>
            </div>
        </MarginedContent>
    );
}

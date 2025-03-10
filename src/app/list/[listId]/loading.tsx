import { DetailedArtCardSkeleton } from '@/components/layout/detailed-art-card';
import MarginedContent from '@/components/ui/margined-content';

export default function Loading() {
    return (
        <MarginedContent>
            <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] place-items-center gap-2">
                {Array.from({ length: 30 }).map((_, index) => (
                    <DetailedArtCardSkeleton key={index} />
                ))}
            </section>
        </MarginedContent>
    );
}

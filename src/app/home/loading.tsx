import { ArtCardSkeleton } from '@/components/layout/art-card';
import PageTitle from '@/components/layout/page-title';
import { title } from '@/components/primitives';
import MarginedContent from '@/components/ui/margined-content';

export default function Loading() {
    return (
        <MarginedContent>
            <PageTitle className={title({ color: "foreground" })}>
                Home
            </PageTitle>

            <section className="w-full h-full grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))]  md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]  place-items-center gap-2">
                {Array.from({ length: 21 }).map((_, index) => (
                    <ArtCardSkeleton key={index} />
                ))}
            </section>
        </MarginedContent>
    );
}

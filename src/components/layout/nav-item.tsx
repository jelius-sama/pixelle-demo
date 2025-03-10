"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

export default function NavItem({ href, title, icon }: { href: string; title: string; icon: React.JSX.Element; }) {
    const path = usePathname();

    return (
        <SheetClose asChild>
            <Button variant={path === href ? 'secondary' : 'ghost'} asChild className='w-full justify-start [&_svg]:size-6'>
                <Link href={href}>
                    {icon}
                    <span className="">{title}</span>
                </Link>
            </Button>
        </SheetClose>
    );
}
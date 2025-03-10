import { cssVars } from '@/app.config';
import InputX from '@/components/layout/input-x';
import { Card, CardContent } from '@/components/ui/card';
import MarginedContent from '@/components/ui/margined-content';
import { SubmitButton } from '@/components/ui/submit-button';
import { createServerClient } from '@/server/supabase/server';
import { AdminUserMetadata } from '@/types';
import { isString, toastToClient } from '@/utils';
import { ServerMessageStatus } from '@/utils/Messages';
import { Metadata, ServerRuntime } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: "Supabase database POST!"
};

async function runRevalidateFunc(formData: FormData) {
    "use server";

    const supabase = createServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!(user?.user_metadata as AdminUserMetadata).is_admin) {
        toastToClient({ path: '/', serverMessage: "405 - Method Not Allowed!", status: ServerMessageStatus.error });
    }

    try {
        const name = formData.get('name');
        const email = formData.get('email');

        if (!isString(name) || !isString(email)) {
            throw new Error("Invalid FormData!");
        }

        const { error } = await supabase
            .from('realtime_test')
            .insert([
                { name: name, email: email }
            ]);

        if (error) {
            console.error("Something went wrong when trying to insert data: ", error);
            return;
        }

        console.log("Data inserted successfully!");
    } catch (error) {
        console.error("Error inserting data: ", error);
    }
}

export default async function PostPage() {
    const supabase = createServerClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!(user?.user_metadata as AdminUserMetadata).is_admin) {
        notFound();
    }

    return (
        <MarginedContent style={{ width: `calc(100% - ${cssVars.marginPx * 2})` }} className='h-full flex flex-col gap-y-4 items-center justify-center'>
            <Card className='w-full max-w-[40%]'>
                <CardContent className='flex items-center justify-center'>
                    <form
                        action={runRevalidateFunc}
                        className='w-full flex flex-col items-center justify-center gap-y-2'>
                        <InputX
                            pending={"useFormStatus"}
                            isRequired={true}
                            inputType={'text'}
                            identifier={'name'}
                            title='Name'
                            containerClassName='w-full'
                        />
                        <InputX
                            pending={"useFormStatus"}
                            isRequired={true}
                            inputType={'text'}
                            identifier={'email'}
                            title='Email'
                            containerClassName='w-full'
                        />
                        <SubmitButton>
                            Submit
                        </SubmitButton>
                    </form>
                </CardContent>
            </Card>
        </MarginedContent>
    );
};

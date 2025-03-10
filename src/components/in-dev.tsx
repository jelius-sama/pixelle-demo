import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function StillInDevelopment() {
    return (
        <section className='w-full flex items-center justify-center'>
            <Card className='w-full max-w-2xl'>
                <CardHeader>
                    <CardTitle>Currently in development!</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>🚧 🚧 🚧</AlertTitle>
                        <AlertDescription>
                            This page is still in development.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </section>
    );
}

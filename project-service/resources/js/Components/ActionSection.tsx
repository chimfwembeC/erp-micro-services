import React, { PropsWithChildren } from 'react';
import SectionTitle from '@/Components/SectionTitle';
import { Card } from '@/components/ui/card';

interface Props {
  title: string;
  description: string;
}

export default function ActionSection({
  title,
  description,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <SectionTitle title={title} description={description} />

      <Card className="mt-5 md:mt-0 md:col-span-2">
        <div className="px-4 py-5 sm:p-6">
          {children}
        </div>
      </Card>
    </div>
  );
}

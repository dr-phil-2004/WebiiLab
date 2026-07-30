import { getWebinarAttendance } from '@/app/actions/attendance';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { AttendedTypeEnum } from '@/lib/generated/prisma/enums';
import { AttendanceData } from '@/lib/type';
import { HomeIcon, User } from 'lucide-react';
import React from 'react'
import PipelineLayout from './_component/PipelineLayout';

// Icône SVG custom pour la pipeline
 export const PipelineIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect x="2" y="10" width="12" height="28" rx="3" fill="currentColor" opacity="0.9"/>
        <rect x="18" y="6" width="12" height="36" rx="3" fill="currentColor" opacity="0.7"/>
        <rect x="34" y="14" width="12" height="20" rx="3" fill="currentColor" opacity="0.5"/>
        <path d="M14 24 L18 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 24 L34 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

// Données fictives pour l'aperçu de la pipeline (ctaType BUY_NOW)
// const buyNowWebinarAttendanceData = {
//     success: true,
//     data: {
//         [AttendedTypeEnum.REGISTERED]: {
//             count: 3,
//             users: [
//                 { id: 'u1', name: 'Alice Martin', email: 'alice@example.com' },
//                 { id: 'u2', name: 'Bob Dupont',   email: 'bob@example.com' },
//                 { id: 'u3', name: 'Clara Leroy',  email: 'clara@example.com' },
//             ],
//         },
//         [AttendedTypeEnum.ATTENDED]: {
//             count: 2,
//             users: [
//                 { id: 'u4', name: 'David Moreau', email: 'david@example.com' },
//                 { id: 'u5', name: 'Eva Bernard',  email: 'eva@example.com' },
//             ],
//         },
//         [AttendedTypeEnum.ADDED_TO_CART]: {
//             count: 2,
//             users: [
//                 { id: 'u6', name: 'Félix Garnier', email: 'felix@example.com' },
//                 { id: 'u7', name: 'Grace Petit',   email: 'grace@example.com' },
//             ],
//         },
//         [AttendedTypeEnum.FOLLOW_UP]: {
//             count: 1,
//             users: [
//                 { id: 'u8', name: 'Hugo Simon', email: 'hugo@example.com' },
//             ],
//         },
//         [AttendedTypeEnum.BREAKOUT_ROOM]: {
//             count: 0,
//             users: [],
//         },
//         [AttendedTypeEnum.CONVERTED]: {
//             count: 1,
//             users: [
//                 { id: 'u9', name: 'Inès Thomas', email: 'ines@example.com' },
//             ],
//         },
//     } as Record<AttendedTypeEnum, AttendanceData>,
//     ctaType: 'BUY_NOW',
//     webinarTags: ['Marketing', 'SaaS', 'Growth'],
// };

type Props = {
    params: Promise<{webinarId: string}>
}

const formatColumnTitle = (type: string): string => {
    const labels: Record<string, string> = {
        REGISTERED:    'Inscrits',
        ATTENDED:      'Présents',
        ADDED_TO_CART: 'Panier',
        FOLLOW_UP:     'Suivi',
        BREAKOUT_ROOM: 'Salle annexe',
        CONVERTED:     'Convertis',
    };
    return labels[type] ?? type;
};

const page = async ({params}: Props) => {
    const {webinarId} = await params;
    const pipelineData = await getWebinarAttendance(webinarId)
    // const pipelineData = buyNowWebinarAttendanceData;

    if (!pipelineData.data) {
        return (
            <div className="text-3xl h-[400px] flex justify-center items-center">
                No pipelines found
            </div>
        );
    }

    //TODO show real data
    return(

    <div className="w-full flex flex-col gap-8">

        <PageHeader
        leftIcon={<User className="w-4h-4"/>}
        mainIcon={<PipelineIcon className="w-12 h-12"/>}
        rightIcon={<HomeIcon className="w-3 h-3"/>}
        heading="Keep track of  all your customers "
        placeholder="Search Name, Tag or Email"
        />

        <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6">
            {Object.entries(pipelineData.data).map(([columnType, columnData]) => {
                const col = columnData as AttendanceData;
                return (
                    <PipelineLayout
                        key={columnType}
                        title={formatColumnTitle(columnType)}
                        count={col.count}
                        users={col.users as any}
                        tags={pipelineData.webinarTags}
                    />
                );
            })}
        </div>
    </div>
    )

}

export default page

'use client';
import { Home, Users, Files, Settings, LogOut } from 'lucide-react';

import { usePathname } from 'next/navigation';

import Link from 'next/link';
import clsx from 'clsx';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'AI Agent',
    href: '/agent',
    icon: Users,
  },
  { name: 'Customers', href: '/customers', icon: Files },
];

export default function NavLinks() {
   const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
        <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md text-sm font-mediumflex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

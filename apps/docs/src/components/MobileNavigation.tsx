import { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import clsx from 'clsx';

import { navigation } from '@/lib/navigation';

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  );
}

function LogomarkSvg(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
      <g fill="none" stroke="#38BDF8" strokeLinejoin="round" strokeWidth={3}>
        <path d="M10.308 5L18 17.5 10.308 30 2.615 17.5 10.308 5z" />
        <path d="M18 17.5L10.308 5h15.144l7.933 12.5M18 17.5h15.385L25.452 30H10.308L18 17.5z" />
      </g>
    </svg>
  );
}

export function MobileNavigation({ pathname }: { pathname: string }) {
  let [isOpen, setIsOpen] = useState(false);
  let close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onPopState = () => close();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isOpen, close]);

  function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    let link = event.currentTarget;
    if (
      link.pathname + link.search + link.hash ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6 stroke-slate-500" />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => close()}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur-sm lg:hidden"
        aria-label="Navigation"
      >
        <DialogPanel className="min-h-full w-full max-w-xs bg-white px-4 pt-5 pb-12 sm:px-6 dark:bg-slate-900">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => close()}
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6 stroke-slate-500" />
            </button>
            <a href="/" className="ml-6" aria-label="Home page">
              <LogomarkSvg className="h-9 w-9" />
            </a>
          </div>
          <nav className="mt-5 px-1 text-base lg:text-sm">
            <ul role="list" className="space-y-9">
              {navigation.map((section) => (
                <li key={section.title}>
                  <h2 className="font-display font-medium text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                  <ul
                    role="list"
                    className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200 dark:border-slate-800"
                  >
                    {section.links.map((link) => {
                      const isActive = link.href === pathname;
                      return (
                        <li key={link.href} className="relative">
                          <a
                            href={link.href}
                            onClick={onLinkClick}
                            className={clsx(
                              'block w-full pl-3.5 before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                              isActive
                                ? 'font-semibold text-sky-500 before:bg-sky-500'
                                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                            )}
                          >
                            {link.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  );
}

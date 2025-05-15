import { ReactNode } from 'react';
import { NavigationBar } from '../navigation-bar'; // 稍后创建导航条组件

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col dotted-background">
      <NavigationBar />
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-5xl flex flex-col">
          {children}
        </div>
      </main>
      {/* 您可能还需要一个 Footer 组件 */}
      {/* <Footer className="mt-auto" /> */}
    </div>
  );
}
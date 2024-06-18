'use client';
import React from 'react';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster />
			</ThemeProvider>
		</>
	);
}

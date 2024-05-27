import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ContentState = {
	markdown: string;
	showContent: boolean;
};

interface AppState {
	content: ContentState;
}

const defaultValues: AppState = {
	content: {
		markdown: '',
		showContent: false,
	},
};

interface AppActions {
	setMarkdown: (value: string | ((prev: string) => string)) => void;
	setShowContent: (value: boolean) => void;
}

const useAppStore = create<AppState & AppActions>()(
	persist(
		immer((set) => ({
			...defaultValues,
			setMarkdown: (value: string | ((prev: string) => string)) => {
				set((state) => {
					if (typeof value === 'string') {
						state.content.markdown = value;
					} else {
						state.content.markdown = value(state.content.markdown);
					}
				});
			},
			setShowContent: (showContent: boolean) => {
				set((state) => {
					state.content.showContent = showContent;
				});
			},
		})),
		{
			name: 'APP_STATE',
			version: 1,
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) =>
						['content'].includes(key)
					)
				),
		}
	)
);

export default useAppStore;

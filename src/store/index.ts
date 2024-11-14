import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

interface NumStoreState {
  num: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  action: () => void;
  fetch: (voting: RequestInfo | URL) => void;
}

// 定义初始状态的类型
export const useNumStore = create(
  devtools(
    persist<NumStoreState>(
      (set, get) => ({
        num: 0,
        increasePopulation: () => set((state) => ({ num: state.num + 1 })),
        removeAllBears: () => set({ num: 0 }),
        action: () => {
          // 这里可以根据实际逻辑来定义类型，例如：
          const num = get().num;
          console.log(num, 'num');
          // ...
        },
        fetch: async (voting: RequestInfo | URL) => {
          const response = await fetch(voting);
          set({ num: (await response.json()) as number });
        },
      }),
      {
        name: 'num',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

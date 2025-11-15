// src/features/customers/store/customerStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type CustomerEntity } from '../types/entity';
import { getRouteApi } from '@tanstack/react-router';

const routeApi = getRouteApi('/customers');

interface CustomerStore {
  // Dữ liệu
  customers: CustomerEntity[];
  filteredCustomers: CustomerEntity[];
  totalCustomers: number;

  // UI state
  searchText: string;
  sortField: keyof CustomerEntity | 'createdAt';
  sortOrder: 'ascend' | 'descend';

  // Actions
  initCustomers: (initial: CustomerEntity[]) => void;
  setSearchText: (text: string) => void;
  setSort: (field: keyof CustomerEntity | 'createdAt', order: 'ascend' | 'descend') => void;
  clearFilters: () => void;
  refresh: () => void;

  // CRUD mock
  addCustomer: (customer: Omit<CustomerEntity, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: number, data: Partial<CustomerEntity>) => void;
  deleteCustomer: (id: number) => void;
}

export const useCustomerStore = create<CustomerStore>()(
  devtools(
    (set, get) => {
      // Hàm private để filter + sort (không nằm trong state)
      const applyFiltersAndSort = () => {
        const { customers, searchText, sortField, sortOrder } = get();

        let filtered = [...customers];

        // Search
        if (searchText) {
          const lower = searchText.toLowerCase();
          filtered = filtered.filter(
            (c) =>
              c.name.toLowerCase().includes(lower) ||
              c.email.toLowerCase().includes(lower) ||
              c.phone.includes(searchText)
          );
        }

        // Sort
        filtered.sort((a, b) => {
          let aValue: any = a[sortField];
          let bValue: any = b[sortField];

          if (sortField === 'createdAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }

          return sortOrder === 'ascend'
            ? aValue > bValue ? 1 : -1
            : aValue < bValue ? 1 : -1;
        });

        set({ filteredCustomers: filtered, totalCustomers: filtered.length });
      };

      return {
        // Initial state
        customers: [],
        filteredCustomers: [],
        totalCustomers: 0,
        searchText: '',
        sortField: 'createdAt',
        sortOrder: 'descend',

        initCustomers: (initial: CustomerEntity[]) => {
          set({ customers: initial, filteredCustomers: initial, totalCustomers: initial.length });
          applyFiltersAndSort();
        },

        setSearchText: (text: string) => {
          set({ searchText: text });
          applyFiltersAndSort();
        },

        setSort: (field, order) => {
          set({ sortField: field, sortOrder: order });
          applyFiltersAndSort();
        },

        clearFilters: () => {
          set({ searchText: '', sortField: 'createdAt', sortOrder: 'descend' });
          applyFiltersAndSort();
        },

        refresh: () => {
          const { customers: initialCustomers } = routeApi.useLoaderData();
          set({ customers: initialCustomers || [], searchText: '', sortField: 'createdAt', sortOrder: 'descend' });
          applyFiltersAndSort();
        },

        // CRUD mock
        addCustomer: (data) => {
          const newCustomer: CustomerEntity = {
            ...data,
            id: Math.max(...get().customers.map((c) => c.id), 0) + 1,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({
            customers: [...state.customers, newCustomer],
          }));
          applyFiltersAndSort();
        },

        updateCustomer: (id, data) => {
          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === id ? { ...c, ...data } : c
            ),
          }));
          applyFiltersAndSort();
        },

        deleteCustomer: (id) => {
          set((state) => ({
            customers: state.customers.filter((c) => c.id !== id),
          }));
          applyFiltersAndSort();
        },
      };
    },
    { name: 'customer-store' }
  )
);
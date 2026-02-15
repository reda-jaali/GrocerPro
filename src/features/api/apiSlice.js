import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5001' }),
    tagTypes: ['Product', 'Customer', 'User'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => '/products',
            providesTags: ['Product'],
        }),
        addProduct: builder.mutation({
            query: (product) => ({
                url: '/products',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),

        getCustomers: builder.query({
            query: () => '/customers',
            providesTags: ['Customer'],
        }),
        addCustomer: builder.mutation({
            query: (customer) => ({
                url: '/customers',
                method: 'POST',
                body: customer,
            }),
            invalidatesTags: ['Customer'],
        }),
        updateCustomer: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/customers/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Customer'],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/customers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Customer'],
        }),
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetCustomersQuery,
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
    useGetUsersQuery,
} = apiSlice;

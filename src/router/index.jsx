import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const HomePage = lazy(() => import("@/components/pages/HomePage"));
const CategoryPage = lazy(() => import("@/components/pages/CategoryPage"));
const ProductDetailPage = lazy(() => import("@/components/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/components/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/components/pages/CheckoutPage"));
const WishlistPage = lazy(() => import("@/components/pages/WishlistPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <HomePage />
      </Suspense>
    )
  },
  {
    path: "category/:categoryName",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CategoryPage />
      </Suspense>
    )
  },
  {
    path: "product/:productId",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <ProductDetailPage />
      </Suspense>
    )
  },
{
    path: "cart",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CartPage />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <CheckoutPage />
      </Suspense>
    )
  },
  {
    path: "wishlist",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <WishlistPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<div>Loading.....</div>}>
        <NotFound />
      </Suspense>
    )
  }
]

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);
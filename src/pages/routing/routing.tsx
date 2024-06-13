import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FC, ReactElement, Suspense } from 'react';
import React from 'react';
// import { AppLayout } from '../layout/AppLayout';

const BuyPage = React.lazy(() => import('../buy/buy'));
const MainPage = React.lazy(() => import('../main/main'));

export const Routing: FC = (): ReactElement => {
    return (
        <Suspense>
            <BrowserRouter basename="/whiskers">
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/buy" element={<BuyPage />} />
                    <Route path="*" element={<div>Not found!</div>} />
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
};


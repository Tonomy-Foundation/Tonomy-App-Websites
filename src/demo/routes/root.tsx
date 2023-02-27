import { createBrowserRouter } from 'react-router-dom';

import Home from '../pages/Home';
import CallBackPage from '../pages/CallBackPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },

    {
        path: '/callback',
        element: <CallBackPage />,
    },
]);

export default router;

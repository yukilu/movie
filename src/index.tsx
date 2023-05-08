import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import App from './App';
import Actor from './Actor';
import Tag from './Tag';
import Series from './Series';
import reportWebVitals from './reportWebVitals';
import './index.css';

dayjs.locale('zh-cn');

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/actor',
    element: <Actor />,
  },
  {
    path: '/series',
    element: <Series />,
  },
  {
    path: '/tag',
    element: <Tag />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

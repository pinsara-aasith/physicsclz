import React from "react";
import { Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import axios from "axios";
import {
    notificationProvider,
    ThemedLayoutV2,
    ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import {
    UserOutlined,
    HomeOutlined,
    ClusterOutlined,
    FileMarkdownOutlined,
    AccountBookOutlined,
    BarChartOutlined, 
    PieChartOutlined
} from "@ant-design/icons";
import { DataProvider } from "@refinedev/strapi-v4";

import "dayjs/locale/de";

import { DashboardPage } from "./pages/dashboard";
import { API_URL, TOKEN_KEY } from "./constants";

import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider } from "./context";

import "@refinedev/antd/dist/reset.css";
import { StudentCreate, StudentEdit, StudentList } from "./pages/students";
import { PaperList } from "./pages/papers";
import { MarkCreate, MarkEdit, MarkList, MarkShow } from "./pages/marks";
import { Analysis } from "./pages/analysis/list";
import { ClassList } from "./pages/classes/list";
import { ClassEdit } from "./pages/classes/edit";
import { ClassCreate } from "./pages/classes/create";
import { ClassSearchProvider } from "./context/classSearchProvider";
import { AnalysisReport } from "./pages/analysisReport";

const App: React.FC = () => {
    const axiosInstance = axios.create();
    axiosInstance.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${TOKEN_KEY}`;

    const dataProvider = DataProvider(API_URL + `/api`, axiosInstance);

    const { t, i18n } = useTranslation();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <ConfigProvider>
                <RefineKbarProvider>
                    <Refine
                        routerProvider={routerProvider}
                        dataProvider={dataProvider}
                        i18nProvider={i18nProvider}
                        options={{
                            warnWhenUnsavedChanges: true,
                        }}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "dashboard",
                                list: "/",
                                meta: {
                                    label: "Dashboard",
                                    icon: < HomeOutlined />,
                                },
                            },
                            {
                                name: "classes",
                                list: "/classes",
                                create: "/classes/create",
                                edit: "/classes/edit/:id",
                                meta: {
                                    icon: <ClusterOutlined />,
                                    canDelete: true
                                },
                            },
                            {
                                name: "students",
                                list: "/students",
                                create: "/students/create",
                                edit: "/students/edit/:id",
                                show: "/students/show/:id",
                                meta: {
                                    icon: <UserOutlined />,
                                    canDelete: true
                                },
                            },
                            {
                                name: "papers",
                                list: "/papers",
                                meta: {
                                    icon: <FileMarkdownOutlined />,
                                    canDelete: true
                                },
                            },
                            {
                                name: "marks",
                                list: "/marks",
                                create: "/marks/create",
                                edit: "/marks/edit/:id",
                                show: "/marks/show/:id",
                                meta: {
                                    icon: <AccountBookOutlined />,
                                    canDelete: true
                                },
                            },
                            {
                                name: "progressReports",
                                list: "/analysis",
                                meta: {
                                    icon: <BarChartOutlined />,
                                },
                            },
                            {
                                name: "analysisReports",
                                list: "/analysisReport",
                                meta: {
                                    icon: <PieChartOutlined />,
                                },
                            }
                        ]}
                    >
                        <ClassSearchProvider>
                            <Routes>
                                <Route
                                    element={
                                        <ThemedLayoutV2
                                            initialSiderCollapsed={false}
                                            Header={Header}
                                            Title={Title}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    }
                                >
                                    <Route index element={<DashboardPage />} />

                                    <Route path="/students">
                                        <Route index element={<StudentList />} />
                                        <Route
                                            path="create"

                                            element={<StudentCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<StudentEdit />}
                                        />
                                    </Route>

                                    <Route
                                        path="/papers"
                                        element={<PaperList />}
                                    />

                                    <Route path="/marks">
                                        <Route index element={<MarkList />} />
                                        <Route
                                            path="create"
                                            element={<MarkCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<MarkEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<MarkShow />}
                                        />
                                    </Route>

                                    <Route path="/classes">
                                        <Route index element={<ClassList />} />
                                        <Route
                                            path="create"
                                            element={<ClassCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<ClassEdit />}
                                        />
                                    </Route>

                                    <Route path="/analysis">
                                        <Route index element={<Analysis />} />
                                    </Route>

                                    <Route path="/analysisReport">
                                        <Route index element={<AnalysisReport />} />
                                    </Route>
                                </Route>

                                <Route
                                    element={
                                        <ThemedLayoutV2
                                            Header={Header}
                                            Title={Title}
                                        >
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    }
                                >
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>
                            </Routes>
                        </ClassSearchProvider>
                        <UnsavedChangesNotifier />
                    </Refine>
                </RefineKbarProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export default App;

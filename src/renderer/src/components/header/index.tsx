import { useState, useEffect } from "react";
import {
    useGetLocale,
    useSetLocale,
} from "@refinedev/core";
import { ClusterOutlined, DownOutlined } from "@ant-design/icons";

import {
    Dropdown,
    Avatar,
    Space,
    Grid,
    Row,
    Col,
    Layout as AntdLayout,
    Button,
    theme,
    MenuProps,
    Select,
} from "antd";

import { useTranslation } from "react-i18next";

import { useConfigProvider } from "../../context";
import { IconMoon, IconSun } from "../icons";
import { IClass } from "@renderer/src/interfaces";
import { useSelect } from "@refinedev/antd";
import { useClassSearchProvider } from "../../context/classSearchProvider";

const { Header: AntdHeader } = AntdLayout;
const { useToken } = theme;
const { useBreakpoint } = Grid;

import './header.css'

export const Header: React.FC = () => {
    const { token } = useToken();
    const { mode, setMode } = useConfigProvider();
    const { i18n } = useTranslation();
    const locale = useGetLocale();
    const changeLanguage = useSetLocale();
    const screens = useBreakpoint();
    // const t = useTranslate();

    const currentLocale = locale();


    const menuItems: MenuProps["items"] = [...(i18n.languages || [])]
        .sort()
        .map((lang: string) => ({
            key: lang,
            onClick: () => changeLanguage(lang),
            icon: (
                <span style={{ marginRight: 8 }}>
                    <Avatar size={16} src={`/images/flags/${lang}.svg`} />
                </span>
            ),
            label: lang === "en" ? "English" : "German",
        }));

    let { selectProps: selectClassesProps } = useSelect<IClass>({
        resource: "classes",
        optionLabel: "name",
        optionValue: "id",
        sorters: [
            {
                field: "id",
                order: "desc",
            },
        ],
    });

    let { selectedClassId, setSelectedClassId } = useClassSearchProvider();

    return (
        <AntdHeader
            style={{
                backgroundColor: token.colorBgElevated,
                padding: "0 24px",
                position: "sticky",
                top: 0,
                zIndex: 1,
            }}
        >
            <Row
                align="middle"
                style={{
                    justifyContent: screens.sm ? "space-between" : "end",
                }}
            >
                <Col xs={0} sm={12}>
                    <Select
                        className="select-class"
                        {...selectClassesProps}
                        style={{
                            width: "100%",
                            maxWidth: "250px",
                            fontWeight: 'bold'
                        }}
                        placeholder="Select a class to filter data"
                        value={selectedClassId as any}
                        onChange={(val) => setSelectedClassId(Number(val) || undefined)}
                        suffixIcon={<ClusterOutlined />}
                        allowClear
                    />
                </Col>
                <Col>
                    <Space size="middle" align="center">
                        <Button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            type="default"
                            icon={mode === "light" ? <IconMoon /> : <IconSun />}
                            onClick={() => {
                                setMode(mode === "light" ? "dark" : "light");
                            }}
                        />
                        <Dropdown
                            menu={{
                                items: menuItems,
                                selectedKeys: currentLocale
                                    ? [currentLocale]
                                    : [],
                            }}
                        >
                            <a
                                style={{ color: "inherit" }}
                                onClick={(e) => e.preventDefault()}
                            >
                                <Space>
                                    <Avatar
                                        size={16}
                                        src={`/images/flags/${currentLocale}.svg`}
                                    />
                                    <div
                                        style={{
                                            display: screens.lg
                                                ? "block"
                                                : "none",
                                        }}
                                    >
                                        {currentLocale === "en"
                                            ? "English"
                                            : "German"}
                                        <DownOutlined
                                            style={{
                                                fontSize: "12px",
                                                marginLeft: "6px",
                                            }}
                                        />
                                    </div>
                                </Space>
                            </a>
                        </Dropdown>

                    </Space>
                </Col>
            </Row>
        </AntdHeader>
    );
};

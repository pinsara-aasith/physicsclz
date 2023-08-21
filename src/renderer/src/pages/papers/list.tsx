import { useTranslate, IResourceComponentsProps, CrudFilters, HttpError, getDefaultFilter } from "@refinedev/core";
import { useSimpleList, CreateButton, useDrawerForm } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { Row, List as AntdList, Col, Form, Input, Typography, Button, Select, FormProps, Card } from "antd";
import { PaperItem, CreatePaper, EditPaper } from "../../components/paper";
import { IPaper, IPaperFilterVariables } from "../../interfaces";
import { useClassSearchProvider, useMustHaveClassSelected } from "../../context/classSearchProvider";
import { useEffect } from "react";

const { Text } = Typography;

export const PaperList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    useMustHaveClassSelected();

    const { selectedClassId } = useClassSearchProvider();

    const { listProps, searchFormProps, filters, setFilters } = useSimpleList<IPaper, HttpError, IPaperFilterVariables>({
        pagination: { pageSize: 12, current: 1 },
        onSearch: ({ name, description, isFullPaper }) => {
            const paperFilters: CrudFilters = [
                {
                    field: "name",
                    operator: "contains",
                    value: name ? name : undefined,
                },
                {
                    field: "description",
                    operator: "contains",
                    value: description,
                },
                {
                    field: "isFullPaper",
                    operator: "eq",
                    value: isFullPaper,
                }
            ];

            return paperFilters;
        },
        
        sorters: {
            initial: [{ field: 'id', order: 'desc' }]
        },
        meta: {
            populate: ["class"]
        }
    });

    useEffect(() => {
        if (!selectedClassId) return;

        setFilters([
            {
                field: "class.id",
                operator: "eq",
                value: selectedClassId,
            }
        ])

    }, [selectedClassId])


    const {
        drawerProps: createDrawerProps,
        formProps: createFormProps,
        saveButtonProps: createSaveButtonProps,
        show: createShow,
        form: createForm
    } = useDrawerForm<IPaper>({
        action: "create",
        resource: "papers",
        redirect: false,
        meta: {
            populate: ['class']
        }
    });

    const {
        drawerProps: editDrawerProps,
        formProps: editFormProps,
        close: closeDrawer,
        saveButtonProps: editSaveButtonProps,
        show: editShow,
        id: editId,
    } = useDrawerForm<IPaper>({
        action: "edit",
        resource: "papers",
        redirect: false,
        meta: {
            populate: ['class']
        }
    });

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={18}>
                    <Form
                        {...searchFormProps}
                        onValuesChange={() => {
                            searchFormProps.form?.submit();
                        }}
                        initialValues={{
                            name: getDefaultFilter("name", filters, "contains"),
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginBottom: "16px",
                            }}
                        >
                            <Text style={{ fontSize: "24px" }} strong>
                                {t("papers.papers")}
                            </Text>
                            <Form.Item name="name" noStyle>
                                <Input
                                    style={{ width: "400px" }}
                                    placeholder={t("papers.paperSearch")}
                                    suffix={<SearchOutlined />}
                                />
                            </Form.Item>
                            <CreateButton onClick={() => createShow()}>
                                {t("papers.buttons.addPaper")}
                            </CreateButton>
                        </div>
                        <AntdList
                            grid={{
                                gutter: 6,
                                xs: 1,
                                sm: 1,
                                md: 2,
                                lg: 3,
                                xl: 3,
                                xxl: 4,
                            }}
                            style={{
                                height: "100%",
                                overflow: "auto",
                                paddingRight: "4px",
                            }}
                            {...listProps}
                            renderItem={(item) => (
                                <PaperItem item={item} editShow={editShow} />
                            )}
                        />
                    </Form>
                </Col>
                <Col xs={0} sm={6}>
                    {/* <PaperCategoryFilter /> */}
                    <Card title={t("papers.filter.title")}>
                        <Filter formProps={searchFormProps} />
                    </Card>
                </Col>
            </Row>

            <CreatePaper
                drawerProps={createDrawerProps}
                formProps={createFormProps}
                form={createForm}
                saveButtonProps={createSaveButtonProps}
            />
            <EditPaper
                drawerProps={editDrawerProps}
                formProps={editFormProps}
                saveButtonProps={editSaveButtonProps}
                editId={editId}
                closeDrawer={closeDrawer}
            />
        </div>
    );
};

const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();

    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">
                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("papers.filter.name.label")} name="name">
                        <Input
                            placeholder={t("papers.filter.name.placeholder")}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={24}>
                    <Form.Item
                        label={t("papers.filter.isFullPaper.label")}
                        name="isFullPaper"
                    >
                        <Select
                            allowClear
                            placeholder={t("papers.filter.isFullPaper.placeholder")}
                            options={[
                                {
                                    label: t("papers.filter.isFullPaper.fullPaper"),
                                    value: true,
                                },
                                {
                                    label: t("papers.filter.isFullPaper.inClassPaper"),
                                    value: false,
                                },
                            ]}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={8}>
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            htmlType="submit"
                            type="primary"
                        >
                            {t("papers.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};


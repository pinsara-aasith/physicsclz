import {
    useTranslate,
    IResourceComponentsProps,
    useNavigation,
    CrudFilters,
    HttpError,
    useDelete,
    useResource,
} from "@refinedev/core";
import {
    List,
    useTable,
    DateField,
} from "@refinedev/antd";
import { FormOutlined, MoreOutlined, UserOutlined, HomeOutlined, BarcodeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu, Avatar, FormProps, Form, Row, Col, Input, Select, Button, Card, DatePicker } from "antd";

import { IStudent, IStudentFilterVariables } from "../../interfaces";

export const StudentList: React.FC<IResourceComponentsProps> = () => {

    const { tableProps, searchFormProps } = useTable<
        IStudent,
        HttpError,
        IStudentFilterVariables
    >({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { createdAt, barcodeNo, name, gender, school } = params;

            filters.push({
                field: "barcodeNo",
                operator: "contains",
                value: barcodeNo,
            });

            filters.push({
                field: "name",
                operator: "contains",
                value: name,
            });

            filters.push({
                field: "school",
                operator: "contains",
                value: school,
            });

            filters.push(
                {
                    field: "createdAt",
                    operator: "gte",
                    value: createdAt
                        ? createdAt[0].startOf("day").toISOString()
                        : undefined,
                }
            );

            filters.push({
                field: "gender",
                operator: "eq",
                value: gender,
            });

            return filters;
        },
    });


    const { edit } = useNavigation();
    const { resource: marksResouce } = useResource("marks");

    const t = useTranslate();

    const { mutate: mutateDelete } = useDelete();

    const moreMenu = (id: number) => (
        <Menu
            mode="vertical"
            onClick={({ domEvent }) => domEvent.stopPropagation()}
        >
            <Menu.Item
                key="1"
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{ color: "green", fontSize: "15px" }}
                    />
                }
                onClick={() => edit("students", id)
                }
            >
                {t("buttons.edit")}
            </Menu.Item>
            <Menu.Item
                key="reject"
                style={{
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                }}
                icon={
                    <CloseCircleOutlined
                        style={{
                            color: "#EE2A1E",
                            fontSize: 17,
                        }}
                    />
                }
                onClick={() => {
                    mutateDelete({
                        resource: "students",
                        id,
                        mutationMode: "undoable",
                        successNotification: { message: "Student was successfully deleted", type: "success" }
                    });
                }}
            >
                {t("buttons.delete")}
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col xl={18} xs={24}>
                    <List canCreate={true} >
                        <Table
                            {...tableProps}
                            rowKey="id"
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        location = `${marksResouce.list}?studentId=${record.id}` as any;
                                    },
                                };
                            }}>
                            <Table.Column
                                key="image"
                                align="center"
                                render={(_value, _record) => (

                                    <Avatar
                                        src={
                                            (_record?.['gender'] == 'Female') ?
                                                "/images/girl.svg" : "/images/boy.svg"}
                                        alt="Default Student Image"
                                        size={48}
                                    />
                                )}
                            />
                            <Table.Column
                                dataIndex="id"
                                align="center"
                                title={t("students.fields.id")}
                            />
                            {/* <Table.Column
                                align="center"
                                key="profilePicture"
                                dataIndex={["profilePicture"]}
                                title={t("students.fields.profilePicture.label")}
                                render={(value) => <Avatar src={value[0].url} />}
                            /> */}
                            <Table.Column
                                dataIndex="barcodeNo"
                                title={t("students.fields.barcodeNo")}
                                sorter
                            />
                            <Table.Column
                                width={250}
                                dataIndex="name"
                                title={t("students.fields.name")}
                                sorter
                            />
                            <Table.Column
                                dataIndex="school"
                                title={t("students.fields.school")}
                                sorter
                            />

                            <Table.Column
                                key="gender"
                                dataIndex="gender"
                                title={t("students.fields.gender.label")}
                                render={(value) =>
                                    t(`students.fields.gender.${value}`)
                                }
                            />
                            <Table.Column
                                dataIndex="createdAt"
                                title={t("students.fields.createdAt")}
                                render={(value) => (
                                    <DateField value={value} />
                                )}
                                sorter
                            />

                            <Table.Column<IStudent>
                                fixed="right"
                                title={t("table.actions")}
                                dataIndex="actions"
                                key="actions"
                                render={(_, record) => (
                                    <Dropdown
                                        overlay={moreMenu(record.id)}
                                        trigger={["click"]}
                                    >
                                        <MoreOutlined
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                fontSize: 24,
                                            }}
                                        />
                                    </Dropdown>
                                )}
                            />
                        </Table>
                    </List>
                </Col>

                <Col
                    xl={6}
                    lg={24}
                    xs={24}
                    style={{
                        marginTop: "48px",
                    }}
                >
                    <Card title={t("students.filter.title")}>
                        <Filter formProps={searchFormProps} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};


const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();

    const { RangePicker } = DatePicker;

    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">
                <Col xs={24} xl={24} md={12}>
                    <Form.Item
                        label={t("students.filter.createdAt.label")}
                        name="createdAt"
                    >
                        <RangePicker style={{ width: "100%" }} />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("students.filter.barcodeNo.label")} name="barcodeNo">
                        <Input
                            placeholder={t("students.filter.barcodeNo.placeholder")}
                            prefix={<BarcodeOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("students.filter.name.label")} name="name">
                        <Input
                            placeholder={t("students.filter.name.placeholder")}
                            prefix={<UserOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={12}>
                    <Form.Item label={t("students.filter.school.label")} name="school">
                        <Input
                            placeholder={t("students.filter.school.placeholder")}
                            prefix={<HomeOutlined />}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} xl={24} md={24}>
                    <Form.Item
                        label={t("students.filter.gender.label")}
                        name="gender"
                    >
                        <Select
                            allowClear
                            placeholder={t("students.filter.gender.placeholder")}
                            options={[
                                {
                                    label: t("students.filter.gender.male"),
                                    value: "Male",
                                },
                                {
                                    label: t("students.filter.gender.female"),
                                    value: "Female",
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
                            {t("students.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

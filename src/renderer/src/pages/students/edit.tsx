import {
    IResourceComponentsProps,
    useTranslate,
    useApiUrl,
} from "@refinedev/core";
import {
    Edit,
    getValueFromEvent,
    useForm,
} from "@refinedev/antd";
import {
    Form,
    Select,
    Upload,
    Input,
    Typography,
    Space,
    Avatar,
    Row,
    Col,
    InputNumber,
} from "antd";

import { IStudent } from "../../interfaces";

const { Text } = Typography;

export const StudentEdit: React.FC<IResourceComponentsProps> = () => {
    const apiUrl = useApiUrl();
    const t = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm<IStudent>({
        successNotification: {
            message: 'Student was edited successfully',
            type: 'success'
        }
    });

    return (
        <Edit
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    isActive: true,
                    ...formProps.initialValues,
                }}
            >

                <Row gutter={20}>
                    <Col xs={24} lg={8}>
                        <Form.Item>
                            <Form.Item
                                name="profilePicture"
                                valuePropName="fileList"
                                getValueFromEvent={getValueFromEvent}
                                noStyle
                            >
                                <Upload.Dragger
                                    name="file"
                                    action={`${apiUrl}/media/upload`}
                                    listType="picture"
                                    maxCount={1}
                                    multiple
                                    style={{
                                        border: "none",
                                        width: "100%",
                                        background: "none",
                                    }}
                                >
                                    <Space direction="vertical" size={2}>
                                        <Avatar
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                maxWidth: "200px",
                                            }}
                                            src="/images/user-default-img.png"
                                            alt="Store Location"
                                        />
                                        <Text
                                            style={{
                                                fontWeight: 800,
                                                fontSize: "16px",
                                                marginTop: "8px",
                                            }}
                                        >
                                            {t("students.fields.profilePicture.description")}
                                        </Text>
                                        <Text style={{ fontSize: "12px" }}>
                                            {t("students.fields.profilePicture.label")}
                                        </Text>
                                    </Space>
                                </Upload.Dragger>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={16}>
                        <Row gutter={10}>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={t("students.fields.name")}
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label={t("students.fields.school")}
                                    name="school"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>

                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label={t("students.fields.barcodeNo")}
                                    name="barcodeNo"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label={t("students.fields.gender.label")}
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Select
                                        options={[
                                            {
                                                label: t("students.fields.gender.Male"),
                                                value: "Male",
                                            },
                                            {
                                                label: t("students.fields.gender.Female"),
                                                value: "Female",
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label={t("students.fields.description")}
                            name="description"
                        >
                            <Input.TextArea style={{ minHeight: '150px' }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};

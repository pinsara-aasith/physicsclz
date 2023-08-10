import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import {
    Form,
    Input,
    Row,
    Col,
    Space,
    Image,
    InputNumber,
    Select,
} from "antd";

import { IClass } from "../../interfaces";
import { useEffect, useState } from "react";


export const ClassCreate: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { formProps, saveButtonProps, queryResult, form } = useForm<IClass>();

    const [alYear, setALYear] = useState<number>(0);
    const [type, setType] = useState<string>('');

    useEffect(() => {
        form.setFieldValue('name', `${alYear} - ${type}`)
    }, [alYear, type])

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
                initialValues={{
                    isActive: true,
                }}
            >
                <Row gutter={[64, 0]} wrap>
                    <Col xs={24} lg={6}>
                        <Space
                            direction="vertical"
                            align="center"
                            style={{
                                width: "100%",
                                textAlign: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <Image
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    maxWidth: "256px",
                                }}
                                src="/images/coaching.png"
                                alt="Class Location"
                            />
                        </Space>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Form.Item
                            label={t("classes.fields.alYear")}
                            name="alYear"
                            rules={[
                                {
                                    required: true,
                                    type: "number",
                                },
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} onChange={(val) => setALYear(Number(val?.toString()))}/>
                        </Form.Item>
                        <Form.Item
                            label={t("classes.fields.type.name")}
                            name="type"
                            rules={[
                                {
                                    required: true
                                },
                            ]}
                        >
                            <Select
                                onChange={(v) => setType(v)}
                                options={[
                                    {
                                        label: t("classes.fields.type.types.theory"),
                                        value: "Theory",
                                    },
                                    {
                                        label: t("classes.fields.type.types.revision"),
                                        value: "Revision",
                                    },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label={t("classes.fields.name")}
                            name="name"
                        >
                            <Input disabled={true} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Form.Item
                            label={t("classes.fields.description")}
                            name={"description"}
                        >
                            <Input.TextArea rows={8} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};

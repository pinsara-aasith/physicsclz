import { useTranslate } from "@refinedev/core";
import { Create, useSelect } from "@refinedev/antd";
import {
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    InputNumber,
    Radio,
    ButtonProps,
    Grid,
    Row,
    Col,
    DatePicker,
    Divider,
    Select,
    FormInstance,
} from "antd";
import { IClass } from "@renderer/src/interfaces";
import { useEffect, useState } from "react";


type CreatePaperProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    form: FormInstance;
    saveButtonProps: ButtonProps;
};

export const CreatePaper: React.FC<CreatePaperProps> = ({
    drawerProps,
    formProps,
    form,
    saveButtonProps,
}) => {
    const t = useTranslate();
    const breakpoint = Grid.useBreakpoint();

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

    const [totalMarksForStructuredEssay, setTotalMarksForStructuredEssay] = useState<number>(80);
    const [totalMarksForEssay, setTotalMarksForEssay] = useState<number>(120);
    const [mcqCount, setMCQCount] = useState<number>(50);

    useEffect(() => {
        if (mcqCount == 0) {
            form.setFieldValue('totalMarksForMCQ', 0)
        } else {
            if (totalMarksForEssay != 0 || totalMarksForStructuredEssay != 0) {
                form.setFieldValue('totalMarksForMCQ', totalMarksForEssay + totalMarksForStructuredEssay)
            } else {
                form.setFieldValue('totalMarksForMCQ', 100)
            }
        }
    }, [totalMarksForEssay, totalMarksForStructuredEssay, mcqCount]);

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Create
                resource="papers"
                saveButtonProps={saveButtonProps}
                goBack={false}
                contentProps={{
                    style: {
                        boxShadow: "none",
                    },
                    bodyStyle: {
                        padding: 0,
                    },
                }}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                    initialValues={{
                        type: 'Theory',
                        alYear: new Date().getFullYear() + 1,
                        mcqCount: 50,
                        totalMarksForMCQ: 200,
                        structuredEssayCount: 4,
                        totalMarksForStructuredEssay: 80,
                        essayCount: 4,
                        totalMarksForEssay: 120,
                    }}
                >
                    <Form.Item
                        label={t("papers.fields.name")}
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("papers.fields.description")}
                        name="description"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>


                    <Row gutter={12}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={t("papers.fields.class")}
                                name={["class", "id"]}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    allowClear
                                    placeholder={'Select class'}
                                    {...selectClassesProps}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                label={t("papers.fields.date")}
                                name="date"
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={24}>
                            <Form.Item name="isFullPaper" rules={[{ required: true }]}>
                                <Radio.Group>
                                    <Radio value={true}>{t("papers.fields.isFullPaper.values.fullPaper")}</Radio>
                                    <Radio value={false}>{t("papers.fields.isFullPaper.values.inClassPaper")}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />
                    <Row gutter={12}>
                        <Col xs={24} lg={24}>
                            <Form.Item
                                label={t("papers.fields.mcqCount")}
                                name="mcqCount"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={50}
                                    onChange={(v) => setMCQCount(v || 0)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={14} style={{ display: 'none' }}>
                            <Form.Item
                                label={t("papers.fields.totalMarksForMCQ")}
                                name="totalMarksForMCQ"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={200}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col xs={24} lg={10}>
                            <Form.Item
                                label={t("papers.fields.structuredEssayCount")}
                                name="structuredEssayCount"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={4}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={14}>
                            <Form.Item
                                label={t("papers.fields.totalMarksForStructuredEssay")}
                                name="totalMarksForStructuredEssay"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={80}
                                    onChange={(v) => setTotalMarksForStructuredEssay(v || 0)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row gutter={12}>
                        <Col xs={24} lg={10}>
                            <Form.Item
                                label={t("papers.fields.essayCount")}
                                name="essayCount"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={4}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={14}>
                            <Form.Item
                                label={t("papers.fields.totalMarksForEssay")}
                                name="totalMarksForEssay"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={120}
                                    onChange={(v) => setTotalMarksForEssay(v || 0)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Create>
        </Drawer>
    );
};

import {
    IResourceComponentsProps,
    useTranslate,
} from "@refinedev/core";
import {
    Edit,
    useForm,
} from "@refinedev/antd";
import {
    Form,
    Input,
    Row,
    Col,
    InputNumber,
    Image,
} from "antd";

import { IMark, IPaper } from "../../interfaces";
import { useEffect, useState } from "react";
import { calculateTotalMarks } from "./create";

export const MarkEdit: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();

    const { formProps, saveButtonProps, queryResult, form, formLoading } = useForm<IMark>({
        successNotification: {
            message: 'Mark was edited successfully',
            type: 'success'
        },
        meta: {
            populate: ["paper", "student"]
        }
    });

    const [mcqCount, setMCQCount] = useState<number>(0);
    const [structuredMarks, setStructuredMarks] = useState<number>(0);
    const [essayMarks, setEssayMarks] = useState<number>(0);

    let selectedPaper = queryResult?.data?.data?.paper
    let selectedStudent = queryResult?.data?.data?.student

    useEffect(() => {
        setMCQCount(form.getFieldValue("mcq"));
        setStructuredMarks(form.getFieldValue("structuredEssay"));
        setEssayMarks(form.getFieldValue("essay"));
    }, [formLoading])

    useEffect(() => {
        const totalMarks = calculateTotalMarks(mcqCount, structuredMarks, essayMarks, selectedPaper as IPaper)

        form.setFieldValue('total', totalMarks)
    }, [mcqCount, structuredMarks, essayMarks])

    return (
        <Edit
            isLoading={queryResult?.isFetching}
            saveButtonProps={saveButtonProps}
        >
            <Form
                {...formProps}
                layout="vertical"
            >
                <Row gutter={20}>
                    <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{
                                width: "80%",
                                maxWidth: '300px'
                            }}
                            src="/images/petition.png"
                        />
                    </Col>
                    <Col xs={24} lg={16}>
                        <Row gutter={10}>
                            <Col xs={24} lg={24}>
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.paper")}>
                                    <Input
                                        disabled={true}
                                        value={selectedPaper?.name}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col xs={24} lg={10}>
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.studentBarcodeNo")}>
                                    <Input
                                        disabled={true}
                                        value={selectedStudent?.barcodeNo}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={14}>
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.studentName")}>
                                    <Input
                                        disabled={true}
                                        value={selectedStudent?.name}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={10}>
                            <Col xs={24} lg={10}>
                                <Form.Item
                                    rules={[{ type: 'number', max: selectedPaper?.mcqCount || 0, required: true }]}
                                    label={t("marks.create.fields.mcq")}
                                    name="mcq"
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        onChange={(n) => setMCQCount(n as number)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {!!selectedPaper?.isFullPaper &&
                            <>
                                <Row gutter={10}>
                                    <Col xs={24} lg={10}>
                                        <Form.Item
                                            rules={[{ type: 'number', max: selectedPaper?.totalMarksForStructuredEssay || 0, required: true }]}
                                            label={t("marks.create.fields.structuredEssay")}
                                            name="structuredEssay"
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                onChange={(n) => setStructuredMarks(n as number)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={10}>
                                    <Col xs={24} lg={10}>
                                        <Form.Item
                                            rules={[{ type: 'number', max: selectedPaper?.totalMarksForEssay || 0, required: true }]}
                                            label={t("marks.create.fields.essay")}
                                            name="essay"
                                        >
                                            <InputNumber
                                                style={{ width: '100%' }}
                                                onChange={(n) => setEssayMarks(n as number)}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>
                        }

                        <Row gutter={10}>
                            <Col xs={24} lg={10}>
                                <Form.Item label={t("marks.create.fields.total")} name="total">
                                    <InputNumber style={{ width: '100%' }} suffix={'%'} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </Edit>
    );
};

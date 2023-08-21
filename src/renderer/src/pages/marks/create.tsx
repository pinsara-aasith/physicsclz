import {
    IResourceComponentsProps,
    useTranslate,
    CrudFilters,
    useOne,
    useCustom,
    useCustomMutation,
    useList,
    useDeleteMany,
} from "@refinedev/core";
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
    Create,
    useForm,
    useSelect,
} from "@refinedev/antd";

import {
    Form, Select, Row, Col, InputNumber, Image, Modal
} from "antd";

import { IMark, IPaper, IStudent } from "../../interfaces";
import React, { useEffect, useRef, useState } from "react";
import { useClassSearchProvider } from "../../context/classSearchProvider";


export function calculateTotalMarks(mcqCount: number, structuredMarks: number, essayMarks: number, paper: IPaper): number {
    if (!paper) return 0;

    const { totalMarksForMCQ, totalMarksForEssay, totalMarksForStructuredEssay, mcqCount: totalMCQCount } = paper;
    let totalMarks = essayMarks + structuredMarks;

    let markForEachMCQ = totalMarksForMCQ / totalMCQCount
    let mcqMarks = mcqCount * markForEachMCQ

    totalMarks += mcqMarks;

    let fullPaperMark = totalMarksForMCQ + totalMarksForEssay + totalMarksForStructuredEssay
    let marksForPercent = (totalMarks / fullPaperMark) * 100

    return Number(Number(marksForPercent).toFixed(2));
}

export const MarkCreate: React.FC<IResourceComponentsProps & { paperId?: number }> = (props) => {
    const t = useTranslate();
    const [selectedPaperId, setSelectedPaperId] = useState<any>(props.paperId);
    const [_selectedStudent, setSelectedStudent] = useState<any>();

    let { selectProps: selectStudentNameProps } = useSelect<IStudent>({
        resource: "students",
        optionLabel: "name",
        optionValue: "id",
    });

    let { selectProps: selectStudentBarcodeNoProps } = useSelect<IStudent>({
        resource: "students",
        optionLabel: "barcodeNo",
        optionValue: "id",
    });
    const { selectedClassId } = useClassSearchProvider();

    const [paperFilters, setPaperFilters] = useState<CrudFilters | undefined>(undefined);

    let { selectProps: selectPaperProps, queryResult: queryResultPaper } = useSelect<IPaper>({
        resource: "papers",
        optionLabel: "name",
        optionValue: "id",
        filters: paperFilters,
        onSearch(value) {
            const paperFilters: CrudFilters = [
                {
                    operator: "or",
                    value: [
                        {
                            field: "name",
                            operator: "contains",
                            value
                        },
                        {
                            field: "class.alYear",
                            operator: "contains",
                            value,
                        },
                        {
                            field: "class.type",
                            operator: "contains",
                            value,
                        },
                    ],
                },

            ];

            return paperFilters;
        },
        meta: {
            populate: ["class"]
        }
    });

    useEffect(() => { queryResultPaper.refetch() }, [paperFilters])

    useEffect(() => {
        if (!selectedClassId) return;

        setPaperFilters([
            {
                field: "class.id",
                operator: "eq",
                value: selectedClassId,
            }
        ])

    }, [selectedClassId])


    selectPaperProps.options = queryResultPaper.data?.data.map(m => ({
        label: `${m.name} : ${m?.class?.alYear} | ${m?.class?.type}`,
        value: m.id
    }))

    const { formProps, saveButtonProps, queryResult, form } = useForm<IMark>({
        successNotification: {
            message: 'Mark was added successfully',
            type: 'success'
        },
        redirect: "create",
        onMutationSuccess: () => {
            const tempPaper = form.getFieldValue("paper");
            form.resetFields();
            form.setFieldValue("paper", tempPaper);
            setTimeout(() => barcodeSelectRef.current?.focus(), 900)
        }
    });

    const { data: marksForSameSelectedStudent } = useList({
        resource: 'marks',
        filters: [
            {
                field: "student.id",
                operator: "eq",
                value: form.getFieldValue('student')
            },
            {
                field: "paper.id",
                operator: "eq",
                value: form.getFieldValue('paper')
            },
        ],
        pagination: {
            mode: 'off'
        }
    });

    const { mutate } = useDeleteMany();

    saveButtonProps.onClick = () => {
        if (!marksForSameSelectedStudent?.data?.length) {
            form.submit()
            return;
        }

        Modal.confirm({
            title: 'Warning!',
            icon: <ExclamationCircleFilled />,
            content: 'Marks have been already entered for selected student. Do you want to delete the existing marks and reenter new marks?',
            onOk() {
                return new Promise((resolve, reject) => {
                    mutate({
                        ids: marksForSameSelectedStudent?.data.map(d => d?.id).filter(d => !!d) as any,
                        resource: 'marks',
                            successNotification: {
                                message: 'Existing marks were deleted successfully',
                                type: 'success'
                            }
                    }, {
                        onError: (error, _variables, _context) => {
                            reject(error)
                        },
                        onSuccess: (data, _variables, _context) => {
                            resolve(data)
                        },
                    
                    })
                }).then((_v) => {
                    form.submit()
                })
            },
            onCancel() { },
        })
    }

    const mcqInputRef = useRef<HTMLInputElement>(null);
    const structuredEssayInputRef = useRef<HTMLInputElement>(null);
    const essayInputRef = useRef<HTMLInputElement>(null);

    const barcodeSelectRef = useRef<any>(null);

    const { data: selectedPaperData } = useOne<IPaper>({
        resource: "papers",
        id: selectedPaperId,
    });

    const selectedPaper = selectedPaperData?.data || null;

    const [mcqCount, setMCQCount] = useState<number>(0);
    const [structuredMarks, setStructuredMarks] = useState<number>(0);
    const [essayMarks, setEssayMarks] = useState<number>(0);

    useEffect(() => {
        const totalMarks = calculateTotalMarks(mcqCount, structuredMarks, essayMarks, selectedPaper as IPaper)

        form.setFieldValue('total', totalMarks)
    }, [mcqCount, structuredMarks, essayMarks])

    useEffect(() => {

        form.setFieldValue('mcq', null);
        form.setFieldValue('structuredEssay', null);
        form.setFieldValue('essay', null);

        setMCQCount(0);
        setStructuredMarks(0);
        setEssayMarks(0);
    }, [selectedPaperId])

    const evtHandlerFocusNextInput = (nextInput?: HTMLInputElement | null): React.KeyboardEventHandler<HTMLInputElement> => ((event) => {
       console.log("came here")
       
        if (!nextInput) return;
        console.log("came here q")
       
        if (event.key.toLowerCase() === "enter") {
            nextInput?.focus()
        }
        console.log("came here3")
       
    })

    return (
        <Create
            isLoading={queryResult?.isFetching}
            saveButtonProps={{ ...saveButtonProps, children: <span>Add New Mark</span> }}
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
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.paper")} name="paper">
                                    <Select
                                        disabled={!!props.paperId}
                                        allowClear
                                        {...selectPaperProps}
                                        onChange={(e) => setSelectedPaperId(e)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col xs={24} lg={10}>
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.studentBarcodeNo")} name="student">
                                    <Select
                                        ref={barcodeSelectRef}
                                        allowClear
                                        {...selectStudentBarcodeNoProps}
                                        onChange={(val) => setSelectedStudent(val)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={14}>
                                <Form.Item rules={[{ required: true }]} label={t("marks.create.fields.studentName")} name="student">
                                    <Select
                                        allowClear
                                        {...selectStudentNameProps}
                                        onChange={(val) => setSelectedStudent(val)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {!!selectedPaper?.mcqCount &&
                            <Row gutter={10}>
                                <Col xs={24} lg={10}>
                                    <Form.Item
                                        rules={[{ type: 'number', max: selectedPaper?.mcqCount || 0, required: true }]}
                                        label={t("marks.create.fields.mcq")}
                                        name="mcq"
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            ref={mcqInputRef}
                                            onChange={(n) => setMCQCount(n as number)}
                                            onKeyDown={evtHandlerFocusNextInput(structuredEssayInputRef.current)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        }

                        {!!selectedPaper?.structuredEssayCount &&
                            <Row gutter={10}>
                                <Col xs={24} lg={10}>
                                    <Form.Item
                                        rules={[{ type: 'number', max: selectedPaper?.totalMarksForStructuredEssay || 0, required: true }]}
                                        label={t("marks.create.fields.structuredEssay")}
                                        name="structuredEssay"
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            ref={structuredEssayInputRef}
                                            onChange={(n) => setStructuredMarks(n as number)}
                                            onKeyDown={evtHandlerFocusNextInput(essayInputRef.current)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        }

                        {!!selectedPaper?.essayCount &&
                            <Row gutter={10}>
                                <Col xs={24} lg={10}>
                                    <Form.Item
                                        rules={[{ type: 'number', max: selectedPaper?.totalMarksForEssay || 0, required: true }]}
                                        label={t("marks.create.fields.essay")}
                                        name="essay"
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            ref={essayInputRef}
                                            onChange={(n) => setEssayMarks(n as number)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
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
        </Create>
    );
};

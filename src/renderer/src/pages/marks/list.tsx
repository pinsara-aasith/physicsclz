import { useEffect, useMemo, useState } from "react";
import { CrudFilters, HttpError, IResourceComponentsProps, useExport, useTranslate } from "@refinedev/core";

import {
    List,
    useTable,
    getDefaultSortOrder,
    useSelect,
    EditButton,
    DeleteButton,
    ShowButton,
    ExportButton,
    CreateButton,
} from "@refinedev/antd";

import { Table, Select, Space, Form, Col, Row, FormProps, Button } from "antd";

import { IMark, IMarkFilterVariables, IPaper, IStudent } from "../../interfaces";
import { useQuery } from "../../hooks";
import { useClassSearchProvider, useMustHaveClassSelected } from "../../context/classSearchProvider";

export const MarkList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const query = useQuery();
    
    useMustHaveClassSelected();

    const initialFilters = useMemo(() => {
        const paperId = query.get('paperId');
        const studentId = query.get('studentId');
        const filters: CrudFilters = [];

        if (paperId) {
            filters.push({
                field: "paper.id",
                operator: "eq",
                value: paperId,
            });
        }

        if (studentId) {
            filters.push({
                field: "student.id",
                operator: "eq",
                value: studentId,
            });
        }
        return filters
    }, [query]);

    const { tableProps, searchFormProps, sorter, filters } = useTable<IMark, HttpError, IMarkFilterVariables>({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { paperId, studentId } = params;

            filters.push({
                field: "paper.id",
                operator: "eq",
                value: paperId,
            });

            filters.push({
                field: "student.id",
                operator: "eq",
                value: studentId,
            });

            return filters;
        },
        metaData: {
            populate: ["paper", "student", "paper.class"]
        },
        filters: {
            initial: initialFilters
        },
        pagination: {
            pageSize: 20
        }
    });

    searchFormProps.initialValues = useMemo(() => {
        const paperId = Number(query.get('paperId'));
        const studentId = Number(query.get('studentId'));

        return {
            paperId: paperId || undefined,
            studentId: studentId || undefined,
        }
    }, [query]);


    const { isLoading, triggerExport } = useExport<IMark>({
        sorter,
        filters,
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item) => {
            return {
                "Barcode No": item.student.barcodeNo,
                "Student Name": item.student.name,
                "Paper": item.paper.name,
                "Class": item.paper?.class.name,
                "Correct MCQ Count": item.mcq,
                "Structured Essay Marks": item.structuredEssay,
                "Essay Marks": item.essay,
                "Total Marks": item.total,
            };
        },
        meta: {
            populate: ["paper", "paper.class", "student"]
        }
    });

    const Actions: React.FC = () => (
        <>
            <ExportButton onClick={triggerExport} loading={isLoading}>Export Marks</ExportButton>
            <CreateButton>Add New Mark</CreateButton>
        </>
    );

    return (
        <>
            <Filter formProps={searchFormProps} />
            <List headerButtons={Actions} >
                <Table
                    {...tableProps}
                    rowKey="id"
                    pagination={{
                        ...tableProps.pagination,
                        showSizeChanger: true,
                    }}
                >
                    <Table.Column
                        dataIndex="id"
                        key="id"
                        title="ID"
                        defaultSortOrder={getDefaultSortOrder("id", sorter)}
                        sorter={{ multiple: 3 }}
                    />

                    <Table.Column
                        key="[student][barcodeNo]"
                        dataIndex={["student", "barcodeNo"]}
                        title={t("marks.fields.studentBarcodeNo")}
                    />
                    <Table.Column
                        key="[student][id]"
                        dataIndex={["student", "name"]}
                        title={t("marks.fields.studentName")}
                    />
                    <Table.Column
                        key="[paper][id]"
                        dataIndex={["paper", "name"]}
                        title={t("marks.fields.paperName")}
                    />
                    <Table.Column
                        key="[paper][class][name]"
                        dataIndex={["paper", "class", "name"]}
                        title={t("marks.fields.class")}
                    />
                    <Table.Column
                        dataIndex="mcq"
                        key="mcq"
                        title={t("marks.fields.mcq")}
                        sorter
                    />
                    <Table.Column
                        dataIndex="structuredEssay"
                        key="structuredEssay"
                        title={t("marks.fields.structuredEssay")}
                        sorter
                    />

                    <Table.Column
                        dataIndex="essay"
                        key="essay"
                        title={t("marks.fields.essay")}
                        sorter
                    />

                    <Table.Column
                        dataIndex="total"
                        key="total"
                        title={t("marks.fields.total")}
                        sorter
                    />

                    <Table.Column<{ id: string }>
                        title="Actions"
                        dataIndex="actions"
                        render={(_, record) => {
                            return (
                                <Space>
                                    <ShowButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                    <EditButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                    <DeleteButton
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                </Space>
                            );
                        }}
                    />
                </Table>
            </List>
        </>
    );
};


const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();

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
        label: `${m.name} : ${m.class?.alYear} | ${m.class?.type}`,
        value: m.id
    }))

    const { selectProps: selectStudentNameProps, queryResult: queryResultStudent } = useSelect<IStudent>({
        resource: "students",
        optionLabel: "name",
        optionValue: "id",
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
                            field: "barcodeNo",
                            operator: "contains",
                            value,
                        }
                    ],
                },

            ];

            return paperFilters;
        },
    },);

    selectStudentNameProps.options = queryResultStudent.data?.data.map(m => ({
        label: `${m.barcodeNo} : ${m.name}`,
        value: m.id
    }))

    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">
                <Col xs={24} md={5} xl={5}>
                    <Form.Item label={t("marks.filter.paperName.label")} name="paperId">
                        <Select
                            allowClear
                            placeholder={t("marks.filter.paperName.placeholder")}
                            {...selectPaperProps}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={5} xl={7}>
                    <Form.Item label={t("marks.filter.studentName.label")} name="studentId">
                        <Select
                            allowClear
                            placeholder={t("marks.filter.studentName.placeholder")}
                            {...selectStudentNameProps}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={3} xl={3}>
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            htmlType="submit"
                            type="primary"
                        >
                            {t("marks.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};


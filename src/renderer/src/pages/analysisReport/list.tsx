import { useEffect, useMemo, useState } from "react";
import { CrudFilters, HttpError, IResourceComponentsProps, useExport, useList, useTranslate } from "@refinedev/core";
import {
    List,
    useTable,
    getDefaultSortOrder,
    useSelect,
    ExportButton,
} from "@refinedev/antd";
import { Table, Select, Form, Col, Row, Card, FormProps, Button, Empty, Radio } from "antd";
import { IMark, IMarkFilterVariables, IPaper, } from "../../interfaces";
import { useQuery } from "../../hooks";
import { ResponsivePie } from "@nivo/pie";
import { useClassSearchProvider, useMustHaveClassSelected } from "../../context/classSearchProvider";

export const AnalysisReport: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const query = useQuery();

    useMustHaveClassSelected();

    const initialFilters = useMemo(() => {
        const paperId = query.get('paperId');
        const filters: CrudFilters = [];

        if (paperId) {
            filters.push({
                field: "paper.id",
                operator: "eq",
                value: paperId,
            });
        }
        return filters
    }, [query]);

    const { tableProps, searchFormProps, sorter, filters } = useTable<IMark, HttpError, IMarkFilterVariables>({
        resource: 'marks',
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { paperId } = params;

            filters.push({
                field: "paper.id",
                operator: "eq",
                value: paperId,
            });

            return filters;
        },
        metaData: {
            populate: ["paper", "student"]
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

        return {
            paperId: paperId || undefined,
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
                "A/L Year": item.paper?.class?.alYear,
                "Theory / Revision": item.paper?.class?.type,
                "Correct MCQ Count": item.mcq,
                "Structured Essay Marks": item.structuredEssay,
                "Essay Marks": item.essay,
                "Total Marks": item.total,
            };
        },
        meta: {
            populate: ["paper", "student", "paper.class"]
        }
    });

    const Actions: React.FC = () => (
        <ExportButton onClick={triggerExport} loading={isLoading}>Export Marks</ExportButton>
    );

    return (
        <>
            <Filter formProps={searchFormProps} />
            <Card title="Overrall Analysis Of The Paper">
                {!!searchFormProps.form?.getFieldValue('paperId') ?
                    <>
                        <ResponsiveProgressChart filters={filters} />

                        <List title={""} headerButtons={Actions} >
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
                            </Table>
                        </List>
                    </>
                    : <Empty style={{ padding: '80px' }} description={'Select a paper to get the overall analysis report'} />}
            </Card>
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


    return (
        <Form layout="vertical" {...props.formProps}>
            <Row gutter={[10, 0]} align="bottom">

                <Col xs={24} md={5} xl={7}>
                    <Form.Item label={t("marks.filter.paperName.label")} name="paperId">
                        <Select
                            allowClear
                            placeholder={t("marks.filter.paperName.placeholder")}
                            {...selectPaperProps}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={3} xl={3}>
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            type="primary"
                        >
                            {t("analysisReports.filter.submit")}
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

type ResponsiveProgressChartProps = {
    filters?: CrudFilters;
}

const ResponsiveProgressChart: React.FC<ResponsiveProgressChartProps> = (props) => {

    const [radioButtonValue, setRadioButtonValue] = useState('total');

    const { data: markData } = useList<IMark>({
        resource: "marks",
        sorters: [{ field: 'id', order: 'asc' }],
        pagination: { mode: "off" },
        filters: props.filters,
        meta: {
            populate: ['paper', 'student', "paper.class"]
        }
    })


    const chartData = useMemo(() => {
        const GRADES = [
            { grade: 'F', min: 0, max: 35 },
            { grade: 'S', min: 35, max: 55 },
            { grade: 'C', min: 55, max: 65 },
            { grade: 'B', min: 65, max: 75 },
            { grade: 'A', min: 75, max: 85 },
            { grade: 'A+', min: 85, max: 101 },
        ]

        const chartData = GRADES.map((g) => {

            let value = 0;
            switch (radioButtonValue) {
                case 'mcq':
                    const mcqs = markData?.data
                        ?.map(mark => ((mark.mcq / mark.paper.mcqCount) * 100) || 0)
                        .filter(m => g.max > m && m >= g.min);

                    value = mcqs?.length || 0; break;

                case 'structuredEssay':

                    const structuredEssays = markData?.data
                        ?.map(mark => ((mark.structuredEssay / mark.paper.totalMarksForStructuredEssay) * 100) || 0)
                        .filter(m => g.max > m && m >= g.min);

                    value = structuredEssays?.length || 0; break;

                case 'essay':
                    const essays = markData?.data
                        ?.map(mark => ((mark.essay / mark.paper.totalMarksForEssay) * 100) || 0)
                        .filter(m => g.max > m && m >= g.min);

                    value = essays?.length || 0; break;

                case 'total':
                    const totals = markData?.data
                        ?.map(mark => mark.total || 0)
                        .filter(m => g.max > m && m >= g.min);

                    value = totals?.length || 0; break;
            }

            return {
                "id": g.grade,
                "label": g.grade,
                "color": "hsl(273, 70%, 50%)",
                "value": value
            }
        })

        return chartData;
    }, [markData, radioButtonValue])

    return (
        <div style={{ width: '100%', height: '350px' }}>
            <Radio.Group value={radioButtonValue} onChange={(e) => setRadioButtonValue(e.target.value)}>
                <Radio.Button type="primary" value="total">Total</Radio.Button>
                <Radio.Button type="primary" value="mcq">MCQ</Radio.Button>
                <Radio.Button type="primary" value="structuredEssay">Structured Essay</Radio.Button>
                <Radio.Button type="primary" value="essay">Essay</Radio.Button>
            </Radio.Group>

            <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={1}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.2
                        ]
                    ]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            2
                        ]
                    ]
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ]
                    }
                ]}
            />
        </div>
    );
};



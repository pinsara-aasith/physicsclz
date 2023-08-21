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

import { IMark, IMarkFilterVariables, IPaper, IStudent } from "../../interfaces";
import { useQuery } from "../../hooks";
import { ResponsiveBar } from "@nivo/bar";
import { BasicTooltip } from "@nivo/tooltip";
import { useClassSearchProvider, useMustHaveClassSelected } from "../../context/classSearchProvider";

export const Analysis: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const query = useQuery();

    useMustHaveClassSelected();

    const initialFilters = useMemo(() => {
        const studentId = query.get('studentId');
        const filters: CrudFilters = [];

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
        resource: 'marks',
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        onSearch: (params) => {
            const filters: CrudFilters = [];
            const { studentId } = params;

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
        const studentId = Number(query.get('studentId'));

        return {
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
            <Card title="Student's Progress Report">
                {!!searchFormProps.form?.getFieldValue('studentId') ?
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
                    : <Empty style={{ padding: '80px' }} description={'Select a student to analyse the progress'} />}
            </Card>
        </>
    );
};


const Filter: React.FC<{ formProps: FormProps }> = (props) => {
    const t = useTranslate();

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

                <Col xs={24} md={5} xl={7}>
                    <Form.Item label={t("marks.filter.studentName.label")} name="studentId">
                        <Select
                            allowClear
                            placeholder={t("marks.filter.studentName.placeholder")}
                            {...selectStudentNameProps}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={6} xl={4}>
                    <Form.Item>
                        <Button
                            style={{ width: "100%" }}
                            htmlType="submit"
                            type="primary"
                        >
                            {t("progressReports.filter.submit")}
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

const BAR_COLORS_MAP = {
    'MCQ': "#7ad5c5",
    'Structured Essay': "#f3e676",
    'Essay': "#ebb65a",
    'Total Percentage': "#f78a79"
}

const BarTooltip: React.FunctionComponent<any> = (props) => {
    console.log(props)
    return (
        <BasicTooltip
            id={props.data?.absent ? '' : props.id}
            value={props.data?.absent ? 'ABSENT' : props.value}
            color={props.color}
            enableChip
            format={(v) => !props.data?.absent ? `${v}%` : String(v)}
        />
    );
};


const ResponsiveProgressChart: React.FC<ResponsiveProgressChartProps> = (props) => {
    const { selectedClassId } = useClassSearchProvider();

    const [radioButtonValue, setRadioButtonValue] = useState('all');
    const [paperType, setPaperType] = useState('all');

    const { data: markData } = useList<IMark>({
        resource: "marks",
        sorters: [{ field: 'id', order: 'asc' }],
        pagination: { mode: "off" },
        filters: props.filters,
        meta: {
            populate: ['paper', 'student', "paper.class"]
        }
    })

    const [paperFilters, setPaperFilters] = useState<CrudFilters | undefined>(undefined);

    const { data: paperData, refetch: paperDataRefetch } = useList<IPaper>({
        resource: "papers",
        sorters: [{ field: 'id', order: 'desc' }],
        pagination: { mode: "off" },
        filters: paperFilters,
        meta: {
            populate: ['class']
        }
    })

    useEffect(() => { paperDataRefetch() }, [paperFilters])

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


    const [keys, chartData] = useMemo(() => {
        const keys: any[] = [];
        const chartData = (paperData?.data || []).filter(p => {
            if(paperType == 'all') return true;
            if(paperType == 'inClassPaper' && !p.isFullPaper) return true;
            if(paperType == 'fullPaper' && p.isFullPaper) return true;

            return false
        }).map((d) => {
            const mark = markData?.data?.find(m => m.paper?.id == d.id);
            if (!mark) {
                return {
                    'MCQ': 100,
                    'Structured Essay': 100,
                    'Essay': 100,
                    'Total Percentage': 100,
                    'absent': true,
                    paper: d?.name,
                }
            }

            const mcqPercentage = (mark.mcq / mark.paper.mcqCount) * 100;
            const essayPercentage = (mark.essay / mark.paper.totalMarksForEssay) * 100;
            const structuredEssayPercentage = (mark.structuredEssay / mark.paper.totalMarksForStructuredEssay) * 100;

            const totalPercentage = mark?.total

            return {
                'MCQ': mcqPercentage,
                'Structured Essay': structuredEssayPercentage,
                'Essay': essayPercentage,
                'Total Percentage': totalPercentage,
                paper: d?.name,
                'absent': false,
            }
        })

        if (radioButtonValue == 'mcq' || radioButtonValue == 'all')
            keys.push({ id: 'MCQ', label: "MCQ", })

        if (radioButtonValue == 'structuredEssay' || radioButtonValue == 'all')
            keys.push({ id: 'Structured Essay', label: "Structured Essay" })

        if (radioButtonValue == 'essay' || radioButtonValue == 'all')
            keys.push({ id: 'Essay', label: "Essay" })

        if (radioButtonValue == 'total' || radioButtonValue == 'all')
            keys.push({ id: 'Total Percentage', label: "Total" })

        return [keys, chartData]
    }, [markData, paperData, radioButtonValue, paperType])

    return (
        <div style={{ width: '100%', height: '350px' }}>
            <Radio.Group style={{ paddingLeft: '20px' }} value={paperType} onChange={(e) => setPaperType(e.target.value)}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="inClassPaper">In Class Papers</Radio.Button>
                <Radio.Button value="fullPaper">Full Papers</Radio.Button>
            </Radio.Group>

            <Radio.Group value={radioButtonValue} onChange={(e) => setRadioButtonValue(e.target.value)}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="mcq">MCQ</Radio.Button>
                <Radio.Button value="structuredEssay">Structured Essay</Radio.Button>
                <Radio.Button value="essay">Essay</Radio.Button>
                <Radio.Button value="total">Total</Radio.Button>
            </Radio.Group>

            <ResponsiveBar
                valueFormat={(v) => `${v}%`}
                labelFormat={(v) => `${v}%`}
                enableLabel={false}
                data={chartData as any}
                keys={keys.map(k => k.id)}
                indexBy="paper"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: 'linear', max: 100 }}
                indexScale={{ type: 'band' }}
                tooltip={BarTooltip}
                tooltipLabel={({ indexValue, data }) => `${data?.absent ? "ABSENT" : indexValue}`}
                colors={({ id, data }) => data?.absent ? '#ff000010' : BAR_COLORS_MAP[id]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'brighter',
                            2
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                borderRadius={1}
                colorBy="id"
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Papers',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Percentage',
                    legendPosition: 'middle',
                    legendOffset: -40,
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        data: Object.keys(BAR_COLORS_MAP).map(m => ({ id: m, color: BAR_COLORS_MAP[m], label: m })),
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
            />
        </div>
    );
};



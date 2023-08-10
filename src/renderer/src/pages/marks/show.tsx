import {
    IResourceComponentsProps,
    useShow,
} from "@refinedev/core";
import React from 'react';
import { Descriptions, Divider } from 'antd';

import { Card } from "antd";

import { IMark } from "../../interfaces";

export const MarkShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult: markQueryResult } = useShow<IMark>({
        meta: {
            populate: ["paper", "student"]
        }
    });
    const mark = markQueryResult.data?.data;

    return (
        <Card bordered={false} style={{ height: "100%" }}>
            <Descriptions title="View Results" bordered>
                <Descriptions.Item label="Student's Barcode" span={4}>{mark?.student?.barcodeNo}</Descriptions.Item>
                <Descriptions.Item label="Student's Full Name" span={2}>{mark?.student?.name}</Descriptions.Item>
                <Descriptions.Item label="School">{mark?.student.school}</Descriptions.Item>
                <Descriptions.Item label="Paper">{mark?.paper?.name}</Descriptions.Item>
                <Descriptions.Item label="Class">{mark?.paper?.class?.name}</Descriptions.Item>
            </Descriptions>
            <Divider/>
            <Descriptions bordered>
                <Descriptions.Item label="MCQs">{mark?.mcq} / {mark?.paper.mcqCount}</Descriptions.Item>
                <Descriptions.Item label="Structured Essay">{mark?.structuredEssay} / {mark?.paper.totalMarksForStructuredEssay}</Descriptions.Item>
                <Descriptions.Item label="Essay">{mark?.essay} / {mark?.paper.totalMarksForEssay}</Descriptions.Item>
                <Descriptions.Item label="Total Marks">{mark?.total}</Descriptions.Item>
            </Descriptions>
        </Card>

    );
};

import { BaseKey, useResource } from "@refinedev/core";
import {
    FormOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import {
    Card,
    Dropdown,
    Typography,
    Button,
    Tag,
    Space,
    Image,
} from "antd";

import { IPaper } from "../../interfaces";
import { Link } from "react-router-dom";

const { Text, Paragraph } = Typography;

type PaperItemProps = {
    item: IPaper;
    updateStock?: (changedValue: number, clickedPaper: IPaper) => void;
    editShow: (id?: BaseKey) => void;
};

export const PaperItem: React.FC<PaperItemProps> = ({
    item,
    editShow,
}) => {
    const { resources } = useResource()

    let showMarksLink = resources.find(r => r.name == "marks")?.list?.toString();
    let showAnalysisReportLink = resources.find(r => r.name == "analysisReports")?.list?.toString();

    return (
        <Card
            style={{
                margin: "8px",
            }}
        >
            <div style={{ position: "absolute", top: "10px", right: "5px" }}>
                <Dropdown
                    menu={{
                        items: [{
                            label: 'Edit',
                            key: '2',
                            onClick: () => editShow(item.id),
                            style: {
                                fontWeight: 500,
                            },
                            icon: <FormOutlined
                                style={{
                                    color: "green",
                                }}
                            />
                        }]
                    }}
                    trigger={["click"]}
                >
                    <MoreOutlined
                        style={{
                            fontSize: 24,
                        }}
                    />
                </Dropdown>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                }}
            >
                <Text
                    className="item-id"
                    style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#999999",
                        textAlign: "center", marginBottom: '20px'
                    }}
                >
                    {item.class?.alYear} - {item.class?.type}
                </Text>

                <div style={{ textAlign: "center" }}>
                    <Image
                        width={40}
                        style={{ marginBottom: '20px', marginTop: '10px' }}
                        src={item.isFullPaper ? "/images/fullpaper.svg" : "/images/mcqpaper.svg"}
                        alt={item.name}
                        preview={false}
                    />
                </div>

                <Paragraph
                    style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        textAlign: "center",
                        margin: "20px"
                    }}

                >
                    {item.name} - {item.isFullPaper ? 'Main(Full) Paper' : 'In Class Paper'}
                </Paragraph>
                <Space size={[0, 8]} wrap style={{ textAlign: 'center', justifyContent: "center" }}>
                    <Tag color="magenta">{item.class?.type}</Tag>
                    <Tag color="blue">{item.isFullPaper ? 'Main(Full) Paper' : 'In Class Paper'}</Tag>
                    <Tag color="green">{item.date}</Tag>
                </Space>
                <Link to={`${showMarksLink}?paperId=${item.id}`}>
                    <Button type="default" style={{ marginTop: "16px", width: '100%' }}>View Marks</Button>
                </Link>
                <Link to={`${showAnalysisReportLink}?paperId=${item.id}`}>
                    <Button type="primary" style={{ marginTop: "7px", width: '100%' }}>Analysis Report</Button>
                </Link>
            </div>
        </Card>
    );
};

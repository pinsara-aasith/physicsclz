import { useResource, useTranslate } from "@refinedev/core";
import { Row, Col, Card, Image, Button } from "antd";

import { CSSProperties } from "react";
export const DashboardPage: React.FC = () => {
    const boxStyles: CSSProperties = {
        backgroundColor: "#ffffff20",
        borderRadius: "8px",

        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.3)"
    };

    const cardBodyStyles: CSSProperties =
    {
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundSize: "cover",
        borderRadius: '10px',
        width: '100%',
        backgroundImage: "url(images/background.jpeg)",
    };

    const buttonStyles: CSSProperties = {
        width: '90%',
        backgroundColor: "#ffffff45",
        fontWeight: "bold",
        color: "#000000AA"
    }

    const { resources } = useResource();
    const t = useTranslate();

    return (
        <Row gutter={[16, 16]}>
            <Col md={24}>
                <Row gutter={[16, 16]}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            style={{ ...boxStyles }}
                            bodyStyle={{
                                padding: "40px",
                            }}
                        >
                            <Image
                                src={'/images/banner.jpg'}
                                style={{ borderRadius: '10px', ...boxStyles }}
                                preview={false}
                            />

                            <Row gutter={[16, 16]} style={{ marginTop: '35px' }}>
                                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                    <Card
                                        bodyStyle={cardBodyStyles}
                                        style={{ ...boxStyles }}
                                    >
                                        <Image
                                            preview={false}
                                            src="/images/students.png"
                                            width={160}
                                            style={{ padding: "20px" }}
                                        />
                                        <Button style={buttonStyles} href={resources.find(r => r.name == 'students')?.list?.toString()}>
                                            {t('dashboard.manageStudents.title')}
                                        </Button>
                                    </Card>
                                </Col>

                                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                    <Card
                                        bodyStyle={cardBodyStyles}
                                        style={{ ...boxStyles }}
                                    >
                                        <Image
                                            preview={false}
                                            src="/images/papers.png"
                                            width={160}
                                            style={{ padding: "20px" }}
                                        />
                                        <Button style={buttonStyles} href={resources.find(r => r.name == 'papers')?.list?.toString()}>
                                            {t('dashboard.managePapers.title')}
                                        </Button>
                                    </Card>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                    <Card
                                        bodyStyle={cardBodyStyles}
                                        style={{ ...boxStyles }}
                                    >
                                        <Image
                                            preview={false}
                                            src="/images/petition.png"
                                            width={160}
                                            style={{ padding: "20px" }}
                                        />
                                        <Button style={buttonStyles} href={resources.find(r => r.name == 'marks')?.list?.toString()}>
                                            {t('dashboard.manageMarks.title')}
                                        </Button>
                                    </Card>
                                </Col>
                                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                                    <Card
                                        bodyStyle={cardBodyStyles}
                                        style={{ ...boxStyles }}
                                    >
                                        <Image
                                            preview={false}
                                            src="/images/bar-chart.png"
                                            width={160}
                                            style={{ padding: "20px" }}
                                        />
                                        <Button style={buttonStyles} href={resources.find(r => r.name == 'progressReportsw')?.list?.toString()}>
                                            {t('dashboard.analysis.title')}
                                        </Button>
                                    </Card>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

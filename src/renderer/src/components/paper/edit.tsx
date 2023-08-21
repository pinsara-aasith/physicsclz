import { useTranslate, BaseKey } from "@refinedev/core";
import { Edit, useSelect } from "@refinedev/antd";
import {
    Drawer,
    DrawerProps,
    Form,
    FormProps,
    Input,
    InputNumber,
    Radio,
    Select,
    ButtonProps,
    Grid,
    Row,
    Col,
    Divider,
} from "antd";
import { IClass } from "@renderer/src/interfaces";

type EditPaperProps = {
    drawerProps: DrawerProps;
    formProps: FormProps;
    saveButtonProps: ButtonProps;
    editId?: BaseKey;
    closeDrawer: () => void;
};

export const EditPaper: React.FC<EditPaperProps> = ({
    drawerProps,
    formProps,
    saveButtonProps,
    editId,
    closeDrawer
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

    return (
        <Drawer
            {...drawerProps}
            width={breakpoint.sm ? "500px" : "100%"}
            zIndex={1001}
        >
            <Edit
                deleteButtonProps={{onSuccess(_value) {
                    closeDrawer()
                }, successNotification: {
                    message: "Paper was successfully deleted",
                    type: "success",
                }}}
                saveButtonProps={saveButtonProps}
                resource="papers"
                recordItemId={editId}
                contentProps={{
                    style: {
                        boxShadow: "none",
                    },
                    bodyStyle: {
                        padding: 0,
                    },
                }}

            >
                <Form {...formProps} layout="vertical" >
                    <Form.Item
                        label={t("papers.fields.name")}
                        name="name"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
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
                                rules={[
                                    {
                                        required: true,
                                    }
                                ]}
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
                            >
                                <Input disabled={true} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={24}>
                            <Form.Item name="isFullPaper" >
                                <Radio.Group>
                                    <Radio value={true}>{t("papers.fields.isFullPaper.values.fullPaper")}</Radio>
                                    <Radio value={false}>{t("papers.fields.isFullPaper.values.inClassPaper")}</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />
                    <Row gutter={12}>
                        <Col xs={24} lg={10}>
                            <Form.Item
                                label={t("papers.fields.mcqCount")}
                                name="mcqCount"
                                rules={[{ type: "number" }]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    defaultValue={50}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={14}>
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Edit>
        </Drawer>
    );
};

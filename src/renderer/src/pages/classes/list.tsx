import {
    useTranslate,
    IResourceComponentsProps,
    useNavigation,
} from "@refinedev/core";
import {
    List,
    useTable,
    DateField,
} from "@refinedev/antd";
import { FormOutlined, MoreOutlined } from "@ant-design/icons";
import { Table, Dropdown, Menu } from "antd";

import { IClass } from "../../interfaces";

export const ClassList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<IClass>({
        sorters: {
            initial: [{
                field: "id",
                order: "desc",
            }]
        }
    });

    
    const { edit } = useNavigation();

    const t = useTranslate();

    const moreMenu = (id: number) => (
        <Menu mode="vertical">
            <Menu.Item
                key="1"
                style={{
                    fontSize: 15,
                    fontWeight: 500,
                }}
                icon={
                    <FormOutlined
                        style={{ color: "green", fontSize: "15px" }}
                    />
                }
                onClick={() => edit("Classs", id)}
            >
                {t("buttons.edit")}
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <List>
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        dataIndex="id"
                        align="center"
                        title={t("classes.fields.id")}
                        sorter
                    />
                    <Table.Column
                        dataIndex="name"
                        title={t("classes.fields.name")}
                    />
                    <Table.Column
                        dataIndex="alYear"
                        title={t("classes.fields.alYear")}
                    />
                    <Table.Column
                        dataIndex="type"
                        title={t("classes.fields.type.name")}
                    />
                    <Table.Column
                        dataIndex="createdAt"
                        title={t("classes.fields.createdAt")}
                        render={(value) => (
                            <DateField value={value} format="LLL" />
                        )}
                        sorter
                    />
                    <Table.Column<IClass>
                        fixed="right"
                        title={t("table.actions")}
                        dataIndex="actions"
                        key="actions"
                        align="center"
                        render={(_, record) => (
                            <Dropdown
                                overlay={moreMenu(record.id)}
                                trigger={["click"]}
                            >
                                <MoreOutlined
                                    style={{
                                        fontSize: 24,
                                    }}
                                />
                            </Dropdown>
                        )}
                    />
                </Table>
            </List>
        </>
    );
};

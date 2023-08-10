import { Image, Modal, Select, Space } from "antd";
import { createContext, FC, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import { ClusterOutlined } from '@ant-design/icons';
import { IClass } from "../../interfaces";
import { useSelect } from "@refinedev/antd";


type ClassSearchContext = {
    selectedClassId?: number;
    setSelectedClassId: (selectedClassId?: number) => void;
    openClassFilterDialog: boolean;
    setOpenClassFilterDialog: (open: boolean) => void;
};

export const ClassSearchContext = createContext<ClassSearchContext | undefined>(undefined);

export const ClassSearchProvider: FC<PropsWithChildren> = ({ children }) => {
    const [selectedClassId, setSelectedClassId] = useState<number>();
    const [openClassFilterDialog, setOpenClassFilterDialog] = useState(false);


    let inputRef = useRef<any>()


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


    useEffect(() => {
        if (!openClassFilterDialog) return;

        setTimeout(() => {
            inputRef.current?.focus()
        }, 1000)

    }, [openClassFilterDialog]);

    return (
        <ClassSearchContext.Provider value={{ selectedClassId, setSelectedClassId, openClassFilterDialog, setOpenClassFilterDialog }}>
            {children}
            <Modal
                maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
                width={400}
                centered
                open={openClassFilterDialog}
                title={<><ClusterOutlined /><span>&nbsp;&nbsp;&nbsp;Select a class</span></>}
                maskClosable={false}
                closable={false}
                footer={[]}
            >

                <Space
                    direction="vertical"
                    align="center"
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginBottom: "16px",
                        marginTop: '30px'
                    }}
                >
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                            maxWidth: "156px",
                        }}
                        preview={false}
                        src="/images/coaching.png"
                        alt="Class Location"
                    />
                </Space>
                <Select
                    {...selectClassesProps}
                    id="selectClass"
                    ref={inputRef}
                    className="select-class"
                    style={{
                        width: "100%",
                        fontWeight: 'bold'
                    }}
                    placeholder="Select a class to get started"
                    onSelect={(val) => {
                        setSelectedClassId(Number(val) || undefined)

                        if (!!val) {
                            setOpenClassFilterDialog(false)
                        }
                    }}
                    value={selectedClassId as any}
                    suffixIcon={<ClusterOutlined />}
                    allowClear
                />
            </Modal>
        </ClassSearchContext.Provider>
    );
};

export const useClassSearchProvider = () => {
    const context = useContext(ClassSearchContext);

    if (context === undefined) {
        throw new Error(
            "useClassSearchProvider must be used within a ClassSearchProvider",
        );
    }

    return context;
};

export const useMustHaveClassSelected = () => {
    const { selectedClassId, setOpenClassFilterDialog } = useClassSearchProvider();

    useEffect(() => {
        if (selectedClassId == null) {
            setOpenClassFilterDialog(true)
        }
    }, [selectedClassId]);

    return selectedClassId;
};

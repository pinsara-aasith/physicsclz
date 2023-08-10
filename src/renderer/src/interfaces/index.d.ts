import { Dayjs } from "dayjs";

// export interface IOrderChart {
//     count: number;
//     status:
//         | "waiting"
//         | "ready"
//         | "on the way"
//         | "delivered"
//         | "could not be delivered";
// }

// export interface IOrderTotalCount {
//     total: number;
//     totalDelivered: number;
// }

// export interface ISalesChart {
//     date: string;
//     title: "Order Count" | "Order Amount";
//     value: number;
// }

// export interface IOrderStatus {
//     id: number;
//     text: "Pending" | "Ready" | "On The Way" | "Delivered" | "Cancelled";
// }

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    gender: string;
    gsm: string;
    createdAt: string;
    isActive: boolean;
    avatar: IFile[];
    addresses: IAddress[];
}

export interface IIdentity {
    id: number;
    name: string;
    avatar: string;
}

export interface IAddress {
    text: string;
    coordinate: [string, string];
}

export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
}

export interface IEvent {
    date: string;
    status: string;
}

export interface IUserFilterVariables {
    q: string;
    status: boolean;
    createdAt: [Dayjs, Dayjs];
    gender: string;
    isActive: boolean;
}



export interface IStudent {
    id: number;
    barcodeNo: number;
    name: string;
    school: string;
    gender: string;
    description: string;
    profilePicture: IFile[];
    createdAt: string;
}

export interface IStudentFilterVariables {
    q: string;
    id: number;
    barcodeNo: number;
    createdAt: [Dayjs, Dayjs];
    gender: string;
    name: string;
    school: string;
    gender: string;
}

export interface IPaper {
    id: number;
    name: string;
    date: string;
    class: IClass;
    mcqCount: number;
    structuredEssayCount: number;
    essayCount: number;
    totalMarksForMCQ: number;
    totalMarksForStructuredEssay: number;
    totalMarksForEssay: number;
    isFullPaper: boolean;
    description: string;
}


export interface IPaperFilterVariables  {
    name: string;
    date: string;
    classId: string;
    isFullPaper: boolean;
    description: string;
}

export interface IMark {
    student: IStudent;
    paper: IPaper;
    mcq: number;
    structuredEssay: number;
    essay: number;
    total: number;
}

export interface IMarkFilterVariables  {
    studentId: number;
    paperId: number;
}

export interface IClass {
    id: any;
    name: string,
    alYear: number;
    type: string;
}
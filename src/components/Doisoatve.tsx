import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, DatePickerProps, Input, Layout, Radio, RadioChangeEvent, Row, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import moment, { now } from "moment";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { db } from "../firebase.config";
import '../styles/header.css'

interface tickets {
    Id: string;
    Code: string;
    Date: string;
    Gate: string;
    Status: string;
    Type: string;
}
const tagColor = (record: tickets) => {
    switch (record.Status) {
        case 'Chưa đối soát':
            return (
                <span style={{ color: "red" }}>
                    {record.Status}
                </span>
            )
        case 'Đã đối soát':
            return (
                <span style={{ color: "gray" }}>
                    {record.Status}
                </span>
            )
        default:
            return (
                <span style={{ color: "green" }}>
                    {record.Status}
                </span>
            )
    }
}
const { Search } = Input;
const Doisoatve = () => {
    const [tickets, setTickets] = useState<tickets[]>([])
    console.log(tickets);
    const ticketRef = collection(db, "doisoat");
    const { Header, Content, Footer, Sider } = Layout;
    const { Title } = Typography;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [FilterModalStatus, setFilterModalStatus] = useState();
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const dateFormat = "DD/MM/YYYY"
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Filter
    const radioButton = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setFilterModalStatus(e.target.value);
    };
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateFrom(moment(date).toDate())
    };
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateTo(moment(date).toDate())
    };

    const filter = () => {
        const filteredData = dataSource.filter(entry => {
            if (FilterModalStatus == "all") {
                return ((
                    moment(entry.Date, dateFormat).toDate() > dateFrom
                    && moment(entry.Date, dateFormat).toDate() < dateTo))
            }
            else {
                return ((
                    entry.Status == FilterModalStatus
                    && moment(entry.Date, dateFormat).toDate() > dateFrom
                    && moment(entry.Date, dateFormat).toDate() < dateTo))

            }
        })
        setDataSources(filteredData);
    }

    // Show list
    const getTickets = async () => {
        const data = await getDocs(ticketRef);
        const ticketResult: tickets[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            //console.log(doc)
            ticketResult.push({ Id: doc.id, Code: doc.get("Code"), Date: doc.get("Date"), Gate: doc.get("Gate"), Status: doc.get("Status"), Type: doc.get("Type") });

        });
        setTickets(ticketResult);
        setDataSources(ticketResult);
    };

    useEffect(() => {
        getTickets();
    }, [])

    const columns: ColumnsType<tickets> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, tickets: tickets) => (dataSource.indexOf(tickets) + 1)
        },
        {
            title: 'Mã vé',
            dataIndex: 'Code',
            key: 'Code',
        },
        {
            title: 'Loại vé',
            dataIndex: 'Type',
            key: 'Loại Vé',
        },
        {
            title: 'Ngày sử dụng',
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: 'Cổng',
            dataIndex: 'Gate',
            key: 'Gate',
        },
        {
            title: '',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record, index) => (tagColor(record))
        },
    ];

    const dataSource: tickets[] = tickets;
    const [dataSources, setDataSources] = useState(dataSource);
    const [SearchValue, setSearchValue] = useState('');
    const [FilteredData, SetFilteredData] = useState(dataSource);

    return (
        <>
            <Col className="site-layout-background" span={17}>

                <Title>Đối soát vé</Title>
                <div className="search-inner">
                    <Input
                        placeholder="Tìm theo số vé"
                        className="search"
                        suffix={<SearchOutlined />}
                        onChange={e => {
                            const currValue = e.target.value;
                            setSearchValue(currValue);
                            const filteredData = dataSource.filter(entry =>
                                entry.Code.includes(currValue)
                            );
                            setDataSources(filteredData)
                        }}
                        style={{ backgroundColor: '#EDEDED', width: '35%'}} />
                    <Space size={"small"} style={{ float: "right" }}>
                        <Button className="button-btn">
                            <CSVLink
                                filename={"Expense_Table.csv"}
                                data={dataSources}
                                className="btn-title">
                                <p>Xuất file (.csv)</p>
                            </CSVLink></Button>
                    </Space>
                </div>
                <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>


            </Col>
            <Content className="filter__ticket">
                <Sider className="side">
                    <Title>Lọc vé</Title>
                    <div className="filter__radio">
                        <Col span={12}><span className="radio-title">Tình trạng đối soát vé</span></Col>
                        <Col span={12}>
                            <Radio.Group value={FilterModalStatus} onChange={radioButton} defaultValue={"all"} >
                                <Space direction="vertical">
                                    <Radio value={"all"} className="vertical-radio">Tất cả</Radio>
                                    <Radio value={"Đã đối soát"} className="vertical-radio">Đã đối soát</Radio>
                                    <Radio value={"Chưa đối soát"} className="vertical-radio">Chưa đối soát</Radio>
                                </Space>
                            </Radio.Group>
                        </Col>
                    </div>

                    <div className="filter-category">
                        <span className="category-title">Loại vé</span>
                        <span className="category-content">Vé cổng</span>
                    </div>

                    <div className="filter__date">
                        <Col span={12}>
                            <span className="date-title">Từ ngày</span>
                        </Col>
                        <DatePicker onChange={onChange} format={dateFormat} className="form-input-date"/>
                    </div>

                    <div className="filter__date">
                        <Col span={12}>
                            <span className="date-title">Đến ngày</span>
                        </Col>
                        <DatePicker onChange={onChange1} format={dateFormat} className="form-input-date"/>
                    </div>

                    <div className="filter__button">
                        <button onClick={filter}>Lọc vé</button>
                    </div>
                </Sider>
            </Content>
        </>
    );
};
export default Doisoatve;
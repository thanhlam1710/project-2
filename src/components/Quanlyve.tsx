import { Button, Space, Table, Tag, Modal, Layout, DatePicker, DatePickerProps, Input, Checkbox, Col, Row, Radio, RadioChangeEvent } from "antd";
import { collection, doc, DocumentData, getDoc, getDocs, onSnapshot, query, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState, Fragment } from "react";
import { db } from "../firebase.config";
import type { ColumnsType } from 'antd/lib/table';
import { CSVLink } from "react-csv"
import moment, { Moment } from "moment";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import { RangePickerProps } from "antd/lib/date-picker";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import '../styles/header.css'
import { Typography } from 'antd';
const { Title } = Typography;
const { Footer, Sider, Content } = Layout;

interface tickets {
    Id: string;
    BlockingCode: string;
    Date: string;
    ExpireDate: string;
    Gate: string;
    Status: string;
    TicketNumber: string;
    Event: string;
}

const tagColor = (param: string) => {
    switch (param) {
        case 'used':
            return (
                <>
                    <Tag color='green'>Đã sử dụng</Tag>
                </>
            )
        case 'expire':
            return (
                <>
                    <Tag color='red'>Hết hạn</Tag>
                </>
            )
        default:
            return (
                <>
                    <Tag color='geekblue' >Chưa sử dụng</Tag>
                </>
            )
    }
}

const { Search } = Input;
const Quanlyve = () => {
    const [tickets, setTickets] = useState<tickets[]>([])
    const ticketRef = collection(db, "quanlyve");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const dateFormat = 'DD/MM/YYYY';
    const [DateData, setDateData] = useState('');
    const [modalTaskId, setModalTaskId] = useState<tickets>({ Id: '', BlockingCode: '', Date: '', ExpireDate: '', Gate: '', Status: '', TicketNumber: '', Event: '' });

    // State checkbox check-in
    const plainOptions = ['Cổng 1', 'Cổng 2', 'Cổng 3', 'Cổng 4', 'Cổng 5'];
    const [indeterminate, setIndeterminate] = useState(true);
    const [isCheckAll, setIsCheckAll] = useState(false);
    // State button lọc vé.
    const [filterModal, setFilterModal] = useState(false);
    const [DateFrom, setDateFrom] = useState(new Date());
    const [DateTo, setDateTo] = useState(new Date());
    const [FilterModalGate, setFilterModalGate] = useState<CheckboxValueType[]>();
    const [FilterModalStatus, setFilterModalStatus] = useState('all');

    console.log(tickets);

    const radioButton = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setFilterModalStatus(e.target.value);
    }
    const checkBox = (checkedValues: CheckboxValueType[]) => {
        // console.log('checked = ', checkedValues);
        setFilterModalGate(checkedValues);
        setIndeterminate(!!checkedValues.length && checkedValues.length < plainOptions.length);
        setIsCheckAll(checkedValues.length === plainOptions.length);
        // console.log('array checked : ' , FilterModalGate);     
    }

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
        setIsCheckAll(!isCheckAll);
        setFilterModalGate(e.target.checked ? plainOptions : []);
        setIndeterminate(false);

    };


    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        // console.log(dateString);
        setDateData(dateString);
    };

    //Modal lọc vé
    const handleOpenModal = () => {
        setFilterModal(true);
    }
    const handleCancelModal = () => {
        setFilterModal(false);
    }
    const handleModal = () => {

        const filteredData = dataSource.filter(entry => {
            if (FilterModalStatus == "all") {
                //console.log("all")
                return ((
                    FilterModalGate?.includes(entry.Gate)
                    && moment(entry.Date, dateFormat).toDate() > DateFrom
                    && moment(entry.Date, dateFormat).toDate() < DateTo))
            }
            else {
                return ((
                    entry.Status == FilterModalStatus
                    && FilterModalGate?.includes(entry.Gate)
                    && moment(entry.Date, dateFormat).toDate() > DateFrom
                    && moment(entry.Date, dateFormat).toDate() < DateTo))

            }
        }
        );
        setDataSources(filteredData);
        setFilterModal(false);
    }
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        //console.log(moment(date).toDate());
        setDateFrom(moment(date).toDate());
    };
    const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
        // console.log(date, dateString);
        setDateTo(moment(date).toDate());
    };

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };


    //modal update ngày vé
    const showModal = (data: tickets) => {
        setModalTaskId(data)
        setDateData(data.Date);
        setIsModalVisible(true);
    };
    const handleOk = (id: string, newDate: string) => {
        updateTicket(id, newDate);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const updateTicket = async (id: string, date: string) => {
        const data = doc(db, "quanlyve", id);
        const newFields = { Date: date };
        await updateDoc(data, newFields);
    }
    const getTickets = async () => {
        const data = await getDocs(ticketRef);
        const ticketResult: tickets[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            console.log(doc)
            ticketResult.push({ Id: doc.id, BlockingCode: doc.get("BlockingCode"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Gate: doc.get("Gate"), Status: doc.get("Status"), TicketNumber: doc.get("TicketNumber"), Event: doc.get("Event") });

        });
        setTickets(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getTickets();

    }, [isModalVisible])

    const columns: ColumnsType<tickets> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, tickets: tickets) => (dataSource.indexOf(tickets) + 1)

        },
        {
            title: 'BlockingCode',
            dataIndex: 'BlockingCode',
            key: 'BlockingCode',
        },
        {
            title: 'Số Vé',
            dataIndex: 'TicketNumber',
            key: 'Số Vé',
        },
        {
            title: 'Sự kiện',
            dataIndex: 'Event',
            key: 'Sự kiện',
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record) => (
                tagColor(record.Status)
            ),
        },
        {
            title: 'Ngày sử dụng',
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: 'Ngày xuất vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày xuất vé',
        },
        {
            title: 'Gate',
            dataIndex: 'Gate',
            key: 'Cổng',
            render: (_, record, index) => (
                <>
                    <Space size={"middle"}>
                        <text>{record.Gate}</text>
                        <Button icon={<MoreOutlined />} onClick={() => showModal(record)} ></Button>
                    </Space>
                </>

            ),
        },
    ];

    const dataSource: tickets[] = tickets;
    const [dataSources, setDataSources] = useState(dataSource);
    const [SearchValue, setSearchValue] = useState('');
    const [FilteredData, SetFilteredData] = useState(dataSource);

    return (
        <>
            <Content className="site-layout-background">
                <div>
                    <Title>Danh Sách Vé</Title>
                    <div className="search-inner">
                        <Input
                            placeholder="Tìm theo số vé"
                            className="search"
                            value={SearchValue}
                            suffix={<SearchOutlined />}
                            onChange={e => {
                                const currValue = e.target.value;
                                setSearchValue(currValue);
                                const filteredData = dataSource.filter(entry =>
                                    entry.TicketNumber.includes(currValue)
                                );
                                setDataSources(filteredData);
                            }}
                            style={{ backgroundColor: '#EDEDED' }}

                        />
                        <Space size={"small"} style={{ float: "right" }}>
                            <Button className="button-btn"><CSVLink
                                filename={"Table.csv"}
                                data={dataSource}
                            >
                                <span>Export to CSV</span>
                            </CSVLink></Button>
                            <Button
                                className="button-btn"
                                onClick={handleOpenModal}
                            ><span>Lọc vé</span>
                            </Button>
                        </Space>
                    </div>
                </div>

                <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
                <Modal visible={isModalVisible} onCancel={handleCancel} style={{ borderRadius: '15px' }}
                    footer={[
                        <div className="container">
                            <div className="form-button">
                                <button key="cancel" onClick={handleCancel} className="button">
                                    Hủy
                                </button>,
                                <button key="save" onClick={() => handleOk(modalTaskId.Id, DateData)}
                                    className="button">
                                    Lưu
                                </button>
                            </div>
                        </div>,
                    ]}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p className="title">Đổi ngày sử dụng vé</p>
                            </div>
                        </div>

                    ]}
                    width={600}>
                    <Row gutter={[12, 10]}>
                        <Col className="gutter-row" span={7}>
                            <div className="change-title">Số vé:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="change-content"><span>{modalTaskId.TicketNumber}</span></div>
                        </Col>
                        <Col className="gutter-row" span={7}>
                            <div className="change-title">Sự kiện:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="change-content">{modalTaskId.Event}</div>
                        </Col>
                        <Col className="gutter-row" span={7}>
                            <div className="change-title">Cổng:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="change-content">{modalTaskId.Gate}</div>
                        </Col>
                        <Col className="gutter-row" span={7}>
                            <div className="change-title">Ngày hết hạn:</div>
                        </Col>
                        <Col className="gutter-row" span={16}>
                            <div className="change-content">
                                <DatePicker onChange={onChange}
                                    placeholder={modalTaskId.Date} format="DD/MM/YYYY"
                                    className="form-input-date"
                                />
                            </div>
                        </Col>
                    </Row>

                </Modal>


                <Modal visible={filterModal} onOk={handleModal} onCancel={handleCancelModal}
                    footer={[
                        <div className="container">
                            <div className="form-button">
                                <button key="cancel" onClick={handleCancelModal} className="button">
                                    Hủy
                                </button>,
                                <button key="save" onClick={handleModal} className="button">
                                    Lọc
                                </button>
                            </div>
                        </div>,
                    ]}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p className="title">Lọc vé</p>
                            </div>
                        </div>
                    ]}
                    width={500}
                >

                    <Row>

                        <Col span={12}><span className="title-content">Từ ngày</span></Col>
                        <Col span={12}><span className="title-content">Đến ngày</span></Col>

                    </Row>
                    <Row>
                        <Col span={12}><DatePicker onChange={onChange1} onOk={onOk} format={dateFormat} className="form-input-date" /></Col>
                        <Col span={12}><DatePicker onChange={onChange2} onOk={onOk} format={dateFormat} className="form-input-date" /></Col>
                    </Row>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Tình trạng sử dụng</span></Col>
                    </Row>
                    <Space size={"large"} direction="horizontal" style={{ marginTop: '5px' }} className="filter-status">
                        <div>
                            <Radio.Group value={FilterModalStatus} onChange={radioButton}>
                                <Radio value={"all"} className="radio-content">Tất cả</Radio>
                                <Radio value={"used"} className="radio-content">Đã sử dụng</Radio>
                                <Radio value={"work"} className="radio-content">Chưa sử dụng</Radio>
                                <Radio value={"expire"} className="radio-content">Hết hạn</Radio>
                            </Radio.Group>
                        </div>
                    </Space>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Cổng check-in</span></Col>
                    </Row>
                    <div className="filter-check">
                        <Checkbox value="all" onChange={onCheckAllChange} indeterminate={indeterminate} checked={isCheckAll}><span className="checkbox-item">Tất cả</span></Checkbox>
                        <Checkbox.Group onChange={checkBox} options={plainOptions} value={FilterModalGate} disabled={isCheckAll} className="checkbox-item" />
                    </div>
                </Modal>
            </Content>
        </>
    );


};
export default Quanlyve;
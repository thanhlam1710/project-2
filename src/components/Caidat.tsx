import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, DatePicker, DatePickerProps, Divider, Input, Layout, Modal, Row, Select, Space, Table, Tag, TimePicker, TimePickerProps, Typography } from 'antd';
import { addDoc, collection, doc, DocumentData, getDocs, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { ColumnsType } from "antd/lib/table";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import moment, { Moment } from "moment";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { CSVLink } from "react-csv";
import '../styles/header.css'
const { Title } = Typography;
const { Content } = Layout;
interface events {
    Id: string;
    Code: string;
    Date: string;
    ExpireDate: string;
    Price?: string;
    Status: string;
    ComboPrice?: string;
    Name: string;
    DateHour: string;
    ExpireDateHour: string;
}
const tagColor = (param: string) => {
    switch (param) {
        case 'Đang áp dụng':
            return (
                <>
                    <Tag color='green'>{param}
                    </Tag>
                </>
            )
        case 'Tắt':
            return (
                <>
                    <Tag color='red'>{param}</Tag>
                </>
            )
        default:
            return (
                <>
                    <Tag color='grey'>{param}</Tag>
                </>
            )
    }
}
const Caidat = () => {
    const [events, setEvents] = useState<events[]>([])
    const eventRef = collection(db, "caidat");
    const [modalTaskId, setModalTaskId] = useState<events>({ Id: '', Code: '', Date: '', ExpireDate: '', Price: '', Status: 'Đang áp dụng', ComboPrice: '', Name: '', DateHour: '', ExpireDateHour: '' });
    const [isModalVisible, setIsModalVisible] = useState(false);

    //State input form
    const [codeForm, setCodeForm] = useState(modalTaskId.Code);
    const [dateForm, setDateForm] = useState(modalTaskId.Date);
    const [expireDateForm, setExpireDateForm] = useState(modalTaskId.ExpireDate);
    const [priceForm, setPriceForm] = useState(modalTaskId.Price);
    const [statusForm, setStatusForm] = useState(modalTaskId.Status);
    const [comboPriceForm, setComboPriceForm] = useState(modalTaskId.ComboPrice);
    const [name, setName] = useState(modalTaskId.Name);
    const [dateHour, setDateHour] = useState(modalTaskId.DateHour);
    const [expireDateHour, setExpireDateHour] = useState(modalTaskId.ExpireDateHour);
    const [isChecked, setIsCheck] = useState(false);
    const [isCheckedCombo, setIsCheckedCombo] = useState(false);

    //State add modal
    const [filterModal, setFilterModal] = useState(false);
    const [codeFormAdd, setCodeFormAdd] = useState("");
    const [dateFormAdd, setDateFormAdd] = useState("");
    const [expireDateFormAdd, setExpireDateFormAdd] = useState("");
    const [priceFormAdd, setPriceFormAdd] = useState("");
    const [statusFormAdd, setStatusFormAdd] = useState("");
    const [comboPriceFormAdd, setComboPriceFormAdd] = useState("");
    const [nameAdd, setNameAdd] = useState("");
    const [dateHourAdd, setDateHourAdd] = useState("");
    const [expireDateHourAdd, setExpireDateHourAdd] = useState("");

    // Xử lý Cập nhật
    const handleOk = (id: string) => {
        updateEvent(id);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Hiện chi tiết filed
    const showModal = (data: events) => {
        setModalTaskId(data)
        setName(data.Name)
        setCodeForm(data.Code)
        setDateForm(data.Date)
        setDateHour(data.DateHour)
        setExpireDateForm(data.ExpireDate)
        setExpireDateHour(data.ExpireDateHour)
        setComboPriceForm(data.ComboPrice)
        setPriceForm(data.Price)
        setStatusForm(data.Status)
        setIsModalVisible(true);
    };

    //Xử lý form checkbox
    const onChange = (checkedValues: CheckboxValueType[]) => {
        console.log('checked = ', checkedValues);

    };

    //Xử lý form option trạng thái
    const { Option } = Select;
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setStatusForm(value);
    };
    const handleChange1 = (value: string) => {
        console.log(`selected ${value}`);
        setStatusFormAdd(value);
    };

    //Xử lý form ngày và giờ
    const onChange1: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateForm(dateString)
    };
    const onChange2: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setExpireDateForm(dateString)
    };
    const onChange3 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setDateHour(timeString);
    };
    const onChange4 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setExpireDateHour(timeString);
    };
    const onChange5 = (e: CheckboxChangeEvent) => {
        console.log('checked = ', e.target.checked);
        setIsCheck(!isChecked);
    };

    const onChange6 = (e: CheckboxChangeEvent) => {
        console.log('checked = ', e.target.checked);
        setIsCheckedCombo(!isCheckedCombo);
    };


    // Hàm cập nhật
    const updateEvent = async (id: string) => {
        const data = doc(db, "caidat", id);
        const newFields = { Code: codeForm, Date: dateForm, ExpireDate: expireDateForm, Price: priceForm, Status: statusForm, ComboPrice: comboPriceForm, Name: name, DateHour: dateHour, ExpireDateHour: expireDateHour };
        await updateDoc(data, newFields);
        console.log(newFields);
    }

    //Hàm thêm
    const addEvent = async () => {
        const data = collection(db, "caidat");
        const newFields = { Code: codeFormAdd, Date: dateFormAdd, ExpireDate: expireDateFormAdd, Price: priceFormAdd, Status: statusFormAdd, ComboPrice: comboPriceFormAdd, Name: nameAdd, DateHour: dateHourAdd, ExpireDateHour: expireDateHourAdd };
        await addDoc(data, newFields)
    }

    //FUNCTION MODAL ADD EVENT :
    const showModalAdd = () => {
        setFilterModal(true);
    };
    const handleOpenModal = () => {
        addEvent();
        setFilterModal(false);
    }
    const handleCancelModal = () => {
        setFilterModal(false);
    }
    const onChange7: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setExpireDateFormAdd(dateString)
    };
    const onChange8: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        setDateFormAdd(dateString)
    };
    const onChange9 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setDateHourAdd(timeString);
    };
    const onChange10 = (time: Moment | null, timeString: string) => {
        console.log(time, timeString);
        setExpireDateHourAdd(timeString);
    };


    //get firebase data
    const getEvents = async () => {
        const data = await getDocs(eventRef);
        const ticketResult: events[] = [];
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        data.docs.map((doc) => {
            result.push(doc);
            console.log(doc)
            ticketResult.push({ Id: doc.id, Name: doc.get('Name'), Code: doc.get("Code"), Date: doc.get("Date"), ExpireDate: doc.get("ExpireDate"), Price: doc.get("Price"), Status: doc.get("Status"), ComboPrice: doc.get("ComboPrice"), DateHour: doc.get("DateHour"), ExpireDateHour: doc.get("ExpireDateHour"), });

        });

        setEvents(ticketResult);
        setDataSources(ticketResult);
    };
    useEffect(() => {

        getEvents();

    }, [isModalVisible, filterModal])
    const columns: ColumnsType<events> = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (text: string, events: events) => (dataSource.indexOf(events) + 1)

        },
        {
            title: 'Mã gói',
            dataIndex: 'Code',
            key: 'Code',
            //  render:(_, record) => (
            //      <text>{record.get("BlockingCode")}</text>
            //  ),
        },
        {
            title: 'Tên Gói',
            dataIndex: 'Name',
            key: 'Name',
            // render:(_, record) => (
            //      <text>{record.get("TicketNumber")}</text>
            //   ),
        },
        {
            title: 'Giá vé',
            dataIndex: 'Price',
            key: 'Price',
        },
        {
            title: 'Gía vé theo combo',
            dataIndex: 'ComboPrice',
            key: 'ComboPrice',
        },
        {
            title: 'Ngày áp dụng',
            dataIndex: 'Date',
            key: 'Ngày áp dụng',
            render: (_, record) => (
                <>
                    <Space>
                        <span>{record.Date}</span>
                        <span>{record.DateHour}</span>
                    </Space>
                </>
            ),

        },
        {
            title: 'Ngày hết hạn vé',
            dataIndex: 'ExpireDate',
            key: 'Ngày hết hạn vé',
            render: (_, record) => (
                <>
                    <Space>
                        <span>{record.ExpireDate}</span>
                        <span>{record.ExpireDateHour}</span>
                    </Space>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            render: (_, record, index) => (
                tagColor(record.Status)

            ),
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record) => (
                <>
                    <Space size={"middle"}>
                        <Button type="link" danger icon={<FormOutlined />} onClick={() => showModal(record)}>Cập nhật</Button>
                    </Space>
                </>
            ),
        },
    ];
    const dataSource: events[] = events;
    const [dataSources, setDataSources] = useState(dataSource);
    return (
        <>
            <Content className="site-layout-background">
                <div>
                    <Title>Danh Sách sự kiện</Title>
                    <div className="search-inner">
                        <Input
                            placeholder="Tìm theo số vé"
                            className="search"
                            suffix={<SearchOutlined />}
                            style={{ width: "25%", backgroundColor: '#EDEDED' }} />
                        <Space size={"small"} style={{ float: "right" }}>
                            <Button className="button-btn">
                                <CSVLink
                                    filename={"Expense_Table.csv"}
                                    data={dataSources}
                                    className="btn-title">
                                    <span>Export to CSV</span>
                                </CSVLink></Button>
                            <Button
                                className="button-btn"
                                onClick={showModalAdd}
                            >
                                <span>Thêm gói vé</span>
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Cập nhật gói vé */}
                <Modal
                    visible={isModalVisible} className="caidat-modal"
                    onOk={() => handleOk(modalTaskId.Id)} onCancel={handleCancel}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p className="title">Đổi ngày sử dụng vé</p>
                            </div>
                        </div>
                    ]}
                    footer={[
                        <div className="container">
                            <div className="form-button">
                                <button key="cancel" onClick={handleCancel} className="button">
                                    Hủy
                                </button>,
                                <button key="save" onClick={() => handleOk(modalTaskId.Id)}
                                    className="button">
                                    Lưu
                                </button></div></div>,
                    ]}
                >
                    <Row>

                        <Col span={12}><span className="title-content">Mã sự kiện</span></Col>
                        <Col span={12}><span className="title-content">Tên sự kiện</span></Col>

                    </Row>
                    <Row>
                        <Col span={12}><input placeholder={modalTaskId.Code} defaultValue={modalTaskId.Code} onChange={(event) => (setCodeForm(event.target.value))} value={modalTaskId.Code} className="form-input" />  </Col>
                        <Col span={12}><input placeholder={modalTaskId.Name} defaultValue={modalTaskId.Name} onChange={(event) => (setName(event.target.value))} value={modalTaskId.Name} className="form-input" />  </Col>
                    </Row>
                    <Row className="mt">
                        <Col span={12}><span className="title-content">Ngày áp dụng</span></Col>
                        <Col span={12}><span className="title-content">Ngày hết hạn</span></Col>
                    </Row>
                    <Row>
                        <Col span={12}> <DatePicker onChange={onChange1} className="form-input-date" />
                            <TimePicker onChange={onChange3} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} className="form-input-time" /></Col>
                        <Col span={12}><DatePicker onChange={onChange2} className="form-input-date" />
                            <TimePicker onChange={onChange4} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} className="form-input-time" /> </Col>
                    </Row>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Giá áp dụng</span></Col>
                    </Row>
                    <Row>
                        <div className="form-price">
                            <Checkbox value="Price" onChange={onChange5} className="price-checked">Vé lẻ (vnđ/vé) với giá</Checkbox>
                            <input placeholder={modalTaskId.Price} defaultValue={modalTaskId.Price} onChange={(event) => { setPriceForm(event.target.value) }} disabled={!isChecked} className="mr form-input-price" />
                            <label>/ Vé</label>
                        </div>

                    </Row>
                    <Row>
                        <div className="form-price">
                            <Checkbox value="Combo" onChange={onChange6} className="price-checked">Combo vé với giá</Checkbox>
                            <input placeholder={modalTaskId.ComboPrice} defaultValue={modalTaskId.ComboPrice} onChange={(event) => setComboPriceForm(event.target.value)} disabled={!isCheckedCombo} className="mr form-input-price"/>
                            <label>/ Vé</label>
                        </div>

                    </Row>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Tình trạng</span></Col>
                    </Row>
                    <Select onChange={handleChange} className="form-input-status">
                        <Option value="Tắt">Tắt</Option>
                        <Option value="Đang áp dụng">Đang áp dụng</Option>
                    </Select>
                </Modal>


                {/* Thêm gói vé */}
                <Modal
                    className="caidat-add" visible={filterModal} onOk={handleOpenModal} onCancel={handleCancelModal}
                    title={[
                        <div className="container">
                            <div className="center">
                                <p className="title">Thêm gói vé</p>
                            </div>
                        </div>
                    ]}
                    footer={[
                        <div className="container">
                            <div className="form-button">
                                <button key="cancel" onClick={handleCancelModal} className="button">
                                    Hủy
                                </button>,
                                <button key="save" onClick={handleOpenModal}
                                    className="button">
                                    Lưu
                                </button>
                            </div>
                        </div>,
                    ]}>
                    <Row>
                        <Col span={12}><span className="title-content">Mã sự kiện</span></Col>
                        <Col span={12}><span className="title-content">Tên sự kiện</span></Col>
                    </Row>
                    <Row>
                        <Col span={12}><input onChange={(event) => (setCodeFormAdd(event.target.value))} className="form-input" placeholder="Mã sự kiện" /></Col>
                        <Col span={12}><input onChange={(event) => (setNameAdd(event.target.value))} className="form-input" placeholder="Tên sự kiện" /></Col>
                    </Row>

                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Ngày áp dụng</span></Col>
                        <Col span={12}> <span className="title-content">Ngày hết hạn</span></Col>
                    </Row>
                    <Row>
                        <Col span={12}><DatePicker onChange={onChange8} className="form-input-date" />
                            <TimePicker onChange={onChange9} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} className="form-input-time" /></Col>
                        <Col span={12}><DatePicker onChange={onChange7} className="form-input-date" />
                            <TimePicker onChange={onChange10} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} className="form-input-time" /></Col>
                    </Row>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Giá áp dụng</span></Col>
                    </Row>
                    <Row>
                        <div className="form-price">
                            <Checkbox value="Price" onChange={onChange5} className="price-checked">Vé lẻ (vnđ/vé) với giá</Checkbox>
                            <input onChange={(event) => { setPriceFormAdd(event.target.value) }} disabled={!isChecked} placeholder="Giá vé" className="mr form-input-price" /><span> / Vé</span>
                        </div>
                    </Row>
                    <Row>
                        <div className="form-price">
                            <Checkbox value="Combo" onChange={onChange6} className="price-checked">Combo vé với giá</Checkbox>
                            <input onChange={(event) => setComboPriceFormAdd(event.target.value)} disabled={!isCheckedCombo} placeholder="Giá vé" className="mr form-input-price" /> <span> / Vé</span>
                        </div>
                    </Row>
                    <Row className="mt">
                        <Col span={12}> <span className="title-content">Tình trạng</span></Col>
                    </Row>
                    <Row>
                        <Select onChange={handleChange1} className="form-input-status">
                            <Option value="Tắt">Tắt</Option>
                            <Option value="Đang áp dụng">Đang áp dụng</Option>
                        </Select>
                    </Row>


                </Modal>
                <Table key="quanlyve" dataSource={dataSources} columns={columns}></Table>
            </Content>
        </>
    );


};
export default Caidat;
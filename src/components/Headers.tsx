import { BellOutlined, GithubOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Layout, Row } from "antd";
import { Input, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import '../styles/sidebar.css'

const onSearch = (value: string) => console.log(value);
const { Header, Sider, Content } = Layout;
const { Search } = Input;

export const Headers = () => {
    const navigate = useNavigate();
    return (
        <Row>
            <Col span={4}>
                <div className="header__logo">
                    <img src="./images/logo.png" alt="" className="header__logo-img" onClick={() => navigate('/')}/>
                </div>

            </Col>
            <Col span={20}>
                <div className="header">
                    <div className="header__search">
                        <input type='text' className='search' placeholder="Search" />
                        <SearchOutlined className="searchicon" />
                    </div>
                    <div className="header__icon">
                        <MailOutlined className="mailicon" />
                        <BellOutlined className="bellicon" />
                        <img src="https://lienminh.mobi/wp-content/uploads/2020/10/camile-toc-chien.jpg" alt="" />
                    </div>
                </div>
            </Col>
        </Row>


    );
}  
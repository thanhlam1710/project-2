import '../styles/header.css'
import { Avatar, Button, Layout, Menu, Input, Row, Col } from "antd";
import { Outlet, Link } from "react-router-dom";
import { Headers } from './Headers';
import { Sidebar } from './Sidebar';

import '../styles/style.css'

const { Search } = Input;
const { Footer, Sider, Content } = Layout;
const onSearch = (value: string) => console.log(value);
const Trangchu = () => {
  return (
    <Layout>
      <Headers />
      <Row>
        <Layout>
          <Col span={4}>
            <Sider style={{ color: '#f0f2f5', backgroundColor: "#f0f2f5" }}>
              <Sidebar />
            </Sider>
          </Col>
          <Col span={20}>
            <Layout>
              <Outlet />
            </Layout>
          </Col>
        </Layout>
      </Row>
    </Layout>
  );

};


export default Trangchu;
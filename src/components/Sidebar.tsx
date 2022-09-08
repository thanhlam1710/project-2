import { HomeOutlined, SettingOutlined, TagOutlined, WalletOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  const leftmenu = [
    {
      title: "Trang chủ",
      path: "/",
      icon: <HomeOutlined />,
    },
    {
      title: "Quản Lý vé",
      path: "/quan-ly-ve",
      icon: <WalletOutlined />,
    },
    {
      title: "Đổi Soát Vé",
      path: "/doi-soat-ve",
      icon: <TagOutlined />,
    },
    {
      title: "Cài Đặt",
      path: "/cai-dat",
      icon: <SettingOutlined />,
    }
  ]

  return (
    <>
      <div className="leftmenu">
      <ul>
        {
          leftmenu.map(e => { return <Link to={e.path} style={{ textDecoration: 'none' }}><li><div className='icon'>{e.icon}</div><span>{e.title}</span></li></Link> })
        }
      </ul>
    </div>
    </>
  )
}
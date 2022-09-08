import React from "react";
import { Routes, Route } from "react-router-dom";
import Caidat from "../components/Caidat";
import Home from "../components/chart/Home";
import Doisoatve from "../components/Doisoatve";
import Quanlyve from "../components/Quanlyve";
import Trangchu from "../components/Trangchu";
const MainRoutes = () => {
    return <div>
        <Routes>
            <Route path="/" element={<Trangchu/>}>
                <Route index element={<Home/>}/>
                <Route path="/doi-soat-ve" element={<Doisoatve />} />
                <Route path="/quan-ly-ve" element={<Quanlyve />} />
                <Route path="/cai-dat" element={<Caidat />} />
            </Route>
        </Routes>
    </div>
}
export default MainRoutes;
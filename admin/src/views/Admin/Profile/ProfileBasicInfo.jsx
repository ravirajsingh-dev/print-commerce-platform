import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const ProfileBasicInfo = () => {
  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const grapthCSS = { width: "900px", height: "340px" };

  return (
    <div className="mt-4" title="Mock Data">
      <Row>
        <Col md="4">
          <div className="crm-card">
            <h4 className="header-title mt-0 mb-3">Seller Information</h4>

            <div className="text-muted font-13">
              Hye, I’m Michael Franklin residing in this beautiful world. I
              create websites and mobile apps with great UX and UI design. I
              have done work with big companies like Nokia, Google and Yahoo.
              Meet me or Contact me for any queries. One Extra line for filling
              space. Fill as many you want.
            </div>

            <hr></hr>

            <div className="text-start">
              <div className="user-information">
                <strong>Full Name :</strong>
                <span className="ms-2">Michael A. Franklin</span>
              </div>

              <div className="user-information">
                <strong>Mobile :</strong>
                <span className="ms-2">(+12) 123 1234 567</span>
              </div>

              <div className="user-information">
                <strong>Email :</strong>
                <span className="ms-2">admin@example.com</span>
              </div>

              <div className="user-information">
                <strong>Location :</strong> <span className="ms-2">USA</span>
              </div>

              <div className="user-information">
                <strong>Languages :</strong>
                <span className="ms-2"> English, German, Spanish </span>
              </div>
              <div className="user-information mb-0" id="tooltip-container">
                <strong>Elsewhere :</strong>{" "}
                <Link to="/admin/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>
        </Col>

        <Col>
          <div className="crm-card">
            <h4 className="header-title mb-3">Orders &amp; Revenue</h4>
            <div dir="ltr">
              <div>
                <div className="chartjs-size-monitor">
                  <div className="chartjs-size-monitor-expand">
                    <div className=""></div>
                  </div>
                  <div className="chartjs-size-monitor-shrink">
                    <div className=""></div>
                  </div>
                </div>

                <div style={grapthCSS}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={data}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pv" fill="#8884d8" />
                      <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileBasicInfo;

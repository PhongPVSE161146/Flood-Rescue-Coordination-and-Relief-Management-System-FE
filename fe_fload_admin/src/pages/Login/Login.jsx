import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, InputAdornment } from "@mui/material";
import {
  PhoneAndroid,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Button } from "antd";
import { loginApi } from "../../../api/axios/Auth/authApi";
import bg from "../../../src/assets/LoginImage/images.jpeg";
import shield from "../../../src/assets/LoginImage/shield.svg";
import AuthNotify from "../../utils/Common/AuthNotify";

import "./login.css";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const redirectByRole = {
    admin: "/admin",
    manager: "/manager",
    rescueteam: "/rescueTeam",
    coordinator: "/coordinator",
  };

  const handleLogin = async () => {

    const e = {};
  
    if (!phone) e.phone = "Nhập số điện thoại";
  
    if (!password) e.password = "Nhập mật khẩu";
  
    setErrors(e);
  
    if (Object.keys(e).length) return;
  
    // try {
  
    //   const res = await loginApi({ phone, password });
  
    //   console.log("LOGIN RESPONSE:", res);
  
    //   // FIX TOKEN STORAGE
    //   localStorage.setItem(
    //     "accessToken",
    //     res.token
    //   );
  
    //   localStorage.setItem(
    //     "user",
    //     JSON.stringify(res.user)
    //   );
  
    //   localStorage.setItem(
    //     "role",
    //     res.user.roleName.toLowerCase()
    //   );
  
    //   localStorage.setItem(
    //     "isAuth",
    //     "true"
    //   );
  
    //   AuthNotify.success(
    //     "Đăng nhập thành công",
    //     `Chào mừng ${res.user.fullName}`
    //   );
  
    //   const role = res.user.roleName.toLowerCase();
  
    //   navigate(redirectByRole[role], { replace: true });
  
    // }
    try {
      const res = await loginApi({ phone, password });
      console.log("LOGIN RESPONSE:", res);

  
   sessionStorage.setItem("accessToken", res.token);
    sessionStorage.setItem("user", JSON.stringify(res.user));
     sessionStorage.setItem("role", res.user.roleName.toLowerCase());
    sessionStorage.setItem("isAuth", "true");
  
      AuthNotify.success("Đăng nhập thành công", `Chào mừng ${res.user.fullName}`);
  
      const role = res.user.roleName.toLowerCase();
      navigate(redirectByRole[role], { replace: true });
    }
    catch (error) {
  
      console.error(error);
  
      AuthNotify.error(
        "Sai số điện thoại hoặc mật khẩu"
      );
  
    }
  
  };

  return (
    <div className="login-page">
      {/* LEFT */}
<div className="login-hero">
  <video
    className="hero-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/Videonen.mp4" type="video/mp4" />
  </video>

  <div className="hero-overlay">
          <div className="hero-top">
            <img src={shield} alt="" />
            <span>PREMIUM COMMAND</span>
          </div>

          <h1>
            HỆ THỐNG <br />
            QUẢN LÝ & <span>BẢO MẬT</span>
          </h1>

          {/* <p>
            Giao diện điều hành thế hệ mới dành cho cán bộ
            vận hành cứu hộ quốc gia.
          </p> */}

          <div className="hero-metrics">
            <span>24/7 VẬN HÀNH</span>
            <span>AES-256</span>
            <span>REALTIME</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="login-card">
        <h2>Đăng nhập</h2>
        <div className="login-line" />
        <p className="login-desc">
          Truy cập hệ thống quản trị vận hành cao cấp
        </p>

        <div className="login-form">
          <div className="form-group">
            <label className="login-label">TÀI KHOẢN NỘI BỘ</label>
            <TextField
  fullWidth
  variant="filled"
  placeholder="Số điện thoại"
  value={phone}
  autoComplete="new-phone"
  name="phone_login_fake"
  onChange={(e) => setPhone(e.target.value)}
  error={!!errors.phone}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <PhoneAndroid />
      </InputAdornment>
    ),
  }}
/>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="login-label">MẬT KHẨU HỆ THỐNG</label>
            <TextField
  fullWidth
  variant="filled"
  type={show ? "text" : "password"}
  placeholder="Mật khẩu"
  value={password}
  autoComplete="new-password"
  name="password_login_fake"
  onChange={(e) => setPassword(e.target.value)}
  error={!!errors.password}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <LockOutlined />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment
        position="end"
        className="eye"
        onClick={() => setShow(!show)}
      >
        {show ? <VisibilityOff /> : <Visibility />}
      </InputAdornment>
    ),
  }}
/>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <Button
            block
            size="large"
            className="login-btn"
            onClick={handleLogin}
          >
            TRUY CẬP QUẢN TRỊ →
          </Button>
        </div>
      </div>
    </div>
  );
}

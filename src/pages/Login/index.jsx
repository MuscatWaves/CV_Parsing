import React from 'react'
import { UserOutlined, EyeTwoTone,  EyeInvisibleOutlined} from '@ant-design/icons';
import { Input, Button } from 'antd';
import ojimage from "../../images/oj.png"
import "./Login.css"
import {RiLockPasswordLine} from "react-icons/ri"

const Login = () => {
  return (
    <div className='body'>
      <div className='login-body'>
        <img className='oj-image' src={ojimage}/>
        <p className='oj-title'>Log in to CV Parser</p>
        <div className='name-bodies'>
          <p className='name-title'>Email</p>
          <Input size='large' type={"email"} placeholder={"Enter your email"} prefix={<UserOutlined />}></Input>
        </div>
        <div className='name-bodies'>
          <p className='name-title'>Password</p>
          <Input.Password
          size='large'
          placeholder="Enter your password"
          prefix={<RiLockPasswordLine />}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </div>
        <Button type='primary' className='button-primary' size='large'>Login</Button>
      </div>
    </div>
  )
}

export default Login;
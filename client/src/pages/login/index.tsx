//Pagina login
import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usuario, contrasena }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = `/home`;
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("Ocurrió un error al iniciar sesión " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mt-4">
        <div className="text-center">
        <h1 className="text-center mb-4">Iniciar sesión</h1>
        <Form name="login">
          <Form.Item
            name="user"
            rules={[
              { required: true, message: "Por favor ingrese su usuario" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingrese su contraseña" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Contraseña"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
        </div>
      </div>
  );
};

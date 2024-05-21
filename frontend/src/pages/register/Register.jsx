import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Alert, Input } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../../redux/actions/authActions.js'

const Register = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')

    const { error, loading, success } = useSelector((state) => state.adminRegister)

    const redirect = location.search ? location.search.split('=')[1] : '/'

    const handleSubmit = (values) => {
        console.log('values: ', values)
        const { name, email, password } = values
        dispatch(register({ name, email, password }))
    }
    
    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate({
                    pathname: '/login',
                    search: `?redirect=${redirect}`
                })
            }, 3000)
        }
        if (error) {
            console.log('error: ', error)
            setErrorMessage(error)
        } else {
            setErrorMessage('')
        }
    }, [success, redirect, navigate, error])

    return (
        <div className="register">
            {errorMessage ? (
                <div style={{ marginBottom: '24px' }}>
                    <Alert message={errorMessage} type="error" showIcon />
                </div>
            ) : null}
            <div className="container">
                <h1>Register</h1>
                <Form
                    name="normal_register"
                    initialValues={{
                        remember: true
                    }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="name"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Input
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="email"
                        rules={[
                            {
                                required: true
                            },
                            {
                                type: 'email'
                            }
                        ]}
                    >
                        <Input
                            type="email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="password"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Input.Password
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="confirm_password"
                        rules={[
                            {
                                required: true
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                                }
                            })
                        ]}
                        hasFeedback
                    >
                        <Input.Password
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="register-form-button"
                            // loading={isLoading}
                            size="large"
                            disabled={loading}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Register

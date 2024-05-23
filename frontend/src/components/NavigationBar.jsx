import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './NavigationBar.scss'
// import { useSelector } from 'react-redux'

const NavigationBar = () => {
    // const { currentAdmin } = useSelector((state) => state.adminLogin)

    const currentAdmin = { name: 'Huy' }
    const surveys = [{ qty: 1 }, { qty: 2 }, { qty: 3 }]

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>Survey App</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <LinkContainer to="/my-surveys">
                                <Nav.Link>
                                    <i className="fas fa-surveys"></i>{' '}
                                    {surveys.length > 0 && (
                                        <span
                                            className="survey">{surveys.reduce((acc, item) => acc + item.qty, 0)}</span>
                                    )}
                                </Nav.Link>
                            </LinkContainer>

                            {currentAdmin ? (
                                <NavDropdown title={currentAdmin.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/logout">
                                        <NavDropdown.Item>Logout</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavigationBar

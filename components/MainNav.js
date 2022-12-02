import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Link from 'next/link';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useRouter} from 'next/router';
import {useState} from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';

import { addToHistory } from '../lib/userData';
import { removeToken, readToken } from '../lib/authenticate';


export default function MainNav() {
    //Middleware
  const router = useRouter();

  //using useState hook
  const [searchField, setSearchField] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  //using Atom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  //submitting Form async fucntion
  const submitForm = async (e) => {
   e.preventDefault()
   setIsExpanded(false)
   router.push(`/artwork?title=true&q=${searchField}`)
   setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
   e.target.reset();
   
}

   let token = readToken();

   //logout function
   function logout() {   
      setIsExpanded(false);
      //will remove the function and redirect to login
      removeToken();
      router.push('/login');
   }
 
    return (
     <>
      <Navbar className="fixed-top navbar-dark bg-dark" bg="light" expand="lg" expanded={isExpanded}>
         <Container>
            <Navbar.Brand>Bhavy Piyushkumar Patel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={(e) => {setIsExpanded(!isExpanded)}}/>
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Link href="/" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/"}>Home</Nav.Link></Link>
                  {token 
                  && 
                  <Link href="/search" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/search"}>Advanced Search</Nav.Link></Link>
                  }
                  
               </Nav>
               &nbsp;
               {token && 
               <Form className="d-flex" onSubmit={submitForm}>
                  <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  onChange={(e) => {setSearchField(e.target.value)}}
                  />
                  <Button type="submit" variant="success">Search</Button>
               </Form>
               }
            
               &nbsp;
               {token 
                  ?
               <Nav>
                  <NavDropdown title={token.userName} id="basic-nav-dropdown" active={router.pathname === "/favourites" || router.pathname === "/history"} >
                     <Link href="/favourites" passHref legacyBehavior>
                        <NavDropdown.Item onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/favourites"}>Favourites</NavDropdown.Item>
                     </Link>
                     <Link href="/history" passHref legacyBehavior>
                        <NavDropdown.Item onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/history"}>Search History</NavDropdown.Item>
                     </Link>
                     <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
               </Nav>
               :
               <Nav className="ms-auto">
                  <Link href="/register" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/register"}>Register</Nav.Link></Link>
                  <Link href="/login" passHref legacyBehavior><Nav.Link onClick={(e) => {setIsExpanded(false)}} active={router.pathname === "/login"}>Login</Nav.Link></Link>
               </Nav>
               }
               
            </Navbar.Collapse>
         </Container>
      </Navbar>
      <br />
      <br />
     </>
    )
  }
  
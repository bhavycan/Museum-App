import {useRouter} from 'next/router';
import { Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import ListGroup from 'react-bootstrap/ListGroup';
import Error from 'next/error';
import Card from 'react-bootstrap/Card';
import styles from '../styles/History.module.css';
import { removeFromHistory } from '../lib/userData';


export default function AdvancedSearch() {

    //Middleware
  const router = useRouter();

  //using Atom
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  if(!searchHistory) return null;

  //Will push the object to save History in this array
  let parsedHistory = [];

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h);
    let entries = params.entries();
    parsedHistory.push(Object.fromEntries(entries));
  });

  function historyClicked(e, index) {
    e.preventDefault();
    let pushString = `/artwork?${searchHistory[index]}`
    router.push(pushString);
  }

  //async function removeHistoryClicked
    const removeHistoryClicked = async (e, index) => {
        e.stopPropagation(); 
        setSearchHistory(await removeFromHistory(searchHistory[index]))
    }

     //if no history [default Message]
  if (parsedHistory.length == 0) {
    return (
      <>
        <Row className="gy-4">
          <Card>
            <Card.Body>
                <h4>Nothing Here</h4>
                <br />
                Try searching for something else
            </Card.Body>
          </Card>
        </Row>
      </>
    );
  } else {  //rederring th history data
    return (
      <ListGroup>
        {parsedHistory?.map((historyItem, index) => (
          <ListGroup.Item key={index} onClick={(e)=>historyClicked(e,index)} className={styles.historyListItem}>
            {Object.keys(historyItem).map((key) => (
              <>
                {key}: <strong>{historyItem[key]}</strong>&nbsp;
              </>
            ))}
            <Button className="float-end" variant="danger" size="sm" onClick={e => removeHistoryClicked(e, index)}>&times;</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}
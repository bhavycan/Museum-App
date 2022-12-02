import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Col } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";
import Error from "next/error";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Pagination from 'react-bootstrap/Pagination';
import validObjectIDList from '../../public/data/validObjectIDList.json';

export default function Artwork(){
    const PER_PAGE = 12;
    const router = useRouter();

    const [artworkList, setArtworkList] = useState([]);
    const [page, setPage] = useState(1);

    
    let finalQuery = router.asPath.split('?')[1];

    const {data,error} = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    function previousPage(){
        if(page > 1){
            setPage(page=>page-1);
        }
    }

    function nextPage(){
        if(page<artworkList.length){
            setPage(page=>page+1);
        }
    }

    useEffect(() => {
        if(data != null && data!=undefined){
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            let results = [];
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }
            setArtworkList(results);
        }
        setPage(1);
    }, [data]);

    if(artworkList){
        if(artworkList.length == 0){
            return (
            <>
                <Row className="gy-4">
                    <Card>
                        <Card.Body>
                        <Card.Text>
                            <h4>Nothing Here</h4><br/>
                            Try searching for something else
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            </>);
        }
        else{
            return (<>
                <Row className="gy-4">
                    {artworkList[page-1]?.map((currentObjectID,index)=>(<Col lg={3} key={currentObjectID}><ArtworkCard objectID={currentObjectID} /></Col>))}
                </Row>
                <Row>
                    <Col>
                        <br/>
                        <Pagination>
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Col>
                </Row>
            </>)
        }
    }
    else{
        return (<><Error statusCode={404} /></>)
    }
}
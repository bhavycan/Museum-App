import useSWR from "swr";
import Error from "next/error";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Link from "next/link";

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );
  if (error) {
    return <Error statusCode={404} />;
  }
  if (data) {
    if (data.length == 0) {
      return null;
    } else {
      return (
        <Card>
          <Card.Img
            variant="top"
            src={
              data.primaryImageSmall
                ? data.primaryImageSmall
                : `https://via.placeholder.com/375x375.png?text=%5b+Not+Available+%5d`
            }
          />
          <Card.Body>
            <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
            <Card.Text>
              <strong>Date: </strong>
              {data.objectDate ? data.objectDate : "N/A"}
              <br />
              <strong>Classification: </strong>
              {data.classification ? data.classification : "N/A"}
              <br />
              <strong>Medium: </strong>
              {data.medium ? data.medium : "N/A"}
              <br />
              <br />
              <Link href={`/artwork/${objectID}`} passHref>
                <Button variant="outline-primary">{objectID}</Button>
              </Link>
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
  }
}

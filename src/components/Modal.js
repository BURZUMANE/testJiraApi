import React from "react";
import { Table } from "react-bootstrap";

const Modal = ({ setModal, data }) => {
  const handleClose = () => {
    setModal(false);
  };
  console.log(data);
  return (
    <div className="modaLcontainer">
      <div className="modalContent">
        <div className="titleWrapper">
          <h1>SPECIFIED ISSUES</h1>
          <button onClick={handleClose}>X</button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <td>key</td>
              <td>summary</td>
              <td>P</td>
              <td>resolution</td>
              <td>Created</td>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item, idx) => {
                const { summary, key, created, resolution, priority } = item;
                const date = new Date(created);
                const formattedDate = date
                  .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "/");
                console.log(formattedDate);
                return (
                  <tr key={idx}>
                    <td>{key}</td>
                    <td>{summary}</td>
                    <td>
                      <img src={priority} className="icon"></img>
                    </td>
                    <td>{!resolution && "unresolved"}</td>
                    <td>{formattedDate}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Modal;

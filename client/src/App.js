import React, { useEffect, useState, Fragment, Children } from "react";
import { Table } from "react-bootstrap";
import Modal from "./components/Modal";
import axios from "axios";
import Select from "react-select";
// import AsyncSelect from "react-select/async";
import "./main.css";
import Priorities from "./ui/Priorities";

function App() {
  const [showModal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [specifiedData, setSpecified] = useState([]);
  const [options, setOtions] = useState([
    {
      value: "issuetype+in+standardIssueTypes()+ORDER+BY+created+DESC",
      label: "All",
    },
    {
      value: "status+=+Done+order+by+created+DESC",
      label: "Done",
    },
    {
      value: `status%20%3D%20"In%20Progress"%20order%20by%20created%20DESC`,
      label: "In Progress",
    },
  ]);
  const [state, setState] = useState({
    selectedOption: null,
  });

  const handleChange = selectedOption => {
    setState({ selectedOption });
    const fetchData = async () => {
      const result = await axios.get(
        `http://localhost:5002/api/issues/${selectedOption.value}`,
      );
      console.log(result);
      setData(result.data);
    };
    fetchData();
  };

  const handleNumberClick = async jql => {
    setState({ selectedOption });
    // console.log(jql);
    const fetchData = async () => {
      const result = await axios.get(
        `http://localhost:5002/api/sepcified/${jql}`,
      );
      setSpecified(result.data);
    };
    await fetchData();
    await setModal(!showModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      const jql = "issuetype+in+standardIssueTypes()+ORDER+BY+created+DESC";
      const result = await axios.get(`http://localhost:5002/api/issues/${jql}`);
      setData(result.data);
    };
    fetchData();
  }, []);
  const dataEntries = Object.entries(data);
  const assignes = dataEntries.map(item => {
    return { name: item[0], content: item[1] };
  });
  const renderAssignes = (assigne, idx) => {
    const statusItems = Object.entries(assigne.content);
    return (
      <tr key={idx}>
        <td>
          <Table style={{}}>
            <tr>
              <td>
                <Table>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: "80%",
                        }}>
                        {assigne.name}
                      </td>
                      <td style={{ paddingTop: "0px" }}>
                        <Table>
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  className="icon"
                                  src="https://test-fast.atlassian.net/secure/viewavatar?size=medium&avatarId=10303&avatarType=issuetype"></img>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="icon"
                                  src="https://test-fast.atlassian.net/secure/viewavatar?size=medium&avatarId=10318&avatarType=issuetype"></img>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="icon"
                                  src="https://test-fast.atlassian.net/images/icons/issuetypes/epic.svg"></img>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img
                                  className="icon"
                                  src="https://test-fast.atlassian.net/secure/viewavatar?size=medium&avatarId=10315&avatarType=issuetype"></img>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </td>
            </tr>
          </Table>
        </td>
        {statusItems.length &&
          statusItems.map((item, idx) => {
            const taskTypes = item[1];
            const taskTypesArr = Object.entries(taskTypes);
            return (
              <td>
                <Table>
                  <tbody>
                    {taskTypesArr.map(item => {
                      const prioritis = Object.entries(item[1]);
                      return (
                        <tr>
                          {prioritis.map((item, idx) => {
                            const jql = item[1]["jql"];
                            return (
                              <td key={idx}>
                                {item[1]["content"].length && (
                                  <p
                                    className="bingo"
                                    onClick={() => handleNumberClick(jql)}>
                                    {item[1]["content"].length}
                                  </p>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </td>
            );
          })}
      </tr>
    );
  };
  const { selectedOption } = state;

  return (
    <div className="App">
      {showModal && <Modal setModal={setModal} data={specifiedData} />}
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>status 1</th>
            <th>status 2</th>
            <th>status 3</th>
            <th>status 4</th>
          </tr>
          <tr>
            <td>
              <Table>
                <tr>
                  <td style={{ width: "80%" }}> assigne</td>
                  <td>type</td>
                </tr>
              </Table>
            </td>
            <th>
              <Priorities />
            </th>
            <th>
              <Priorities />
            </th>
            <th>
              <Priorities />
            </th>
            <th>
              <Priorities />
            </th>
          </tr>
        </thead>
        <tbody>
          {assignes.length &&
            assignes.map((item, idx) => {
              return renderAssignes(item, idx);
            })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;

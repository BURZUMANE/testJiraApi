import { Table } from "react-bootstrap";

import React from "react";

const Priorities = () => {
  return (
    <Table>
      <tr>
        <td>
          <img
            src="https://test-fast.atlassian.net/images/icons/priorities/highest.svg"
            className="icon"></img>
        </td>
        <td>
          <img
            src="https://test-fast.atlassian.net/images/icons/priorities/high.svg"
            className="icon"></img>
        </td>
        <td>
          <img
            src="https://test-fast.atlassian.net/images/icons/priorities/medium.svg"
            className="icon"></img>
        </td>
        <td>
          <img
            src="https://test-fast.atlassian.net/images/icons/priorities/low.svg"
            className="icon"></img>
        </td>
      </tr>
    </Table>
  );
};

export default Priorities;

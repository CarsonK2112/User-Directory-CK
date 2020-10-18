import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import dayjs from "dayjs";
import Thead from "./components/header";
import Tbody from "./components/body";

function App() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const employeesFull = React.useRef(null);

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    if (employeesFull.current) {
      console.log("Filtering...", employeesFull);
      setEmployees(
        employeesFull.current.filter((employee) => {
          const name = `${employee.name.first} ${employee.name.last}`.toLowerCase();
          return name.indexOf(search) !== -1;
        })
      );
    }
  }, [search]);

  const getEmployees = async () => {
    const res = await axios.get(
      `https://randomuser.me/api/?results=200&nat=us`
    );
    employeesFull.current = res.data.results;
    setEmployees(employeesFull.current);
  };
  const isLoading = employeesFull.current === null;
  const isEmpty = employees.length === 0;

  return (
    <div className="App">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <header>
            <h1>Employee Directory</h1>
          </header>

          <form>
            <input
              onChange={(evt) => setSearch(evt.currentTarget.value)}
              placeholder="Search Employees"
              type="text"
              name="name"
              value={search}
            />
            {isEmpty ? <div>No Results...</div> : null}
          </form>

          <br />
          <h5>Alphabetical Order</h5>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              const newData = [...employeesFull.current];
              newData.sort((a, b) => {
                const nameA = a.name.first + "" + a.name.last;
                const nameB = b.name.first + "" + b.name.last;
                return nameA
                  .toLocaleString()
                  .localeCompare(nameB.toLocaleString());
              });
              setEmployees(newData);
            }}
          >
            Ascending
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              const newData = [...employeesFull.current];
              newData.sort((a, b) => {
                const nameA = a.name.first + "" + a.name.last;
                const nameB = b.name.first + "" + b.name.last;
                return nameB
                  .toLocaleString()
                  .localeCompare(nameA.toLocaleString());
              });
              setEmployees(newData);
            }}
          >
            Descending
          </button>
          <div>
            <br />
          </div>
          <table className="table">
            <Thead />
            <Tbody>
              {employees.map((employee) => (
                <tr key={employee.login.uuid}>
                  <th scope="row">
                    <img
                      alt={employee.picture.name}
                      src={employee.picture.thumbnail}
                    />
                  </th>
                  <td>{employee.name.first}</td>
                  <td>{employee.name.last}</td>
                  <td>{employee.cell}</td>
                  <td>{employee.email}</td>
                  <td>{dayjs(employee.dob.date).format("MM-DD-YYYY")}</td>
                </tr>
              ))}
            </Tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;

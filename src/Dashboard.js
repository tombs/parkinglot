import React from "react";
import "./App.css";

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      // Lot1 = {number: 1, size:0, distance:{A:10,B:15, C:20}, carParked: ''}
      // Lot2 = {number: 2, size:0, distance:{A:18,B:15, C:12}} carParked: ''}
      lots: [
        { id: 1, size: 0, distance: { A: 10, B: 14, C: 20 }, carParked: "" },
        { id: 2, size: 1, distance: { A: 19, B: 16, C: 13 }, carParked: "" },
        { id: 3, size: 2, distance: { A: 25, B: 20, C: 15 }, carParked: "" },
        { id: 4, size: 0, distance: { A: 5, B: 15, C: 10 }, carParked: "" },
      ],
      entrances: ["A", "B", "C"],
      // cars: [{plate: 'b', size: 0, assignedLot: 0, enteredFrom: '', timeEntered: null, timeExited: null, fee: 0}],
      cars: [],
      formEntrance: "",
      plate: "",
      size: 0,
      dailyFee: 5000.0,
      defaultCost: 40.0,
      rates: [
        { id: 1, size: 0, hourly: 20 },
        { id: 2, size: 1, hourly: 60 },
        { id: 3, size: 2, hourly: 100 },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleParkChange = this.handleParkChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getNearestLot = this.getNearestLot.bind(this);
    this.handleParkSubmit = this.handleParkSubmit.bind(this);
    this.getNearestLot = this.getNearestLot.bind(this);
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ [name]: value });
  };

  handleParkChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({ [name]: value });
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      entrances: this.state.entrances.concat(this.state.formEntrance),
    });
  }

  // Functio to determine nearest parking lot
  getNearestLot(lots, entrance, size) {
    console.log("SIZE");
    console.log(size);
    let candidates = [];
    for (let i = 0; i < lots.length; i++) {
      // Get all empty parking lots
      console.log(lots[i].carParked === "");
      if (lots[i].carParked === "" && lots[i].size >= size) {
        candidates.push({
          id: lots[i].id,
          distance: lots[i].distance[entrance],
        });
      }
      console.log(lots[i].distance[entrance]);
    }
    console.log("CANDIDATES: " + candidates);

    candidates.sort(function (a, b) {
      return a.distance - b.distance;
    });
    console.log("sorted CANDIDATES: " + candidates);

    if (candidates.length === 0) {
      return null;
    } else {
      console.log("NEAREST PARKING LOT IS (id): " + candidates[0].id);
      return candidates[0];
    }
  }

  // PARK function
  park(lot, car) {
    let lots = this.state.lots;
    console.log("LOT: " + lot);
    console.log("CAR: " + car);
    lot.carParked = car.plate;
    console.log(lot);
    let lotIndex = lots.findIndex((data) => data.id === lot.id);
    console.log("LOT INDEX: " + lotIndex);
    lots[lotIndex].carParked = car.plate;
    this.setState({ cars: this.state.cars.concat(car) });

    this.setState({ lots });
  }

  // UNPARK function
  unpark(plateNumber, lotNumber) {
    let lots = this.state.lots;
    let cars = this.state.cars;
    let lotIndex = lots.findIndex((data) => data.id === lotNumber);
    let carIndex = cars.findIndex((data) => data.plate === plateNumber);
    let exitTime = new Date();
    console.log("CAR INDEX: " + carIndex);
    console.log("LOT INDEX: " + lotIndex);
    lots[lotIndex].carParked = "";
    cars[carIndex].assignedLot = 0;
    cars[carIndex].timeExited = exitTime;
    cars[carIndex].fee = this.computFee(
      cars[carIndex],
      lots[lotIndex],
      exitTime
    );
    this.setState({ cars });
    this.setState({ lots });
  }

  // Converting Milliseconds to Hours (in decimal notation with 2 decimals)
  convertMS2HM(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    //let hours = Math.floor(minutes / 60);
    let hours = minutes / 60;

    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;

    minutes = minutes % 60;

    return hours.toFixed(2);
  }

  handleParkSubmit(entrance, event) {
    event.preventDefault();
    console.log("ENTRANCE: " + entrance);
    console.log("PLATE: " + event.target.elements.plate.value);
    console.log(typeof event.target.elements.size.value);
    const nearestLot = this.getNearestLot(
      this.state.lots,
      entrance,
      parseInt(event.target.elements.size.value)
    );
    if (!nearestLot) {
      alert("No available parking!");
    } else {
      const car = {};
      car.plate = event.target.elements.plate.value;
      car.size = parseInt(event.target.elements.size.value);
      car.assignedLot = nearestLot;
      car.enteredFrom = entrance;
      car.timeEntered = new Date();
      this.park(nearestLot, car);
    }
    event.target.elements.plate.value = "";
    event.target.elements.size.value = "";
  }

  computFee(car, lot, exitTime) {
    console.log("COMPUTING FEE");
    let cars = this.state.cars;
    const rates = this.state.rates;
    const dailyFee = this.state.dailyFee;
    let defaultCost = this.state.defaultCost;
    const rate = rates.find((data) => data.size === lot.size);
    let milliseconds = exitTime - car.timeEntered;
    let totalFee = 0;
    //let converted = this.convertMS2HM(20000000);
    let converted = this.convertMS2HM(milliseconds);
    console.log("CONVERTED: " + converted);

    let convertedRemainder = Math.ceil(converted % 24);
    let convertedDays = (converted / 24).toFixed(2);

    if (convertedDays >= 1.0) {
      console.log("MORE THAN 1 DAY HAS PASSED");
      console.log("NUMBER OF DAYS: " + Math.floor(convertedDays));
      console.log("NUMBER OF HOURS: " + Math.floor(convertedRemainder));
      totalFee =
        defaultCost +
        Math.floor(convertedDays) * dailyFee +
        convertedRemainder * rate.hourly;
    } else if (convertedDays < 1.0) {
      console.log("COMPUTING FOR SAME DAY");
      let flatConverted =
        converted < 3
          ? (converted = 0)
          : (converted = Math.ceil(converted - 3));
      console.log("NUMBER OF HOURS (OVER 3 HOURS): " + flatConverted);
      totalFee = defaultCost + flatConverted * rate.hourly;
    }

    console.log("TOTAL FEE: " + totalFee);
    return totalFee;
  }

  render() {
    const { entrances, lots, cars } = this.state;
    return (
      <div>
        {/* <h3><Car plate="XKK664"/></h3> */}
        {/* <form onSubmit={this.handleSubmit}>
                    <input type="text" name="formEntrance" onChange={this.handleChange} />
                    <input type="submit" value="Submit" />
                </form> */}

        {entrances.map((entrance) => {
          return (
            <div>
              <p>Entrance {entrance}</p>
              <form onSubmit={(e) => this.handleParkSubmit(entrance, e)}>
                <label> Plate Number </label>
                <input
                  id="plate"
                  type="text"
                  name="plate"
                  onChange={this.handleParkChange}
                />
                <label> Vehicle Size </label>
                <input
                  id="size"
                  type="text"
                  name="size"
                  onChange={this.handleParkChange}
                />
                <input type="submit" value="Park" />
              </form>
            </div>
          );
        })}

        <br />

        <table>
          <tbody>
            <tr>
              <th>Plate Number</th>
              <th>Vehicle Size</th>
              <th>Assigned Parking</th>
              <th>Entered From</th>
              <th>Time Entered</th>
              <th>Time Exited</th>
              <th>Fee</th>
              <th>Unpark</th>
            </tr>

            {cars.map((car) => {
              return (
                <tr>
                  <td>{car.plate}</td>
                  <td>{car.size}</td>
                  <td>{car.assignedLot.id}</td>
                  <td>{car.enteredFrom}</td>
                  <td>
                    {car.timeEntered ? car.timeEntered.toLocaleString() : ""}
                  </td>
                  <td>
                    {car.timeExited ? car.timeExited.toLocaleString() : ""}
                  </td>
                  <td>{car.fee}</td>
                  <td>
                    <button
                      onClick={() => {
                        this.unpark(car.plate, car.assignedLot.id);
                      }}
                    >
                      Unpark
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <br />

        <table>
          <tbody>
            <tr>
              <th>Lot ID</th>
              <th>Lot Size</th>
              <th>Lot Car Parked</th>
            </tr>

            {lots.map((lot) => {
              return (
                <tr>
                  <td>{lot.id}</td>
                  <td>{lot.size}</td>
                  <td>{lot.carParked}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Dashboard;

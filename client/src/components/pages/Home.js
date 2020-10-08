import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import UserContext from "../../context/userContext";
import { useHistory } from "react-router-dom";
import CalorieStats from "../layouts/CalorieStats";
import DailyDiary from "../layouts/DailyDiary";
import AppNav from "../layouts/AppNav";
import DatePicker from "../layouts/DatePicker";

export default function Home() {
  const { userData } = useContext(UserContext);
  const [listData, setListData] = useState([]);
  const [targetCal, setTargetCal] = useState(0);

  const [name, setName] = useState();
  const history = useHistory();

  async function getUsername() {
    let name = await userData.user.username;
    await setName(name);
  }

  async function getFood() {
    await axios
      .get("http://localhost:5000/list/all", {
        headers: { "x-auth-token": userData.token }
      })
      .then(res => {
        setListData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async function removeFood(id) {
    await axios
      .delete(`http://localhost:5000/list/${id}`, {
        headers: { "x-auth-token": userData.token }
      })
      .then(() => {
        getFood();
      })
      .catch(err => {
        console.log(err);
      });
  }

  const setTargetCalories = async () => {
    await axios
      .get(`http://localhost:5000/stats/${userData.id}`, {
        headers: { "x-auth-token": userData.token }
      })
      .then(res => {
        const cal = res.data.length === 0 ? 2000 : res.data[0].targetCalories;
        setTargetCal(cal);
      });
  };

  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
      return;
    }
    getFood();
    getUsername();
    setTargetCalories();
  }, [userData]);

  return (
    <div>
      <CalorieStats targetCal={targetCal} data={listData} name={name} />
      <DatePicker />
      <DailyDiary data={listData} delete={removeFood} />
      <AppNav />
    </div>
  );
}

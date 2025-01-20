import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ordered, restocked } from "../../../redux/reduxRessourceHumaine/rtk/features/cart/cartSlice";

export default function TestComp() {
    const numOfCakes = useSelector((state) => state.account.numOfCakes);
  const dispatch = useDispatch();
  return (
    <div style={{ marginTop: "10rem", marginLeft: "10rem", fontSize: "2rem" }}>
      Salut
      <h2>Nombre de gâteaux - {numOfCakes}</h2>
      <button onClick={() => dispatch(ordered())}>Commander un gâteau</button>
      <button onClick={() => dispatch(restocked(5))} >Rescaketocks</button>
    </div>
  );
}

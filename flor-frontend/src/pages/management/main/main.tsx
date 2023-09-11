import axios, { AxiosResponse } from "axios";
import { useEffect } from "react";
import { urlTickets } from "../../../services/endpoints";
import { Ticket } from "./main.model";

export default function Main() {
  const params = {
    start: new Date().getTime(),
    end: new Date().getTime(),
  };

  useEffect(() => {
    axios
      .get(urlTickets, { params })
      .then((response: AxiosResponse<Ticket[]>) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return <h3>Empty</h3>;
}

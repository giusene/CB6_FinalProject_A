import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { todaysShows } from "../utils/funcs";
import CinemaRoom from "../components/cinemaRoom/CinemaRoom";
import TicketBox from "../components/ticketBox";
import ModalPayment from "../components/modalPayment";
import Popup from "../components/popup/Popup";
import { FaCheck } from "react-icons/fa";
import styles from "../scss/pages/preorder.module.scss";

const Preorder = () => {
  const { info } = useParams();
  const [ticketList, setTicketList] = useState([]);
  const [ticketInfo, setTicketInfo] = useState({
    date: Date.parse(todaysShows(18, 0, 0)),
    seatNum: "",
    movie_title: "",
    movie_id: info,
    price: 9.5,
  });
  const [modalVisibility, setModalVisibility] = useState(false);
  const [reload, setReload] = useState(false);
  const [count, setCount] = useState(0);
  const [popupVisibility, setPopupVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // con questo metodo riportiamo la pagina info alla posizione iniziale (scroll) Ciao Fra :)
  }, []);

  const onPopupClosure = () => {
    setPopupVisibility(false);
  };

  const onHandleTickets = () => {
    navigate("/tickets");
  };

  return (
    <section
      className={`${styles.Preorder} section flex flex-column justify-content-center align-items-center`}
    >
      <CinemaRoom
        setTicketList={setTicketList}
        id={info}
        setTicketInfo={setTicketInfo}
        ticketInfo={ticketInfo}
        ticketList={ticketList}
        reload={reload}
        count={count}
        setCount={setCount}
      />
      <TicketBox
        ticketList={ticketList}
        setTicketList={setTicketList}
        setReload={setReload}
        setModalVisibility={setModalVisibility}
      />
      {modalVisibility && (
        <ModalPayment
          setModalVisibility={setModalVisibility}
          ticketList={ticketList}
          setTicketList={setTicketList}
          setReload={setReload}
          ticketInfo={ticketInfo}
          setCount={setCount}
          setPopupVisibility={setPopupVisibility}
        />
      )}
      {popupVisibility && (
        <Popup>
          <button onClick={onPopupClosure}>✖</button>
          <FaCheck />
          <h3>Payment success!</h3>
          <button onClick={onHandleTickets}>My tickets</button>
        </Popup>
      )}
    </section>
  );
};

export default Preorder;

import { useEffect, useState } from "react";
import { GET, GET_CAST } from "../../utils/https";
import { timetable } from "../../utils/mock/timetable";
import SeatList from "../seatList/SeatList";
import styles from "./index.module.scss";

import { db } from "../../../firebaseConfig";
import { onValue, ref } from "firebase/database";
import TicketBox from "../ticketBox";

const CinemaRoom = ({
  setTicketList,
  id,
  setTicketInfo,
  ticketInfo,
  ticketList,
  reload,
  count,
  setCount,
  setModalVisibility,
  setReload,
}) => {
  const [movieInfo, setMovieInfo] = useState({
    genres: [],
    overview: "",
    poster_path: "",
    release_date: "",
    runtime: null,
  });
  const [selectedHour, setSelectedHour] = useState(null);
  const [room, setRoom] = useState({});
  const [allSeats, setAllSeats] = useState(Array(60).fill(false));
  const [activeBtn, setActiveBtn] = useState("");
  const [credits, setCredits] = useState({
    cast: [],
    crew: [],
  });

  useEffect(() => {
    GET(id).then((data) => {
      setMovieInfo(data);
      setTicketInfo((prev) => ({ ...prev, movie_title: data.title }));
    });
    GET_CAST(id).then((data) => setCredits(data));
  }, []);

  useEffect(() => {
    const query = ref(db, "rooms");
    return onValue(query, (snapShot) => {
      const data = snapShot.val();
      setRoom(data);
      if (room[id]) {
        // console.log("trovato!");
        if (room[id][selectedHour]) {
          // console.log("Ci sono posti prenotati");
          setAllSeats(room[id][selectedHour]);
        } else {
          // console.log("Sala vuota");
          setAllSeats(Array(60).fill(false));
        }
      } else {
        // console.log("NON trovato!");
      }
    });
  }, [selectedHour, reload]);

  const onHourClick = (e) => {
    setSelectedHour(e.target.value);
    setCount(0);
    setTicketList([]);
    setTicketInfo((prev) => ({ ...prev, date: e.target.value }));
    setActiveBtn(+e.target.value);
  };

  return (
    <div
      className={`${styles.CinemaRoom} flex flex-column justify-content-center align-items-center`}
    >
      <div
        className={`${styles.upperInfo} section flex justify-content-center align-items-center`}
      >
        <div className={styles.imgWrapper}>
          {movieInfo.poster_path && (
            <img
              className={styles.posterImg}
              src={` https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
              alt={movieInfo.title}
            />
          )}
        </div>

        <div className={`${styles.movieDesc} flex flex-column`}>
          <h4>{movieInfo.title}</h4>
          <p className={styles.genre}>
            {movieInfo.genres.map((item) => item.name).join(" | ")}
          </p>
          <span className={styles.overview}>{movieInfo.overview}</span>
          <div className={`${styles.showInfo} flex`}>
            <p>
              <span className={styles.firstSpan}>Release Date:</span>{" "}
              <span className={styles.secondSpan}>
                {movieInfo.release_date}
              </span>
            </p>
            <p>
              <span className={styles.firstSpan}>Running Time:</span>
              <span className={styles.secondSpan}>
                {" "}
                {Math.floor(movieInfo.runtime / 60)}h {movieInfo.runtime % 60}
                min
              </span>
            </p>
          </div>
        </div>
        <div className={`${styles.credits} flex flex-column`}>
          <div className={styles.creditsWrapper}>
            <p className={styles.upperSpan}>Directed by:</p>
            <p className={styles.lowerSpan}>
              {credits.crew
                .filter((item) => item.job === "Director")
                .map((item) => item.name)
                .join(", ")}
            </p>
          </div>
          <div className={styles.creditsWrapper}>
            <p className={styles.upperSpan}>Starring:</p>
            <p className={styles.lowerSpan}>
              {credits.cast
                .map((item, i) => i < 5 && item.name)
                .slice(0, 5)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${styles.middleInfo} section flex justify-content-center align-items-center`}
      >
        <div
          className={`${styles.pickTime} ${selectedHour && styles.notVisible}`}
        >
          CHOOSE THE TIME...
        </div>

        <section className={`${styles.hour} flex`}>
          {timetable.map((hour) => (
            <button
              className={`${styles.btn} ${
                activeBtn === hour.value && styles.active
              }`}
              value={hour.value}
              onClick={onHourClick}
              key={hour.id}
            >
              {hour.time}
            </button>
          ))}
        </section>


        <div
          className={`${styles.pickTime} ${!selectedHour && styles.notVisible}`}
        >
          ...CHOOSE YOUR SEATS
        </div>


        <div
          className={`${styles.middleInfoWrapper} flex justify-content-center align-items-center`}
        >
          <div
            className={`${styles.leftMiddleInfo} flex flex-column justify-content-center align-items-center`}
          >
            <div className={styles.cinemaScreen}>
              <p className={styles.todaysMovie}>{movieInfo.title}</p>
              <div className={styles.imgOverlay}></div>
              {movieInfo.backdrop_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movieInfo.backdrop_path}`}
                  alt={movieInfo.title}
                />
              )}
            </div>
            {
              <>
                <SeatList
                  setCount={setCount}
                  setTicketList={setTicketList}
                  allSeats={allSeats}
                  ticketInfo={ticketInfo}
                  setTicketInfo={setTicketInfo}
                  ticketList={ticketList}
                  selectedHour={selectedHour}
                />
                <ul className={styles.showcase}>
                  <li>
                    <div className={styles.seatAvailable}></div>
                    <small>Available</small>
                  </li>
                  <li>
                    <div className={styles.seatSelected}></div>
                    <small>Selected</small>
                  </li>
                  <li>
                    <div className={styles.seatReserved}></div>
                    <small>Reserved</small>
                  </li>
                </ul>

                <p className={styles.text}>
                  You have selected{" "}
                  <span className={styles.bookInfo}>{count}</span> seats for{" "}
                  <span className={styles.bookInfo}>{movieInfo.title}</span>
                </p>
              </>
            }
          </div>
          <div
            className={`${styles.rightMiddleInfo} flex flex-column justify-content-between align-items-center`}
          >
            <TicketBox
              ticketList={ticketList}
              setModalVisibility={setModalVisibility}
              selectedHour={selectedHour}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemaRoom;
